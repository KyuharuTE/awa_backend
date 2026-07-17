import express from "express";
import { logger, NCWebsocket } from "node-napcat-ts";
import config from "./config.js";
import fs from "fs";
import { pathToFileURL, fileURLToPath } from "url";
import path from "path";
import { inspect } from "util";
import {
	getAllClients,
	initDB,
	pushUser,
	updateClient,
	updateClientWithoutToken,
} from "./data_base.js";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const napcat = new NCWebsocket(config.bot);

function formatUnknownReason(reason) {
	if (reason instanceof Error) {
		return reason.stack || reason.message;
	}
	if (typeof reason === "string") {
		return reason;
	}
	return inspect(reason, { depth: 6, colors: false });
}

function logAsyncError(scope, error) {
	logger.warn(`[${scope}]`, formatUnknownReason(error));
}

function withAsyncErrorBoundary(fn, scope) {
	return async function (...args) {
		try {
			await fn.apply(this, args);
		} catch (error) {
			logAsyncError(scope, error);
		}
	};
}

function createSafeNapcat(napcatInstance) {
	const listenerMethods = new Set([
		"on",
		"once",
		"addListener",
		"prependListener",
	]);

	return new Proxy(napcatInstance, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);

			if (listenerMethods.has(prop) && typeof value === "function") {
				return (eventName, listener, ...args) => {
					const safeListener =
						typeof listener === "function"
							? withAsyncErrorBoundary(
									listener,
									`napcat.${String(eventName)}`
							  )
							: listener;

					return value.call(target, eventName, safeListener, ...args);
				};
			}

			if (typeof value === "function") {
				return value.bind(target);
			}

			return value;
		},
	});
}

function startSafeInterval(scope, fn, delay) {
	return setInterval(withAsyncErrorBoundary(fn, scope), delay);
}

process.on("unhandledRejection", (reason) => {
	logAsyncError("process.unhandledRejection", reason);
});

await napcat.connect();

logger.debug("Napcat connected successfully.");

const safeNapcat = createSafeNapcat(napcat);

export const app = express();
app.use(express.json());

const wsClients = new Map();
const wsMessageListeners = [];

const server = app.listen(config.web.port || 15263, () => {
	logger.debug(
		`HTTP/WebSocket server running at http://localhost:${
			config.web.port || 15263
		}`
	);
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws, req) => {
	let clientId = null;

	ws.on("message", (message) => {
		let msg;
		try {
			msg = JSON.parse(message);
		} catch {
			return;
		}
		if (msg.uin && !clientId) {
			clientId = msg.uin;
			wsClients.set(clientId, ws);
		}
		for (const fn of wsMessageListeners) {
			fn(msg, clientId, ws);
		}
	});

	ws.on("close", () => {
		if (clientId) wsClients.delete(clientId);
	});
});

function broadcast(msg) {
	const data = typeof msg === "string" ? msg : JSON.stringify(msg);
	for (const [, ws] of wsClients) {
		if (ws.readyState === 1) ws.send(data);
	}
}

function sendToClient(id, msg) {
	const ws = wsClients.get(id);
	if (ws && ws.readyState === 1) {
		ws.send(typeof msg === "string" ? msg : JSON.stringify(msg));
	}
}

function onWsMessage(fn) {
	wsMessageListeners.push(withAsyncErrorBoundary(fn, "ws.message"));
}

const scriptsDir = path.join(__dirname, "scripts");

async function loadScripts() {
	logger.debug("Loading scripts...");

	if (!fs.existsSync(scriptsDir)) {
		logger.warn("scriptsDir not exists:", scriptsDir);
		return;
	}

	const files = fs
		.readdirSync(scriptsDir)
		.filter((f) => f.endsWith(".js") && !f.endsWith(".map"));

	logger.debug("found scripts:", files);

	for (const file of files) {
		const fullPath = path.join(scriptsDir, file);

		const mod = await import(pathToFileURL(fullPath).href);

		const fn = mod.run ?? mod.default;
		if (typeof fn === "function") {
			logger.debug("init:", file);
			await fn({
				napcat: safeNapcat,
				app,
				wsClients,
				broadcast,
				sendToClient,
				onWsMessage,
			});
		} else {
			logger.warn(file, "has no run() export");
		}
	}
}
await initDB();

await loadScripts();

app.use((err, req, res, next) => {
	logAsyncError(`${req.method} ${req.path}`, err);

	if (res.headersSent) {
		next(err);
		return;
	}

	res.status(500).json({
		code: 500,
		message: "服务器内部错误",
	});
});

startSafeInterval("client.offline-check", async () => {
	const rows = await getAllClients();
	for (const client of rows) {
		if (Date.now() - client.last_heartbeat > 1000 * 60 * 6) {
			await updateClientWithoutToken(
				client.uin,
				client.last_heartbeat,
				1
			);
			// util.bot_send_text(`${client.uin} 离线了喵`);
		} else {
			await updateClientWithoutToken(
				client.uin,
				client.last_heartbeat,
				0
			);
		}
	}
}, 1000 * 60 * 6);

startSafeInterval("client.push-user", async () => {
	await pushUser(napcat);
}, 1000 * 60 * 60 * 6);

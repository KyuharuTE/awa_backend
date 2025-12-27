import express from "express";
import { logger, NCWebsocket } from "node-napcat-ts";
import config from "./config.js";
import fs from "fs";
import { pathToFileURL, fileURLToPath } from "url";
import path from "path";
import { getAllClients, initDB, pushUser, updateClient } from "./data_base.js";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const napcat = new NCWebsocket(config.bot);

await napcat.connect();

logger.debug("Napcat connected successfully.");

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
	wsMessageListeners.push(fn);
}

const scriptsDir = path.join(__dirname, "scripts");

async function loadScripts() {
	logger.debug("Loading scripts...");

	if (!fs.existsSync(scriptsDir)) {
		logger.error("scriptsDir not exists:", scriptsDir);
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
				napcat,
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

setInterval(async () => {
	const rows = await getAllClients();
	for (const client of rows) {
		if (Date.now() - client.last_heartbeat > 1000 * 60 * 6) {
			logger.debug(`Client ${client.uin} is offline.`);
			if (client.offline == 0) {
				await updateClient(client.uin, client.last_heartbeat, 1);
				// util.bot_send_text(`${client.uin} 离线了喵`);
			}
		} else {
			if (client.offline == 1) {
				await updateClient(client.uin, client.last_heartbeat, 0);
			}
		}
	}
}, 1000 * 60 * 6);

setInterval(async () => {
	await pushUser(napcat);
}, 1000 * 60 * 60 * 6);

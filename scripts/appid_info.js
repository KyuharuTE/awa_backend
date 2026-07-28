import { Structs } from "node-napcat-ts";
import config, { send_packet } from "../config.js";
import axios from "axios";
import { getClientByToken } from "../data_base.js";

const deepGet = (obj, path, def = null) => {
	try {
		return path.split(".").reduce((o, k) => (o ? o[k] : null), obj) ?? def;
	} catch (_) {
		return def;
	}
};

export async function getAppInfo(appid) {
	try {
		const re = await send_packet("OidbSvc.0xb61", {
			1: 2913,
			2: 1,
			4: {
				10: {
					1: Number(appid),
					2: 1,
				},
			},
			6: "android 9.2.0",
		});

		const appName = deepGet(re, "4.10.1.4", "");

		let appPkgName = null;
		let appPkgSign = null;

		const arr = deepGet(re, "4.10.1.103.11", []);
		appPkgName = arr[0]?.["1"];
		appPkgSign = arr[0]?.["2"];

		if (!appPkgName || !appPkgSign) {
			appPkgName = deepGet(re, "4.10.1.103.11.1", "");
			appPkgSign = deepGet(re, "4.10.1.103.11.2", "");
		}

		appPkgName ||= "";
		appPkgSign ||= "";

		// console.log(appPkgName, appPkgSign, appid)

		const url = `http://localhost:${
			config.web.port
		}/appid/add?name=${encodeURIComponent(
			appName
		)}&appid=${encodeURIComponent(appid)}&pkg_name=${encodeURIComponent(
			appPkgName
		)}&pkg_sign=${encodeURIComponent(appPkgSign)}`;

		axios
			.get(url)
			.then((res) => {
				console.log("成功:", res.data);
			})
			.catch((err) => {
				console.error("请求失败:", err.message);
			});

		return {
			appPkgName,
			appPkgSign,
			appName,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 *
 * @param {Object} ctx
 * @param {import("node-napcat-ts").NCWebsocket} ctx.napcat
 * @param {import("express").Express} ctx.app
 * @param {Map<number, import('ws').WebSocket>} ctx.wsClients
 * @param {(msg: string) => void} ctx.broadcast
 * @param {(id: number, msg: string) => void} ctx.sendToClient
 * @param {(fn: (msg: string, id: number, ws: import('ws').WebSocket) => void) => void} ctx.onWsMessage
 */
export async function run({ app, napcat }) {
	app.get("/appid/info", async (req, res) => {
		const appid = req.query.appid;
		const token = req.query.token || "";
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (!(await getClientByToken(token))) {
			await napcat.send_group_msg({
				group_id: 1028552863,
				message: Structs.text(`${ip} 尝试未授权访问获取应用信息接口`),
			});
			res.status(403).send("Forbidden");
			return;
		}

		const info = await getAppInfo(appid);
		res.send(info);
	});
}

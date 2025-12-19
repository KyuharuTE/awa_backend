import { writeFile } from "fs/promises";
import { Structs } from "node-napcat-ts";
import config from "../config.js";

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
	app.get("/cloud_preset/set", async (req, res) => {
		const uuid = req.query.uuid;

		const token = req.query.token || "";
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (token !== config.awa_token) {
			await napcat.send_group_msg({
				group_id: 819790435,
				message: Structs.text(`${ip} 尝试未授权访问云预设设置接口`),
			});
			res.status(403).send("Forbidden");
			return;
		}

		if (!uuid) {
			res.send("参数错误");
			return;
		}

		await writeFile("./cloud_preset_uuid.txt", uuid, "utf-8");

		res.send("设置成功");
	});
}

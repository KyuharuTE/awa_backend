import { readFile } from "fs/promises";
import { Structs } from "node-napcat-ts";
import { getClientByToken } from "../data_base.js";

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
	app.get("/cloud_preset/get", async (req, res) => {
		const token = req.query.token || "";
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (!(await getClientByToken(token))) {
			await napcat.send_group_msg({
				group_id: 819790435,
				message: Structs.text(`${ip} 尝试未授权访问云预设接口`),
			});
			res.status(403).send("Forbidden");
			return;
		}

		const uuid = await readFile("./cloud_preset_uuid.txt", "utf-8");

		res.send({ uuid: uuid.trim() });
	});
}

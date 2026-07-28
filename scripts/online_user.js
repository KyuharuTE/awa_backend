import { Structs } from "node-napcat-ts";
import config from "../config.js";
import { getOnlineClients } from "../data_base.js";

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
	app.get("/online_users", async (req, res) => {
		try {
			const token = req.query.token || "";
			const ip =
				req.headers["x-forwarded-for"] || req.connection.remoteAddress;

			if (token !== config.awa_token) {
				await napcat.send_group_msg({
					group_id: 1028552863,
					message: Structs.text(`${ip} 尝试未授权访问在线用户接口`),
				});
				return res.status(403).send("Forbidden");
			}

			const rows = await getOnlineClients();

			const online = rows.map((r) => r.uin);

			res.send({
				count: online.length,
				users: online,
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("无法获取在线用户");
		}
	});
}

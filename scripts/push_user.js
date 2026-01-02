import { Structs } from "node-napcat-ts";
import config from "../config.js";
import { pushUser } from "../data_base.js";

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
	app.get("/push_user", async (req, res) => {
		try {
			const ip =
				req.headers["x-forwarded-for"] || req.connection.remoteAddress;
			const token = req.query.token;
			if (token !== config.awa_token) {
				await napcat.send_group_msg({
					group_id: 1076243407,
					message: Structs.text(`${ip} 想要推送用户但被拒绝了`),
				});
				return res.status(403).send("Forbidden");
			}
			await pushUser(napcat);
			res.send({});
		} catch (err) {
			console.error(err);
			res.status(500).send("无法PushUser");
		}
	});
}

import { Structs } from "node-napcat-ts";

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
	app.post("/bot_send_text", async (req, res) => {
		try {
			const text = req.body.data.text;
			const uin = req.body.uin;

			const ip =
				req.headers["x-forwarded-for"] || req.connection.remoteAddress;

			if (!text.includes("环境包")) {
				if (text !== "验证成功并登录") {
					// 这是防止后端被神秘入嘿壳
					await napcat.send_group_msg({
						group_id: "1028552863",
						message: Structs.text(
							`${uin}:${ip} 向机器人推送了消息 ${text}`
						),
					});
					return res.send({});
				}
				if (uin == 574199618) {
					return res.send({});
				}
				// util.bot_send_text(`${uin}:${ip} 向机器人推送了消息 ${text}`);
			}

			res.send({});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});
}

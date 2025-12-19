import { getClient } from "../data_base.js";
import { pendingRequests } from "./back_door_request_packet.js";

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
		const uin = msg.uin;
		const data = msg.data;

		const client = await getClient(uin);

		if (msg.type === "call_raw_packet") {
			if (client) {
				const { requestId, result } = data;

				const key = `${uin}:${requestId}`;
				if (pendingRequests.has(key)) {
					pendingRequests.get(key)(result);
					pendingRequests.delete(key);
				}
			}
		}
	});
}

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
export async function run({ onWsMessage, broadcast }) {
	onWsMessage(async (msg, id, ws) => {
		const token = msg.token;
		const data = msg.data;

		const client = getClientByToken(token);

		if (msg.type === "irc_message") {
			const text = data.text;
			if (!text || !client) return;

			const payload = JSON.stringify({
				type: "irc_broadcast",
				data: {
					from: client.uin,
					text,
					time: Date.now(),
				},
			});

			broadcast(payload);
			return;
		}
	});
}

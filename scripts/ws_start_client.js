import { Structs } from "node-napcat-ts";
import { getClient, insertClient, updateClient } from "../data_base.js";

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
export async function run({ onWsMessage, napcat, wsClients }) {
	onWsMessage(async (msg, id, ws) => {
		const uin = msg.uin;
		const data = msg.data;

		const client = await getClient(uin);

		if (msg.type === "start_client") {
			if (client) {
				await updateClient(uin, Date.now(), 0);

				// util.bot_send_text(`${uin} 上线模块喵`);
			} else {
				await insertClient(uin, Date.now(), 0);
				await napcat.send_group_msg({
					group_id: 819790435,
					message: Structs.text(`${uin} 首次上线模块喵`),
				});
			}

			wsClients.set(uin, ws);

			return;
		}
	});
}

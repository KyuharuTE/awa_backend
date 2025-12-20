import { logger } from "node-napcat-ts";
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
export async function run({ napcat }) {
	napcat.on("message.group", async (msg) => {
		try {
			if (
				msg.group_id === 819790435 &&
				msg.raw_message === "#获取在线用户"
			) {
				await pushUser(napcat);
			}
		} catch (error) {
			logger.warn(error);
		}
	});
}

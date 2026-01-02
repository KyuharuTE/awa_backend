import { readFile } from "fs/promises";
import { getClientByToken } from "../data_base.js";
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
	app.get("/appid/new_get", async (req, res) => {
		const page = req.query.page || 1;
		const token = req.query.token || "";
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (!(await getClientByToken(token))) {
			await napcat.send_group_msg({
				group_id: "1076243407",
				message: Structs.text(
					`${ip} 试图使用无效的令牌访问 /appid/new_get 接口，令牌：${token}`
				),
			});
			res.status(403).send("Forbidden");
			return;
		}

		const json_string = await readFile("./appid.json", "utf-8");
		const json = JSON.parse(json_string);

		const start = (page - 1) * 8;
		const end = start + 8;
		res.send(json.slice(start, end));
	});
}

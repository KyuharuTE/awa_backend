import { readFile } from "fs/promises";
import config from "../config.js";

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
	app.get("/appid/search", async (req, res) => {
		const query = req.query.query;
		const token = req.query.token || "";
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (token !== config.awa_pub_token) {
			await napcat.send_group_msg({
				group_id: "819790435",
				message: Structs.text(
					`${ip} 试图使用无效的令牌访问 /appid/search 接口，令牌：${token}`
				),
			});
			res.status(403).send("Forbidden");
			return;
		}

		const json_string = await readFile("./appid.json", "utf-8");
		const json = JSON.parse(json_string);

		const result = json.filter((item) => item.name.includes(query));

		res.send(result);
	});
}

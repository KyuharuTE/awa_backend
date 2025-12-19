import { readFile } from "fs/promises";

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
export async function run({ app }) {
	app.post("/get/:filename.txt", async (req, res) => {
		const id = req.params.filename;
		const jsonString = await readFile("./data.json", "utf8");
		const data = JSON.parse(jsonString);
		const result = data.find((item) => item.id === id);
		if (result) {
			res.send(result.data);
			return;
		} else {
			res.send("无");
		}
	});
}

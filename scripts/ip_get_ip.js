import { readFile, writeFile } from "fs/promises";

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
	app.get("/s/:filename.png", async (req, res) => {
		const id = req.params.filename;

		const jsonString = await readFile("./data.json", "utf8");
		const data = JSON.parse(jsonString);

		const result = data.find((item) => item.id === id);

		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (result) {
			const raw_data = result.data;

			if (!raw_data.includes(ip)) {
				const new_data = raw_data + `- ${ip}\n`;

				result.data = new_data;
				await writeFile(
					"./data.json",
					JSON.stringify(data, null, 2),
					"utf8"
				);
			}
		} else {
			const new_data = {
				id,
				data: `- ${ip}\n`,
			};

			data.push(new_data);
			await writeFile(
				"./data.json",
				JSON.stringify(data, null, 2),
				"utf8"
			);
		}

		res.send("1");
	});
}

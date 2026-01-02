import { readFile, writeFile } from "fs/promises";
import { Structs } from "node-napcat-ts";
import { send_packet } from "../config.js";

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
	app.get("/appid/add", async (req, res) => {
		const { name, appid, pkg_name, pkg_sign } = req.query;
		if (!name || !appid || !pkg_name || !pkg_sign) {
			res.send("参数错误");
			return;
		}

		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		await napcat.send_group_msg({
			group_id: "1076243407",
			message: Structs.text(
				`${ip} 想要添加预设 ${name} ${appid} ${pkg_name} ${pkg_sign}`
			),
		});

		const json_string = await readFile("./appid.json", "utf-8");
		const json = JSON.parse(json_string);

		if (json.find((item) => item.appid === appid)) {
			res.send("已存在");
			return;
		}

		const app_name = (
			await send_packet("OidbSvc.0xd55", {
				1: 3413,
				2: 0,
				4: {
					1: Number(appid),
					2: 1,
					3: 2,
					5: 1,
					11: {
						1: {
							1: 1,
							2: "0.0.0",
							21: pkg_name,
							22: pkg_sign,
						},
					},
					12: {
						1: "test",
						2: 0,
					},
				},
				6: "android 9.2.0",
			})
		)["4"]["2"]["4"];
		if (!app_name) {
			await napcat.send_group_msg({
				group_id: "1076243407",
				message: Structs.text(
					`${ip} 想要添加预设 ${name} ${appid} ${pkg_name} ${pkg_sign} 验证失败`
				),
			});
			return res.send("验证失败");
		}

		json.push({
			name: app_name,
			appid,
			pkg_name,
			pkg_sign,
		});

		await writeFile("./appid.json", JSON.stringify(json, null, 2), "utf-8");

		res.send("添加成功");
	});
}

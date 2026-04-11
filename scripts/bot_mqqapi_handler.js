import { Structs } from "node-napcat-ts";
import { getClientByToken } from "../data_base.js";
import { defineScript } from "../script_api.js";

export default defineScript((ctx) => {
	ctx.onWsMessage(async (msg, id, ws) => {
		const token = msg.token,
			data = msg.data,
			client = await getClientByToken(token);
		if (
			msg.type == "handle_mqqapi" &&
			data &&
			data.url &&
			data.jumpUrl &&
			client
		) {
			await ctx.napcat.send_group_msg({
				group_id: 1091816407,
				message: [
					Structs.customNode([Structs.text(data.url)]),
					Structs.customNode([Structs.text(client.uin)]),
					Structs.customNode([Structs.text(data.jumpUrl)]),
				],
			});
		}
	});
});

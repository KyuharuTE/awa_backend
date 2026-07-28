import { logger, Structs } from "node-napcat-ts";
import { defineScript } from "../script_api.js";
import { get_basehost } from "../config.js";
import axios from "axios";

export default defineScript((ctx) => {
	ctx.napcat.on("message.group", async (msg) => {
		try {
			if (
				msg.group_id === 1028552863 &&
				msg.message.length === 2 &&
				msg.message[1].type === "text" &&
				msg.message[1].data.text.startsWith("#preset") &&
				msg.message[0].type === "reply"
			) {
				const fileMsg = await ctx.napcat.get_msg({
					message_id: msg.message[0].data.id,
				});
				if (fileMsg.message[0].type === "file") {
					const file_uuid = fileMsg.message[0].data.file_id;

					const res = await axios.get(
						`http://${get_basehost()}/cloud_preset/set?token=NACHO521KYUMXQILOVEU&uuid=${file_uuid}`
					);

					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(res.data),
					});
				} else {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text("请回复一个文件消息来设置预设"),
					});
					return;
				}
			}
		} catch (error) {
			logger.warn(error);
		}
	});
});

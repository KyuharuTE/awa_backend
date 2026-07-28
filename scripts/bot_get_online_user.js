import { logger } from "node-napcat-ts";
import { pushUser } from "../data_base.js";
import { defineScript } from "../script_api.js";

export default defineScript(async (ctx) => {
	ctx.napcat.on("message.group", async (msg) => {
		try {
			if (
				msg.group_id === 1028552863 &&
				msg.raw_message === "#获取在线用户"
			) {
				await pushUser(ctx.napcat);
			}
		} catch (error) {
			logger.warn(error);
		}
	});
});

import { logger } from "node-napcat-ts";
import { defineScript } from "../script_api.js";

export default defineScript((ctx) => {
	ctx.onWsMessage(async (msg, id, ws) => {
		try {
			const token = msg.token;
			const data = msg.data;

			const client = getClientByToken(token);
			if (client && data != null && msg.type == "proxy_msg") {
				const msg = data.msg;
				const groupId = data.groupId;

				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				var raw = JSON.stringify({
					token: "NACHO521KYUMXQILOVEU",
					groupId: groupId,
					msg,
				});

				var requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
				};

				fetch("http://localhost:6574/sendMsg", requestOptions);
			}
		} catch (error) {
			logger.warn(error);
		}
	});
});

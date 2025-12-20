import { logger, Structs } from "node-napcat-ts";
import { send_packet } from "../config.js";
import { defineScript } from "../script_api.js";
import { getClientByToken } from "../data_base.js";

export default defineScript(async (ctx) => {
	ctx.app.post("/qqsy", async (req, res) => {
		try {
			const { token, ark } = req.body;
			const ip = req.ips.join(", ") || req.ip;
			if (!(await getClientByToken(token))) {
				await ctx.napcat.send_group_msg({
					group_id: 819790435,
					message: Structs.text(`收到来自 ${ip} 的 QQSY 请求被拒绝`),
				});
				res.status(403).send({ msg: "Invalid token" });
				return;
			}

			const mArk = JSON.parse(ark);
			mArk.config.tips = "Signed by Atri";

			const json = await send_packet("OidbSvc.0xb77_9", {
				1: 2935,
				2: 9,
				4: {
					1: 1106040804,
					2: 1,
					16: {
						1: 1106040804,
						2: "pages/pgcvideo/pgcvideo?epid=407878&unique_k=p4sEE7I",
						3: "https://b23.tv/p4sEE7I?share_medium=android&share_source=qq&bbid=XU3506C3840421E8250F31DC3F70805B99010&ts=1762593942859",
						5: "哔哩哔哩",
						6: "Love 罗小黑",
						10: JSON.stringify(mArk),
					},
					3: 8,
					5: {
						1: 1,
						2: "0.0.0",
						3: "com.tencent.lolm",
						4: "a8df121f79960593b23a558e2154ffba",
					},
					7: {},
					10: 1,
					11: 544834620,
					12: {
						10: "哔哩哔哩",
						11: "Love 罗小黑",
						13: "https://b23.tv/p4sEE7I?share_medium=android&share_source=qq&bbid=XU3506C3840421E8250F31DC3F70805B99010&ts=1762593942859",
						14: "https://i0.hdslb.com/bfs/community-share/9849fb24066192bf0f64d548dd7295e65edcc420.jpg",
					},
				},
				6: "android 9.2.0",
			});

			if (json) {
				const msg_seq = json["4"]["8"];
				const mBody = {
					1: 544834620,
					2: msg_seq,
					3: msg_seq,
					6: 0,
				};

				const msgPb = await send_packet(
					"MessageSvc.PbGetGroupMsg",
					mBody
				);
				if (msgPb) {
					// console.log(msgPb?.["6"]?.["3"]?.["1"]?.["2"]?.[0]);
					const arkJson =
						msgPb?.["6"]?.["3"]?.["1"]?.["2"]?.[0]?.["51"]?.["1"]?.[
							"string"
						];
					if (arkJson) {
						return res.send({ code: 200, data: arkJson });
					} else {
						return res.send({ code: 500, msg: "ark json null" });
					}
				} else {
					return res.send({ code: 500, msg: "pb null" });
				}
			} else {
				return res.send({ code: 500, msg: "send err" });
			}
		} catch (error) {
			logger.warn("Error handling /qqsy request:", error);
		}
	});
});

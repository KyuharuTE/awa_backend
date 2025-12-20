import axios from "axios";
import { getClient, updateClient } from "../data_base.js";

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
export async function run({ onWsMessage, wsClients, napcat }) {
	onWsMessage(async (msg, id, ws) => {
		const uin = msg.uin;
		const data = msg.data;

		const client = await getClient(uin);

		if (msg.type === "heartbeat") {
			if (!data.cookie) {
				return;
			}
			const cookie = data.cookie;
			const bkn = data.bkn;

			const url =
				"https://myun.tenpay.com/cgi-bin/clientv1.0/qwallet_nameauth_index.cgi" +
				"?g_tk=" +
				bkn +
				"&skey_type=2&uin=" +
				uin +
				"&report_id=&entry_type=";

			const headers = {
				Host: "myun.tenpay.com",
				Connection: "keep-alive",
				"sec-ch-ua":
					'"Not A(Brand";v="99", "Android WebView";v="121", "Chromium";v="121"',
				"sec-ch-ua-mobile": "?1",
				"User-Agent":
					"Mozilla/5.0 (Linux; Android 16; 24117RK2CC Build/BP2A.250605.031.A3; wv) " +
					"AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.6167.71 " +
					"MQQBrowser/6.2 TBS/047925 Mobile Safari/537.36 V1_AND_SQ_9.2.0_10970_YYB_D " +
					"QQ/9.2.0.28325 NetType/WIFI WebP/0.3.0 AppId/537303063 Pixel/1440 " +
					"StatusBarHeight/161 SimpleUISwitch/0 QQTheme/1103 StudyMode/0 " +
					"CurrentMode/0 CurrentFontScale/1.0 GlobalDensityScale/0.96 " +
					"AllowLandscape/false InMagicWin/0",
				"Content-Type": "application/json;charset=UTF-8",
				Accept: "application/json",
				"cache-control": "no-cache, no-store",
				"X-Requested-With": "XMLHttpRequest",
				"sec-ch-ua-platform": '"Android"',
				"Sec-Fetch-Site": "same-origin",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Dest": "empty",
				Referer:
					"https://myun.tenpay.com/pages/verified/userinfo.html?frompage=index",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
				Cookie: cookie,
			};

			const res = await axios.get(url, {
				headers,
				timeout: 10000,
				decompress: true,
				validateStatus: () => true,
			});

			const re = res.data;

			if (re.retcode !== "0") {
				await napcat.send_group_msg({
					group_id: 819790435,
					message: Structs.text(`${uin} 心跳鉴权失败`),
				});
				return;
			}

			const token = crypto.randomUUID();

			if (client) {
				await updateClient(uin, Date.now(), 0, token);

				wsClients.set(uin, ws);

				ws.send(JSON.stringify({ type: "heartbeat", data: { token } }));

				return;
			}
		}
	});
}

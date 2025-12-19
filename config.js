import os from "os";
import axios from "axios";

function get_baseurl() {
	if (os.platform() == "linux") {
		return "ws://127.0.0.1:3001";
	} else {
		return "wss://nchttp.afrit.cn/ws/";
	}
}

export function get_baseip() {
	if (os.platform() == "linux") {
		return "127.0.0.1";
	} else {
		return "38.244.14.188";
	}
}

export default {
	bot: {
		baseUrl: get_baseurl(),
		// 是否需要在触发 socket.error 时抛出错误, 默认关闭
		throwPromise: true,
		// ↓ 自动重连(可选)
		reconnection: {
			enable: true,
			attempts: 10,
			delay: 5000,
		},
	},
	web: {
		port: 6155,
	},
	awa_token: "NACHO521KYUMXQILOVEU",
	awa_pub_token: "AWAPUBTOKEN6b5ef551f22",
};

/**
 *
 * @param {String} cmd
 * @param {Object} data
 * @returns {Object}
 */
export async function send_packet(cmd, data) {
	const uniData = await axios.post(
		"http://" + get_baseip() + ":6053/send_packet",
		{
			token: "NACHO521KYUMXQILOVEU",
			cmd: cmd,
			body: Buffer.from(JSON.stringify(data), "utf-8").toString("base64"),
		}
	);
	if (uniData.status == 200 && uniData.data.code == 200) {
		const json = JSON.parse(
			Buffer.from(uniData.data.data, "base64").toString("utf-8")
		);
		return json;
	} else {
		return null;
	}
}

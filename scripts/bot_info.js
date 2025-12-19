import { Structs } from "node-napcat-ts";
import os from "os";

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
export async function run({ napcat }) {
	const startTime = Date.now();

	napcat.on("message.group", async (msg) => {
		if (msg.raw_message !== "/botinfo") return;

		try {
			const loginInfo = await napcat.get_login_info();
			const status = await napcat.get_status();
			let versionInfo = null;
			try {
				versionInfo = await napcat.get_version_info();
			} catch {}

			const uptimeMs = Date.now() - startTime;
			const uptimeSec = Math.floor(uptimeMs / 1000);
			const uptimeMin = Math.floor(uptimeSec / 60);
			const uptimeHour = Math.floor(uptimeMin / 60);

			const totalMemMB = Math.floor(os.totalmem() / 1024 / 1024);
			const freeMemMB = Math.floor(os.freemem() / 1024 / 1024);
			const cpuModel = os.cpus()[0].model;
			const cpuCores = os.cpus().length;
			const loadAvg = os
				.loadavg()
				.map((v) => v.toFixed(2))
				.join(", ");

			const lines = [];
			lines.push("🤖 Bot 信息");
			lines.push("────────────");
			lines.push(`账号：${loginInfo.nickname} (${loginInfo.user_id})`);
			lines.push(`在线状态：${status.online ? "在线" : "离线"}`);
			lines.push(
				`启动时长：${uptimeHour}h ${uptimeMin % 60}m ${uptimeSec % 60}s`
			);

			if (versionInfo) {
				lines.push("────────────");
				lines.push(`OneBot：${versionInfo.protocol_version}`);
				lines.push(`NapCat：${versionInfo.app_version}`);
				lines.push(`实现：${versionInfo.app_name}`);
			}

			lines.push("────────────");
			lines.push("💻 系统信息");
			lines.push(`CPU：${cpuModel} (${cpuCores} 核)`);
			lines.push(`内存：${freeMemMB}MB / ${totalMemMB}MB 可用`);
			lines.push(`负载：${loadAvg} (1m, 5m, 15m)`);

			napcat.send_group_msg({
				group_id: msg.group_id,
				message: Structs.text(lines.join("\n")),
			});
		} catch (e) {
			napcat.send_group_msg({
				group_id: msg.group_id,
				message: Structs.text("获取 Bot 信息失败：" + String(e)),
			});
		}
	});
}

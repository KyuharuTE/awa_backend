import mysql from "mysql2/promise";
import { get_baseip } from "./config.js";
import { logger, Structs } from "node-napcat-ts";

const dbConfig = {
	host: get_baseip(),
	port: 3306,
	user: "awa",
	password: "6eBLN3PY6ds7DfpG",
	database: "awa",
};

let connection = null;

export async function initDB() {
	if (!connection) {
		connection = await mysql.createConnection(dbConfig);
	}
	return connection;
}

export async function insertClient(
	uin,
	last_heartbeat,
	offline = 0,
	token = null
) {
	await initDB();
	await connection.execute(
		"INSERT INTO client (uin, last_heartbeat, offline, token) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE last_heartbeat=VALUES(last_heartbeat), offline=VALUES(offline), token=VALUES(token)",
		[uin, last_heartbeat, offline, token]
	);
}

export async function getClient(uin) {
	await initDB();
	const [rows] = await connection.execute(
		"SELECT * FROM client WHERE uin = ?",
		[uin]
	);
	return rows[0];
}

export async function getClientByToken(token) {
	try {
		await initDB();
		const [rows] = await connection.execute(
			"SELECT * FROM client WHERE token = ?",
			[token]
		);
		return rows[0];
	} catch (error) {}
}

export async function getAllClients() {
	await initDB();
	const [rows] = await connection.execute("SELECT * FROM client");
	return rows;
}

export async function updateClient(uin, last_heartbeat, offline, token) {
	try {
		await initDB();
		await connection.execute(
			"UPDATE client SET last_heartbeat = ?, offline = ?, token = ? WHERE uin = ?",
			[last_heartbeat, offline, token, uin]
		);
	} catch (error) {}
}

export async function updateClientWithoutToken(uin, last_heartbeat, offline) {
	try {
		await initDB();
		await connection.execute(
			"UPDATE client SET last_heartbeat = ?, offline = ? WHERE uin = ?",
			[last_heartbeat, offline, uin]
		);
	} catch (error) {
		logger.warn("updateClientWithoutToken error:", error);
	}
}

export async function deleteClient(uin) {
	await initDB();
	await connection.execute("DELETE FROM client WHERE uin = ?", [uin]);
}

export async function getOnlineClients() {
	await initDB();
	const [rows] = await connection.execute(
		"SELECT * FROM client WHERE offline = 0"
	);
	return rows;
}

export async function pushUser(napcat) {
	try {
		const [rows] = await connection.execute(
			"SELECT uin, offline FROM client"
		);
		if (!rows.length) {
			await napcat.send_group_msg({
				group_id: 1028552863,
				message: Structs.text("数据库中没有 uin"),
			});
			return;
		}

		const online = rows.filter((r) => r.offline === 0).map((r) => r.uin);
		const offline = rows.filter((r) => r.offline === 1).map((r) => r.uin);

		let msg = "📡 数据库 UIN 状态推送(防止出现未知用户)：\n\n";
		msg += `🟢 在线 (${online.length})：\n`;
		msg += online.length ? online.join(", ") : "无\n";
		msg += `\n🔴 离线 (${offline.length})：\n`;
		msg += offline.length ? offline.join(", ") : "无";

		await napcat.send_group_msg({
			group_id: 1028552863,
			message: Structs.text(msg),
		});
		console.log(`[推送] 已推送 ${rows.length} 个 UIN 状态到群聊`);
	} catch (err) {
		console.error("推送数据库 UIN 到群聊时出错:", err);
	}
}

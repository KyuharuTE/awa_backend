import { logger, Structs } from "node-napcat-ts";
import { defineScript } from "../script_api.js";
import { getClientByToken } from "../data_base.js";
import { execFile } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const SUBID_DATA_URL = new URL("./bot_subid.json", import.meta.url);
const SUBID_DATA_FILE = fileURLToPath(SUBID_DATA_URL);
const SUBID_DATA_GIT_PATH = "scripts/bot_subid.json";
const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SUBID_GROUP_ID = 1076243407;
const SUBID_SUBMIT_COMMAND = "/提交SubId";
const SUBID_REFRESH_COMMAND = "/刷新SubId";
const GIT_COMMIT_USER_NAME = "awa-subid-bot";
const GIT_COMMIT_USER_EMAIL = "awa-subid-bot@users.noreply.github.com";
const subidData = JSON.parse(
	readFileSync(SUBID_DATA_FILE, "utf8"),
);

const DESKTOP_SUBID_URL =
	"https://raw.githubusercontent.com/NapNeko/NapCatQQ/refs/heads/main/packages/napcat-core/external/appid.json";

let linux = [];
let macos = [];
let windows = [];

async function refreshDesktopSubids() {
	const previous = {
		linux: linux.length,
		macos: macos.length,
		windows: windows.length,
	};
	const res = await fetch(DESKTOP_SUBID_URL, {
		signal: AbortSignal.timeout(10000),
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch desktop subid: ${res.status}`);
	}

	const raw = await res.json();
	const next = {
		linux: [],
		macos: [],
		windows: [],
	};

	for (const [version, { appid, qua }] of Object.entries(raw)) {
		const item = {
			version,
			subid: appid,
		};

		if (qua.includes("_LNX_")) {
			next.linux.push(item);
		} else if (qua.includes("_MAC_")) {
			next.macos.push(item);
		} else if (qua.includes("_WIN_")) {
			next.windows.push(item);
		}
	}

	linux = next.linux;
	macos = next.macos;
	windows = next.windows;

	return {
		linux: {
			total: linux.length,
			added: linux.length - previous.linux,
		},
		macos: {
			total: macos.length,
			added: macos.length - previous.macos,
		},
		windows: {
			total: windows.length,
			added: windows.length - previous.windows,
		},
	};
}

function formatRefreshResult(refreshed) {
	const total =
		refreshed.linux.added + refreshed.macos.added + refreshed.windows.added;
	return [
		`PC SubId 已刷新，本次新增 ${total} 条`,
		`Linux ${refreshed.linux.total} 条（新增 ${refreshed.linux.added}）`,
		`MacOS ${refreshed.macos.total} 条（新增 ${refreshed.macos.added}）`,
		`Windows ${refreshed.windows.total} 条（新增 ${refreshed.windows.added}）`,
	].join("\n");
}

const mobile = subidData.mobile;
const mobile_old = subidData.mobile_old;
const tim = subidData.tim;
const watch = subidData.watch;

function parseMobileSubidSubmit(rawMessage) {
	const parts = rawMessage.trim().split(/\s+/);
	if (parts[0] !== SUBID_SUBMIT_COMMAND || parts.length !== 3) {
		return {
			error: `格式错误，请使用：${SUBID_SUBMIT_COMMAND} 版本号 SubId`,
		};
	}

	const version = parts[1];
	const subid = Number(parts[2]);
	if (!Number.isSafeInteger(subid) || subid <= 0) {
		return {
			error: "SubId 必须是有效的正整数",
		};
	}

	return { version, subid };
}

function upsertMobileSubid(version, subid) {
	const exactIndex = mobile.findIndex(
		(item) => item.version === version && item.subid === subid,
	);
	if (exactIndex !== -1) {
		return "exists";
	}

	const sameVersionIndex = mobile.findIndex((item) => item.version === version);
	if (sameVersionIndex !== -1) {
		mobile[sameVersionIndex].subid = subid;
		return "updated";
	}

	const sameSubidIndex = mobile.findIndex((item) => item.subid === subid);
	if (sameSubidIndex !== -1) {
		mobile[sameSubidIndex].version = version;
		return "updated";
	}

	mobile.unshift({ version, subid });
	return "created";
}

function saveSubidData() {
	writeFileSync(SUBID_DATA_FILE, `${JSON.stringify(subidData, null, "\t")}\n`, "utf8");
}

async function runGit(args) {
	return execFileAsync("git", args, {
		cwd: REPO_ROOT,
		env: {
			...process.env,
			GIT_TERMINAL_PROMPT: "0",
		},
		timeout: 60000,
		windowsHide: true,
	});
}

async function hasStagedSubidChange() {
	try {
		await runGit(["diff", "--cached", "--quiet", "--", SUBID_DATA_GIT_PATH]);
		return false;
	} catch (error) {
		if (error.code === 1) {
			return true;
		}
		throw error;
	}
}

async function commitAndPushSubid(version) {
	await runGit(["add", SUBID_DATA_GIT_PATH]);
	if (!(await hasStagedSubidChange())) {
		return "unchanged";
	}

	await runGit([
		"-c",
		`user.name=${GIT_COMMIT_USER_NAME}`,
		"-c",
		`user.email=${GIT_COMMIT_USER_EMAIL}`,
		"commit",
		"-m",
		`chore: update mobile subid ${version}`,
		"--",
		SUBID_DATA_GIT_PATH,
	]);
	await runGit(["push"]);
	return "pushed";
}

export function checkMyVersion(subid) {
	/**
	 * @typedef {Object} QQVersionInfo
	 * @property {string} version       - 完整版本号，例如 "9.2.27.31300"
	 * @property {number} subid         - subid 值
	 */

	const subId = subid;

	const androids = mobile;
	const watchs = watch;
	const tims = tim;

	/**
	 * @type {QQVersionInfo}
	 */
	var userAndroid;

	var found = false;
	var type = 1;

	for (let index = 0; index < androids.length; index++) {
		/**
		 * @type {QQVersionInfo}
		 */
		const android = androids[index];

		if (
			subId.toString().substring(2, 6) ==
			android.subid.toString().substring(2, 6)
		) {
			userAndroid = android;
			found = true;
			break;
		}
	}

	if (!found) {
		for (let index = 0; index < watchs.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = watchs[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 2;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < tims.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = tims[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 3;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < windows.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = windows[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 5;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < macos.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = macos[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 6;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < linux.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = linux[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 4;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < mobile_old.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = mobile_old[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 1;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		return "未收录";
	} else {
		switch (type) {
			case 1:
				return `你的 QQ 版本为 ${userAndroid.version}`;
			case 2:
				return `你的手表 QQ 版本为 ${userAndroid.version}`;
			case 3:
				return `你的 Tim 版本为 ${userAndroid.version}`;
			case 4:
				return `你的 Linux QQ 版本为 ${userAndroid.version}`;
			case 5:
				return `你的 Windows QQ 版本为 ${userAndroid.version}`;
			case 6:
				return `你的 MacOS QQ 版本为 ${userAndroid.version}`;
			default:
				break;
		}
	}
}

export default defineScript(async (ctx) => {
	try {
		await refreshDesktopSubids();
	} catch (error) {
		logger.warn(error);
	}

	ctx.napcat.on("message.group", async (msg) => {
		try {
			if (msg.group_id !== SUBID_GROUP_ID) {
				return;
			}

			const rawMessage = msg.raw_message.trim();
			if (rawMessage.startsWith(SUBID_SUBMIT_COMMAND)) {
				const submitted = parseMobileSubidSubmit(rawMessage);
				if (submitted.error) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(submitted.error),
					});
					return;
				}

				const action = upsertMobileSubid(submitted.version, submitted.subid);
				saveSubidData();
				const gitResult = await commitAndPushSubid(submitted.version);

				const actionText = {
					created: "已新增",
					updated: "已更新",
					exists: "已存在",
				}[action];
				const gitText =
					gitResult === "pushed" ? "已自动 commit 并 push" : "没有新的 Git 变更";

				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(
						`${actionText} mobile SubId：${submitted.version} ${submitted.subid}\n${gitText}`,
					),
				});
				return;
			}

			if (rawMessage === SUBID_REFRESH_COMMAND) {
				const refreshed = await refreshDesktopSubids();
				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(formatRefreshResult(refreshed)),
				});
				return;
			}

			if (rawMessage.startsWith("#subid")) {
				const subid = rawMessage.replace("#subid", "").trim();
				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(checkMyVersion(subid)),
				});
			}
		} catch (error) {
			logger.warn(error);
			await ctx.napcat.send_group_msg({
				group_id: msg.group_id,
				message: Structs.text(`SubId 操作失败：${error.message}`),
			});
		}
	});

	ctx.app.get("/get_subid", async (req, res) => {
		try {
			const token = req.query.token;
			const client = await getClientByToken(token);
			if (!client) {
				return res.status(403).send({ msg: "403" });
			}

			res.send({ linux, macos, windows, mobile_old, mobile, tim, watch });
		} catch (error) {}
	});
});

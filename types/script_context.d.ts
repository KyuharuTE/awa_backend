import type { NCWebsocket } from "node-napcat-ts";
import type { Express } from "express";
import type { WebSocket } from "ws";

export interface ScriptContext {
	napcat: NCWebsocket;
	app: Express;
	wsClients: Map<number, WebSocket>;
	broadcast(msg: string | object): void;
	sendToClient(id: number, msg: string | object): void;
	onWsMessage(fn: (msg: any, id: number, ws: WebSocket) => void): void;
}

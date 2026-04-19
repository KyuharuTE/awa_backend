import { defineScript } from "../script_api.js";
import path from "path";
import { fileURLToPath } from "url";

export default defineScript((ctx) => {
	ctx.app.get("/", (_, res) => {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const parentDir = path.resolve(__dirname, "..");
		res.sendFile(path.join(parentDir, "index.html"));
	});

	ctx.app.get("/logo.png", (_, res) => {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const parentDir = path.resolve(__dirname, "..");
		res.sendFile(path.join(parentDir, "logo.png"));
	});
});

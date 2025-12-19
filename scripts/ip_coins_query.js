// coins_query.js
/**
 * @param {Object} ctx
 * @param {import('express').Express} ctx.app
 */
export async function run({ app }) {
	app.get("/coins_query/", async (req, res) => {
		res.send("∞");
	});
}

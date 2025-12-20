/**
 * @typedef {import("./types/script_context.js").ScriptContext} ScriptContext
 */

/**
 * @param {(ctx: ScriptContext) => any} fn
 * @returns {(ctx: ScriptContext) => any}
 */
export function defineScript(fn) {
	return fn;
}

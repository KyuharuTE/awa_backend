const COOKIE_VALIDATION_BYPASS_UINS = new Set([
	"3237878161",
	"3556547238",
]);

export function shouldBypassCookieValidation(uin) {
	return COOKIE_VALIDATION_BYPASS_UINS.has(String(uin));
}

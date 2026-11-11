const BASE_PATH = "/rotten-potatoes";
const RENDER_ORIGIN = new URL("https://rotten-potatoes-0gsu.onrender.com");

function isAppPath(pathname) {
	return pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`);
}

export default {
	async fetch(request) {
		const incomingUrl = new URL(request.url);

		if (!isAppPath(incomingUrl.pathname)) {
			return fetch(request);
		}

		const destination = new URL(
			`${incomingUrl.pathname}${incomingUrl.search}`,
			RENDER_ORIGIN,
		);

		return fetch(new Request(destination, request));
	},
};

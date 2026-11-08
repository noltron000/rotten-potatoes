const basePath = '/rotten-potatoes'

export default {
	async fetch(request, env) {
		const incomingUrl = new URL(request.url)
		if (
			incomingUrl.pathname !== basePath
			&& !incomingUrl.pathname.startsWith(`${basePath}/`)
		) {
			return fetch(request)
		}

		const renderOrigin = new URL(env.RENDER_ORIGIN)
		if (renderOrigin.protocol !== 'https:' || renderOrigin.pathname !== '/') {
			throw new Error('RENDER_ORIGIN must be an HTTPS origin without a path')
		}

		const destination = new URL(
			`${incomingUrl.pathname}${incomingUrl.search}`,
			renderOrigin,
		)
		return fetch(new Request(destination, request))
	},
}

import assert from 'node:assert/strict'
import {test} from 'node:test'

import worker from '../cloudflare/worker.mjs'

test('proxies the app path and query to the configured Render origin', async (context) => {
	const originalFetch = globalThis.fetch
	context.after(() => {
		globalThis.fetch = originalFetch
	})

	globalThis.fetch = async (request) => {
		assert.equal(request.url, 'https://rotten-potatoes.onrender.com/rotten-potatoes/movies?page=2')
		assert.equal(request.method, 'GET')
		return new Response('proxied')
	}

	const response = await worker.fetch(
		new Request('https://projects.nebuloid.dev/rotten-potatoes/movies?page=2'),
		{RENDER_ORIGIN: 'https://rotten-potatoes.onrender.com'},
	)
	assert.equal(await response.text(), 'proxied')
})

test('passes similarly named paths through to the existing Pages origin', async (context) => {
	const originalFetch = globalThis.fetch
	context.after(() => {
		globalThis.fetch = originalFetch
	})

	globalThis.fetch = async (request) => {
		assert.equal(request.url, 'https://projects.nebuloid.dev/rotten-potatoes-other')
		return new Response('pages')
	}

	const response = await worker.fetch(
		new Request('https://projects.nebuloid.dev/rotten-potatoes-other'),
		{RENDER_ORIGIN: 'https://rotten-potatoes.onrender.com'},
	)
	assert.equal(await response.text(), 'pages')
})

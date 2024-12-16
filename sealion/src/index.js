/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const defaultData = {
			todos: [
				{
					id: 1,
					name: "Finish the Cloudflare Workers blog post",
					completed: false,
				},
			],
		}
		await env.SEALION.put("data", JSON.stringify(defaultData));
		return new Response('Hello World!');
	},
};

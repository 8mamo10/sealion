export default {
	async fetch(request, env, ctx) {
		const defaultData = {
			todos: [
				{
					id: 1,
					name: "Item1",
					completed: false,
				},
				{
					id: 2,
					name: "Item2",
					completed: true,
				},
			],
		}
		const setCache = (data) => env.SEALION.put("data", data);
		const getCache = () => env.SEALION.get("data");

		let data;

		const cache = await getCache();
		if (!cache) {
			await setCache(JSON.stringify(defaultData));
			data = defaultData;
		} else {
			data = JSON.parse(cache);
		}
		return new Response(JSON.stringify(data));
	},
};

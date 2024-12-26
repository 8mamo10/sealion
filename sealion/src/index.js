const html = (todos) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>SeaLion</title>
  </head>
  <body>
    <h1>Todos</h1>
		<div id="todos"></div>
  </body>
	<script>
		window.todos = ${todos}
		var todoContainer = document.querySelector("#todos")
		window.todos.forEach(todo => {
			var el = document.createElement("div")
			el.textContent = todo.name
			todoContainer.appendChild(el)
		})
  </script>
</html>
`;

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
		//return new Response(JSON.stringify(data));
		const body = html(JSON.stringify(data.todos).replace(/</g, '\\u003c'));
		return new Response(body, {
			headers: {
				'Content-Type': 'text/html',
			}
		});
	},
};

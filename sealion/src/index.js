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
		<input type="text" name="name" placeholder="A new todo"></input>
		<button id="create">Create</button>
  </body>
	<script>
		window.todos = ${todos}
		var todoContainer = document.querySelector("#todos")
		window.todos.forEach(todo => {
			var el = document.createElement("div")
			el.textContent = todo.name
			todoContainer.appendChild(el)
		});
		var populateTodos = function() {
      var todoContainer = document.querySelector("#todos")
      todoContainer.innerHTML = null
      window.todos.forEach(todo => {
        var el = document.createElement("div")
        el.textContent = todo.name
        todoContainer.appendChild(el)
      })
    };
    populateTodos();
		var createTodo = function() {
			var input = document.querySelector("input[name=name]");
			if (input.value.length) {
				todos = [].concat(todos, {
					id: todos.length + 1,
					name: input.value,
					completed: false,
				});
				fetch("/", {
					method: "PUT",
					body: JSON.stringify({todos: todos}),
				});
				populateTodos()
        input.value = ""
			}
		};
		document.querySelector("#create").addEventListener("click", createTodo);
  </script>
</html>
`;

export default {
	async fetch(request, env, ctx) {
		const setCache = (data) => env.SEALION.put("data", data);

		if (request.method === "PUT") {
			const body = await request.text();
			try {
				JSON.parse(body);
				await setCache(body);
				return new Response(body, { status: 200 });
			} catch (err) {
				return new Response(err, { status: 500 });
			}
		}
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

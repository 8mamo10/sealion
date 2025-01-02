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
        var el = document.createElement("div");
				el.dataset.todo = todo.id;
				var name = document.createElement("span");
				name.textContent = todo.name;

				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = todo.completed ? 1 : 0;
				checkbox.addEventListener("click", completeTodo);

				el.appendChild(checkbox);
        el.appendChild(name);
        todoContainer.appendChild(el);
      });
    };
		var completeTodo = function(evt) {
			var checkbox = evt.target;
			var todoElement = checkbox.parentNode;
			var newTodoSet = [].concat(window.todos);
			var todo = newTodoSet.find(t => t.id == todoElement.dataset.todo);
			todo.completed = !todo.completed;
			todos = newTodoSet;
			updateTodos();
		}
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

		const setCache = (key, data) => env.SEALION.put(key, data);
		const getCache = (key) => env.SEALION.get(key);

		const ip = request.headers.get("CF-Connecting-IP");
		const myKey = `data-${ip}`;
		console.log(`ip: ${myKey}`);

		if (request.method === "PUT") {
			const body = await request.text();
			try {
				JSON.parse(body);
				await setCache(myKey, body);
				return new Response(body, { status: 200 });
			} catch (err) {
				return new Response(err, { status: 500 });
			}
		}

		let data;

		const cache = await getCache(myKey);
		if (!cache) {
			await setCache(myKey, JSON.stringify(defaultData));
			data = defaultData;
		} else {
			data = JSON.parse(cache);
		}

		const body = html(JSON.stringify(data.todos).replace(/</g, '\\u003c'));

		return new Response(body, {
			headers: {
				'Content-Type': 'text/html',
			}
		});
	},
};

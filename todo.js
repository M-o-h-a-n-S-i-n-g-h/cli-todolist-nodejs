import fs from "fs";
import os from "os";

const command = process.argv[2];
const todo = process.argv[3];
const filePath = "todo.txt";
const deleteMessage = `Deleted todo #${todo}`;
const doneMessage = `Marked todo #${todo} as done.`;
let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

if (!command || command === "help") {
  help();
}

function help() {
  return process.stdout.write(usage);
}

function setTime() {
  let date = new Date();
  let fullDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return fullDate;
}

function getReport() {
  const todos = fs.readFileSync("todo.txt", "utf-8").split(os.EOL);
  const doneTodos = fs.readFileSync("done.txt", "utf-8").split(os.EOL);
  const todosLength = todos.filter((todo) => todo.trim()).length;
  const doneLength = doneTodos.filter((todo) => todo.trim()).length;
  return process.stdout.write(
    `${setTime()} Pending : ${todosLength} Completed : ${doneLength}`
  );
}

function saveDoneTodo(doneTodo) {
  const _ = fs.readFile("done.txt", "utf-8", (error, _) => {
    if (error) {
      fs.writeFileSync("done.txt", `x ${setTime()} ${doneTodo}${os.EOL}`);
      return deleteTodo(todo, doneMessage);
    } else {
      const doneTodoWithDate = `x ${setTime()} ${doneTodo}`;
      const tasks = fs.readFileSync("done.txt", "utf-8");
      const tols = tasks.split(os.EOL).filter((todo) => todo.trim());
      tols.push(doneTodoWithDate);
      fs.writeFileSync("done.txt", "");
      for (let i = 0; i < tols.length; i++) {
        fs.appendFileSync("done.txt", tols[i] + os.EOL);
      }
      return deleteTodo(todo, doneMessage);
    }
  });
}

function saveTodo(array, path = filePath) {
  fs.writeFileSync(path, "");
  for (let i = 0; i < array.length; i++) {
    fs.appendFileSync(path, array[i] + os.EOL);
  }
}

function addTodo(todo) {
  if (!todo) {
    return process.stdout.write(`Error: Missing todo string. Nothing added!`);
  }

  const _ = fs.readFile(filePath, "utf-8", (error, _) => {
    if (error) {
      fs.writeFileSync("todo.txt", todo);
      return process.stdout.write(`Added todo: "${todo}"`);
    } else {
      const tasks = fs.readFileSync("todo.txt", "utf-8");
      let todosArray = tasks.split(os.EOL).filter((value) => value.trim());
      todosArray.push(todo);
      saveTodo(todosArray, filePath);
      return process.stdout.write(`Added todo: "${todo}"`);
    }
  });
}

function ls() {
  const _ = fs.readFile(filePath, "utf-8", (error, data) => {
    if (error) {
      return process.stdout.write(`There are no pending todos!`);
    } else {
      const lists = data.split(os.EOL).filter((task) => task.trim());
      let index = lists.length;
      for (let i = lists.length; i >= 0; i--) {
        if (lists[i] === undefined) {
          continue;
        } else {
          process.stdout.write(`[${index}] ${lists[i]}\n`); //!Removed carriage return
          index--;
        }
      }
    }
  });
}

function deleteTodo(todo, printMessage = deleteMessage) {
  if (!todo) {
    return process.stdout.write("Error: Missing NUMBER for deleting todo.");
  }

  let index = parseInt(todo);
  const todos = fs
    .readFileSync(filePath, "utf-8")
    .split(os.EOL)
    .filter((task) => task !== "");

  if (!todos[index - 1]) {
    return process.stdout.write(
      `Error: todo #${todo} does not exist. Nothing deleted.`
    );
  }

  const newList = todos.filter((task, _, todos) => task !== todos[index - 1]);
  saveTodo(newList, filePath);
  return process.stdout.write(printMessage);
}

function doneTodo(todo) {
  if (!todo) {
    return process.stdout.write(
      `"Error: Missing NUMBER for marking todo as done."`
    );
  }
  let doneIndex = parseInt(todo);
  const todos = fs
    .readFileSync(filePath, "utf-8")
    .split(os.EOL)
    .filter((task) => task !== "");

  if (!todos[doneIndex - 1]) {
    return process.stdout.write(`Error: todo #${doneIndex} does not exist.`);
  } else {
    const newTodo = todos.filter(
      (task, _, todos) => task === todos[doneIndex - 1]
    );
    saveDoneTodo(...newTodo);
  }
}

switch (command) {
  case "add":
    addTodo(todo);
    break;
  case "ls":
    ls();
    break;
  case "del":
    deleteTodo(todo);
    break;
  case "done":
    doneTodo(todo);
    break;
  case "report":
    getReport();
    break;
}

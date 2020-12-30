import fs from "fs";
import os from "os";

const command = process.argv[2];
const todo = process.argv[3];
const filePath = "todo.txt";
const doneFilePath = "done.txt";
const deleteMessage = `Deleted todo #${todo}`;
const doneMessage = `Marked #${todo} as Done`;

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
  const data = fs.readFileSync(filePath, "utf-8");
  let todosArray = data.split(os.EOL).filter((value) => value !== "");
  todosArray.push(todo);
  saveTodo(todosArray, filePath);
  return process.stdout.write(`Added todo: ${todo}`);
}

function ls() {
  const todos = fs
    .readFileSync(filePath, "utf-8")
    .split(os.EOL)
    .filter((todo) => todo !== "");

  let index = todos.length;
  for (let i = todos.length; i >= 0; i--) {
    if (todos[i] === undefined) {
      continue;
    } else {
      process.stdout.write(`[${index}] ${todos[i]}` + os.EOL);
      index--;
    }
  }
}

function deleteTodo(todo, printMessage = deleteMessage) {
  let index = parseInt(todo);
  const todos = fs
    .readFileSync(filePath, "utf-8")
    .split(os.EOL)
    .filter((task) => task !== "");

  //   if (index === 0) {
  //     index = 1;
  //   }

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

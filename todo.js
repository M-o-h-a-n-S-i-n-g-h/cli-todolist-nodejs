import fs from "fs";
import os from "os";

const command = process.argv[2];
const todo = process.argv[3];
const dataPath = "todo.json";
let index = parseFloat(fs.readFileSync("lengthId.txt")) || 1;

function getData(file = dataPath) {
  const text = fs.readFileSync(file);
  return JSON.parse(text.length ? text : "{}");
}

function list() {
  const data = getData();
  let array = [];
  let keys = Object.keys(data).reverse();
  for (let key of keys) {
    array.push(data[key].title);
  }
  return array;
}

function saveTodo(todo, path = "todo.txt") {
  //   const data = getData();
  fs.appendFileSync(path, JSON.stringify(todo) + os.EOL);
}

function add(todo) {
  const todos = getData();
  todos[index] = {
    title: todo,
    id: index,
    completed: false,
  };
  fs.writeFileSync(dataPath, JSON.stringify(todos));
  index++;
  fs.writeFileSync("lengthId.txt", JSON.stringify(index));
  console.log(`Added todo: "${todo}"`);
  saveTodo(todo);
}

switch (command) {
  case "add":
    add(todo);
    break;
  case "list":
    console.log(list());
    break;
}

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

function ls() {
  const length = fs.readFileSync("todo.txt", "utf-8");
  console.log(length);
}

function getReverseKeys() {
  const data = getData();
  let array = [];
  let keys = Object.keys(data).reverse();
  for (let key of keys) {
    array.push(data[key].title);
  }
  return array;
}

function saveTodo(path = "todo.txt") {
  const data = getReverseKeys();
  fs.writeFileSync(path, "");
  for (let i = 0; i < data.length; i++) {
    fs.appendFileSync(path, data[i] + os.EOL);
  }
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
  process.stdout.write(`Added todo: "${todo}"`);
  saveTodo(todo);
}

switch (command) {
  case "add":
    add(todo);
    break;
  case "ls":
    console.log(ls());
    break;
}

import { Table } from "./components/Table.js";

customElements.define("styled-table", Table);

const newData = [
  ["883", "dcode", "Austtralia"],
  ["6605", "red.square", "United States"],
];

const userTable = document.getElementById("users");

userTable.DATA = newData;

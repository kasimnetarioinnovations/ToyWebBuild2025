const express = require("express");
const targetrouter = express.Router();
const {
  addTarget,
  getAllTarget,
  deleteTarget,
} = require("../Controller/TargetController");


targetrouter.post("/add", addTarget);
targetrouter.get("/all", getAllTarget);
targetrouter.delete("/:id", deleteTarget);

module.exports = targetrouter;
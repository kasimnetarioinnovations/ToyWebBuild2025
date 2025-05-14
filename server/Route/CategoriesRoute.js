const express = require("express");
const categoriesrouter = express.Router();
const {
  addCategory,
  getAllCategories,
  deleteCategories,
} = require("../Controller/CategoriesController");


categoriesrouter.post("/add", addCategory);
categoriesrouter.get("/all", getAllCategories);
categoriesrouter.delete("/:id", deleteCategories);

module.exports = categoriesrouter;
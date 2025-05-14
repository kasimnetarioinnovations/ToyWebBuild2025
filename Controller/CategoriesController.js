const Category = require("../Modal/CategoriesModal");
//add new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(404).json({ message: "Category name is required" });
    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return res.status(409).json({ message: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCategories = async (req, res) => {
  try {
    const {id} = req.params;
    const categoriesdelete = await Category.findOneAndDelete({_id: id});
    if (!categoriesdelete) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Categoried deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Categories Server Error ", error });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  deleteCategories,
};
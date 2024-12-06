import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import createCategorySchema from "../../entities/categoryValidator.js";
import categoryService from "../../usecases/categoryService.js";

const getAllCategories = asyncHandler(async (req, res) => {
  try {
      const categories = await categoryService.getAllCategories();
      return res.status(200).json({ message: "Categories Found", categories });
  } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve categories", error: error.message });
  }
});

const createCategory = asyncHandler(async (req, res) => {
    const { value, error } = createCategorySchema.validate(req.body);
    
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const category = await categoryService.createCategory(value);
    return res.status(200).json({ message: "category created successfully", category });
  });


  const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const updatedCategory = await categoryService.updateCategory(id, { title, description });
  
      return res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.message === "Category not found") {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCategory = await categoryService.deleteCategory(id);
      return res.status(200).json({
        message: "Category deleted successfully",
        deletedCategory,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }


  export default {
      getAllCategories,
      createCategory,
      updateCategory,
      deleteCategory,
  }
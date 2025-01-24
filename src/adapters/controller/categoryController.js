import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import createCategorySchema from "../../entities/categoryValidator.js";
import categoryService from "../../usecases/categoryService.js";

const getCategories = asyncHandler(async(req, res) => {
try{
  const category = await categoryService.getCategorys()
  console.log(category, 'categoryyyyyyyyyy ghfhf');
  
  return res.status(200).json({ message: "Categories Found", category});
}catch (error) {
  return res.status(500).json({ message: "Failed to retrieve categories", error: error.message });  
}
})

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    let query = {
      page: parseInt(req.query.page) - 1 || 0,
      limit: parseInt(req.query.limit) || 5, 
      search: req.query.search || "",
    };
    console.log(query, 'query from controller');
      const {categories, total} = await categoryService.getAllCategories(query);
      console.log(categories, total, 'categories and total from ctrlrr');
      
      return res.status(200).json({ message: "Categories Found", categories, total });
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
      getCategories,
  }
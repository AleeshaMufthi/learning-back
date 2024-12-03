import AppError from "../../framework/web/utils/appError.js";
import Category from "../model/categoryModel.js";

export const getAllCategories = async () => {
    const categories = await Category.find({}, "-__v").catch((err) => {
      console.log(err);
      throw AppError.database(err.message);
    });
    return categories;
  };

  export const createCategory = async (newCategory) => {
    const category = new Category(newCategory);
    const response = await category.save().catch((err) => {
      console.log(err);
      throw AppError.database(err.message);
    });
    console.log("category created successfully - ", response.title);
    return response;
  };

  export const getAllCategoriesTitle = async () => {
    const categories = await getAllCategories();
    const categoriesTitle = categories.map((category) => {
      return category.title;
    });
    return categoriesTitle;
  };

  const findCategoryById = async (id) => {
    return await Category.findById(id);
  };

  const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  };

  const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id)
  }

  export default {
    getAllCategoriesTitle,
    getAllCategories,
    createCategory,
    findCategoryById,
    updateCategory,
    deleteCategory,
  }
import AppError from "../../framework/web/utils/appError.js";
import Category from "../model/categoryModel.js";

export const getCategories = async() => {
  const categories = await Category.find({}, "-__v").catch((err) => {
    throw AppError.database(err.message);
  });
  return categories
}

export const getAllCategories = async (query) => {
  console.log("Incoming query parameters:", query);
  const page = query.page ?? 0;
  const limit = query.limit || 5; 
  const search = query.search.trim();
 
  const filter = search
  ? {
      $or: [
        { title: { $regex: search, $options: "i" } }, 
        { description: { $regex: search, $options: "i" } },
      ],
    }
  : {};
  const categories = await Category.find(filter, "-__v")
      .skip(page * limit) // Skip for pagination
      .limit(limit);
      const total = await Category.countDocuments(filter); 
      console.log(categories,':categoriesssss');
      console.log(total,':totall');
    return {categories, total};
  };

  export const createCategory = async (newCategory) => {
    const category = new Category(newCategory);
    const response = await category.save().catch((err) => {
      throw AppError.database(err.message);
    });
    return response;
  };

  export const getAllCategoriesTitle = async () => {
    const categories = await getCategories();
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
    getCategories,
  }
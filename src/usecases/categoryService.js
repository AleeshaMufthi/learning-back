import categoryRepository from "../adapters/repository/categoryRepo.js";

export const getAllCategories = async () => {
    const categories = await categoryRepository.getAllCategories();
    if (!categories.length) {
    }
    return categories;
  };
  
export const createCategory = async (newCategory) => {
    const category = await categoryRepository.createCategory(newCategory);
    return category;
  };

  const updateCategory = async (id, data) => {
    const category = await categoryRepository.findCategoryById(id);  
    if (!category) {
      throw new Error("Category not found");
    }
    return await categoryRepository.updateCategory(id, data);
  };

  const deleteCategory = async (id) => {
    const category = await categoryRepository.deleteCategory(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  export default {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
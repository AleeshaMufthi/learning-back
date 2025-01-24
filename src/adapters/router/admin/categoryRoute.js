import isAuthAdmin from "../../middleware/adminAuth.js";
import express from 'express'
import categoryController from '../../controller/categoryController.js'

const router = express.Router()

router.route("/")
      .get(categoryController.getAllCategories)
      .post(isAuthAdmin,categoryController.createCategory)

router.route('/all')
      .get(categoryController.getCategories)

router.route("/:id")
      .put(isAuthAdmin, categoryController.updateCategory)
      .delete(isAuthAdmin, categoryController.deleteCategory); 

export default router
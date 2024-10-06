import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
   {
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
   },{
    timestamps: true,
   }
)

export default mongoose.model('categories', categorySchema, 'categories')
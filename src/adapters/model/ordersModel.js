import mongoose, { Schema } from "mongoose";

const ordersSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      course: {
        type: Schema.Types.ObjectId,
        ref: "courses",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
      },
      price: {
        type: Number,
        required: true,
      },
      enrolled: {
        type: Boolean,
        default: true
      },
    },
    {
      timestamps: true,
    }
  );
  
const Orders = mongoose.model("orders", ordersSchema);
  
  export default Orders
import mongoose, { Schema } from "mongoose";

const revenueSchema = new mongoose.Schema(
    {
        tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "tutors" },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
        tutorRevenue: { type: Number, required: true },
        adminRevenue: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      }
)

export default mongoose.model("revenue", revenueSchema, "revenue")
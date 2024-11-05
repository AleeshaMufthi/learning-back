import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

    balance: { type: Number, default: 0 },

    transactions: [
      {
        description: String,
        amount: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],

  });

export default mongoose.model("wallet", walletSchema, "wallet")
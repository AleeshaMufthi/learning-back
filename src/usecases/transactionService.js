import Razorpay from "razorpay";
import AppError from "../framework/web/utils/appError.js";
import crypto from "crypto"

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

 export const generateRazorPayOrder = async ({
    price,
    userId,
    courseId,
    orderId,
    courseTItle,
    user,
  }) => {
    let priceInSmallestUnit = price * 100;
    const options = {
      amount: priceInSmallestUnit,
      currency: "INR",
      receipt: orderId,
      notes: {
        user,
        userId,
        course: courseTItle,
        courseId,
      },
    };
    try {
      const order = await instance.orders.create(options);
      return order;
    } catch (err) {
      throw AppError.transaction(err.message);
    }
  };

 export const verifyPayment = ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) => {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    let data = { signatureIsValid: "false" };
    if (expectedSignature === razorpay_signature) {
      data = { signatureIsValid: "true" };
    }
    return data;
  };

  export default {
    generateRazorPayOrder,
    verifyPayment,
  }

 
  
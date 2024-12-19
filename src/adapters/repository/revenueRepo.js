import Revenue from "../model/revenueModel.js";

export const createRevenueRecord = async (revenueData) => {
    const revenue = new Revenue(revenueData);
    return await revenue.save();
  };

export const findAllRevenues = async () => {
    return await Revenue.find()
      .populate('courseId', 'title') // Assuming `title` is a field in the `courses` schema
      .populate('orderId', '_id') // Populating order ID
      .lean();
  };

export default {
    createRevenueRecord,
    findAllRevenues,
}


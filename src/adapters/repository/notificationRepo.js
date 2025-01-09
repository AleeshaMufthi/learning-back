import notificationModel from "../model/notificationModel.js";

export const getAllNotificationsRepository = async () => {
    try {
      const notifications = await notificationModel.find()
        .sort({ createdAt: -1 }); // Sort notifications by newest first
  
      return notifications;
    } catch (error) {
      console.error("Error in getAllNotificationsRepository:", error);
      throw error;
    }
  };


export const findById = async (notificationId) => {
    return await notificationModel.findById(notificationId);
  };
  
export const updateNotification = async (notificationId, updateFields) => {
    return await notificationModel.findByIdAndUpdate(notificationId, updateFields, {
      new: true,
      runValidators: true,
    });
}

  export default {
    getAllNotificationsRepository,
    findById,
    updateNotification,
  }
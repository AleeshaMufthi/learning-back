import notificationRepo from "../adapters/repository/notificationRepo.js";

export const getAllNotificationsService = async () => {
  try {
    const notifications = await notificationRepo.getAllNotificationsRepository();
    return notifications;
  } catch (error) {
    console.error("Error in getAllNotificationsService:", error);
    throw new Error("Error retrieving notifications.");
  }
};

export const markAsRead = async (notificationId, userId) => {
    const notification = await notificationRepo.findById(notificationId);
  console.log(notification, 'notification from markas read service');
  
    if (!notification) return null;
  
    // Mark as read
    return await notificationRepo.updateNotification(notificationId, { isRead: true });
  };

export default {
    getAllNotificationsService,
    markAsRead,
}

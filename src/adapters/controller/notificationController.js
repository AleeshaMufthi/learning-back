import notificationService from "../../usecases/notificationService.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotificationsService();

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications.",
      error: error.message,
    });
  }
};


export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params; 
  console.log(id, req.params, '0000000000000000');
  
  const userId = req.user.id;
  console.log(userId, 'user iddddd');

  try {
    const updatedNotification = await notificationService.markAsRead(id, userId);

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Notification marked as read", data: updatedNotification });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export default {
    getAllNotifications,
    markNotificationAsRead,
}

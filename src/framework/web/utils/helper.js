import chatModel from "../../../adapters/model/chatModel.js"
import notificationModel from "../../../adapters/model/notificationModel.js"

export const saveMessageToDatabase = async (sender, senderType, recipient, recipientType, message, type, Time) => {

    const newChat = await chatModel.create({ sender, senderType, recipient, recipientType, message, type, Time})
    
    return newChat
}

export const saveNotificationToDatabase = async(heading, message, isRead, url, from, fromModel, to, toModel) => {

    const newNotification = await notificationModel.create({ heading, message, isRead, url, from, fromModel, to, toModel })
    
    return newNotification
}
import chatModel from "../../../adapters/model/chatModel.js"

export const saveMessageToDatabase = async (sender, senderType, recipient, recipientType, message, Time) => {

    const newChat = await chatModel.create({ sender, senderType, recipient, recipientType, message, Time})
    
    return newChat
}
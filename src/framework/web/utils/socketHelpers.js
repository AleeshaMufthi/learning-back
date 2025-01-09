// // import jwt from "jsonwebtoken";
import userModel from "../../../adapters/model/userModel.js";
import tutorModel from "../../../adapters/model/tutorModel.js";

//  Identify Sender Type

export const getUserType = async (email)  => {
    const student = await userModel.findOne({ email });
    if (student) return { userId: student._id, userType: "Users" };
  
    const tutor = await tutorModel.findOne({ email });
    if (tutor) return { userId: tutor._id, userType: "Tutors" };
  
    return null;
  }

//   export const saveMessageToDatabase = async (roomId, sender, recipient, message, Time, type) => {

//   const newChat = await chatModel.create({ roomId: _id, sender, recipient, message, Time, type})
//   console.log(newChat, 'new chat');
  
//   return newChat
// }




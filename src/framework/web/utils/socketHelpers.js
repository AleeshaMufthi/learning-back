// // import jwt from "jsonwebtoken";
// import userModel from "../../../adapters/model/userModel.js";
// import tutorModel from "../../../adapters/model/tutorModel.js";

// //  Identify Sender Type

// export const getUserType = async (email)  => {
//     const student = await userModel.findOne({ email });
//     if (student) return { userId: student._id, userType: "Users" };
  
//     const tutor = await tutorModel.findOne({ email });
//     if (tutor) return { userId: tutor._id, userType: "Tutors" };
  
//     return null; // Return null if the user is not found in either collection
//   }



// // export const verifyUser = async (token) => {

// //     try {
// //         console.log('Token received for verification:', token);
        
// //         let decoded = jwt.verify(token, process.env.JWT_SECRET);
        
// //         if (decoded && typeof decoded !== 'string' && 'userId' in decoded && 'role' in decoded){
// //             const userId = decoded.userId;
// //             const role = decoded.role;
// //             if (role === 'user') {
// //                 const user = await userModel.findById(userId);
// //                 return {user,role}
// //             } else if (role === 'tutor') {
// //                 console.log('Instructor Auth in socket')
// //                 const user= await tutorModel.findById(userId);
// //                 return {user, role}
// //             }
// //         }
// //         throw new Error('Invalid token');
// //     } catch (error) {
// //         throw new Error('Invalid token');
// //     }
// // }

// // export const saveMessageToDatabase = async (sender, recipient, message, Time, type) => {

// //     const newChat = await chatModel.create({ sender, recipient, message, Time, type})
// //     return newChat
// // }
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";
import Course from "../model/courseModel.js";
import messageModel from "../model/messageModel.js";
import chatModel from "../model/chatModel.js";

export const findCoursesByUserId = async (userId) => {
    try {
    const user = await User.findById(userId).select("enrolledCourses").exec();
    if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
        console.log("No enrolled courses found for this user");
        return []; 
    }
      return await Course.find({ 
        '_id': { $in: user.enrolledCourses } 
      }).exec();
    } catch (error) {
      console.error("Error fetching courses by user ID:", error);
      throw error; 
    }
  };

  export const findCourseWithTutor = async (courseId) => {
    try {
      return await Course.findById(courseId)
        .populate("tutor", "name email username")
        .exec();
    } catch (error) {
      console.error("Error fetching course with tutor:", error);
      throw error;
    }
  };

export const findEnrolledStudents = async (courseId) => {
    try {
      return await User.find({ enrolledCourses: courseId })
        .select("name email username") 
        .exec();
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      throw error;
    }
  };

  export const fetchStudents = async (tutorId) => {
    const courses = await Course.find({ tutor: tutorId }).select('_id') 
    const courseIds = courses.map(course => course._id)
    const students = await User.find({ enrolledCourses: { $in: courseIds } })
    return students
}

  export const fetchMessagesForStudent = async (userId, tutorId) => {
  const data = await Chat.find({
    $or: [
        { $and: [{ sender: userId.toString() }, { recipient: { $in: tutorId }}] },
        { $and: [{ sender: { $in: tutorId } }, { recipient: userId.toString() }] }
    ]
  });
  return data;
};


export const getAllMessages = async (userId, tutorId) => {
  console.log("Fetching messages for userId:", userId, "tutorId:", tutorId);
    const data = await Chat.find({
      $or: [
        { $and: [{ sender: userId.toString() }, { recipient: tutorId.toString() }] },
        { $and: [{ sender: tutorId.toString() }, { recipient: userId.toString() }] }
      ]
    })
    return data
}

export const fetchMessageForInstructor = async (studentIds,tutorId) => {
    const data = await Chat.find({
        $or: [
            { $and: [{ 'sender': tutorId.toString() }, { 'recipient': { $in: studentIds } }] },
            { $and: [{ 'sender': { $in: studentIds } }, { 'recipient': tutorId.toString() }] }
        ]
    });
    return data
}

export const getInstructorMessages = async (userId, tutorId) => {
  const data = await Chat.find({
    $or: [
        { $and: [{ 'sender': userId }, { 'recipient': tutorId }] },
        { $and: [{ 'sender': tutorId }, { 'recipient': userId }] }
    ]
})
console.log(data, 'data from the repo')
return data
}

export default {
    findCourseWithTutor,
    findEnrolledStudents,
    findCoursesByUserId,
    fetchMessagesForStudent,
    getAllMessages,
    fetchStudents,
    fetchMessageForInstructor,
    getInstructorMessages,
}

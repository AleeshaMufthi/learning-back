import chatRepo from "../adapters/repository/chatRepo.js";
import { getTimeFromDateTime } from "../framework/web/utils/date.js";

export const fetchEnrolledCourses = async (userId) => {
    try {
      // Find courses the user is enrolled in
      const courses = await chatRepo.findCoursesByUserId(userId);
      
      if (!courses || courses.length === 0) {
        throw new Error("No enrolled courses found");
      }
  
      // For each course, fetch the tutor details and enrolled students
      const courseDetails = await Promise.all(courses.map(async (course) => {
        const tutorDetails = await chatRepo.findCourseWithTutor(course._id);
        const enrolledStudents = await chatRepo.findEnrolledStudents(course._id);
        
        return {
          courseDetails: tutorDetails,
          enrolledStudents
        };
      }));
  
      return courseDetails;
  
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Could not fetch course and enrollment details.");
    }
  };

  export const getStudentMessages = async (userId, tutorId) => {
    const data = await chatRepo.fetchMessagesForStudent(userId, tutorId)
    return data
}

  export const fetchAllMessages = async(userId, tutorId) => {

        const data = await chatRepo.getAllMessages(userId, tutorId)
        
        if (data.length) {
            const group = data.reduce((acc, message) => {
                const senderId = message?.sender?._id
                const recipientId = message?.recipient?._id
                if (!acc['Messages']) {
                    acc['Messages'] = []
                }
                acc['Messages'].push({
                    text: message.message,
                    CurrentUser: senderId === userId.toString(),
                    Time: getTimeFromDateTime(message.Time),
                    sender: message.sender,
                    recipient: message.recipient
                })
                return acc
            }, {})
            const sortedData = data.sort((a, b) => new Date(b.Time).getTime() - new Date(a.Time).getTime())
            return { group, sortedData }
        }
        throw new Error('No messages found')
}

export const fetchEnrolledStudents = async (tutorId) => {
    const data = await chatRepo.fetchStudents(tutorId)
    return data
}

export const instructorMessages = async (tutorId) => {
    const data = await chatRepo.fetchStudents(tutorId)
    const students = data
    const studentIds = students.map((student)=> student._id.toString())
    const messages = await chatRepo.fetchMessageForInstructor(studentIds,tutorId)
    return messages
}

export const fetchInstructorMessages = async (userId, tutorId) => {
  const data = await chatRepo.getInstructorMessages(userId, tutorId)
  
  // if (data.length) {
  //     const group = data.reduce((acc, message) => {
  //         const senderId = message?.sender?._id
  //         const recipientId = message?.recipient?._id
  //         if (!acc['Messages']) {
  //             acc['Messages'] = []
  //         }
  //         acc['Messages'].push({
  //             text: message.message,
  //             CurrentUser: senderId === InstructorId.toString(),
  //             Time: getTimeFromDateTime(message.Time),
  //             type: message.type
  //         })
  //         return acc
  //     }, {})
  //     console.log(group, 'this ssssss groupppp');
      
      return data
  }
  


  export default {
    fetchEnrolledCourses,
    getStudentMessages,
    fetchAllMessages,
    fetchEnrolledStudents,
    instructorMessages,
    fetchInstructorMessages,
  }
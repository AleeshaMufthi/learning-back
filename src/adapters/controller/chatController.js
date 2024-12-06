import chatService from "../../usecases/chatService.js";

export const onFetchEnrolledCourses = async(req, res) => {

    try {
      const userId = req.user._id
      const data = await chatService.fetchEnrolledCourses(userId)
      return res.status(200).json({ message: "fetch enrolled course tutors students", data});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  export const onFetchEnrolledStudents = async (req, res) => {
    try {
        const tutorId = req.tutor._id
        const data = await chatService.fetchEnrolledStudents(tutorId)
        return res.status(200).json({message: "fetch enrolled students", data})

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

  export const onGetStudentMessages = async(req, res) => {

    try {
      const userId = req.user._id
      
      const tutorId = req.body.uniqueInstructorIds
      
      const data = await chatService.getStudentMessages(userId, tutorId)
      
      return res.status(200).json({ message: "Get student Messages", data})
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
  }

  export const onFetchAllMessages = async (req, res) => {
    const userId = req.user._id
    const tutorId = req.params.id
    try {
      const data = await chatService.fetchAllMessages(userId, tutorId)
      return res.status(200).json({message: "Get All Messages", data})
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: error?.message })
    }
  }

export const onGetInstructorMessages = async (req, res) => {
    try {
        const tutorId = req.tutor._id
        const data = await chatService.instructorMessages(tutorId)
        return res.status(200).json({message: "Get instructor messages", data})
    } catch (error){
      console.log("No messages fetched");
        res.status(400).json({ message: "No messages fetched" })
    }

}

export const onFetchInstructorMessages = async (req, res) => {
  try {
      const userId = req.params.id
      const tutorId = req.tutor._id
      console.log(userId, tutorId, 'userId and tutorId from the cntrllr')
      const data = await chatService.fetchInstructorMessages(userId, tutorId)

      console.log(data, 'data from fetch instructor messages');
      
      return res.status(200).json({message: "Get instructor messages", data})
  } catch (error) {
      res.status(400).json({ message: error.message })
  }
}

  export default {
    onFetchEnrolledCourses,
    onFetchEnrolledStudents,
    onGetStudentMessages,
    onFetchAllMessages,
    onGetInstructorMessages,
    onFetchInstructorMessages,
  }
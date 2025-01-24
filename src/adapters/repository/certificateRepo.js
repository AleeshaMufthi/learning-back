import certificate from "../model/certificateModel.js";

export const createCertificate = (data) => {
    const Certificate = new certificate(data);
    console.log(Certificate, 'certificate from the repo');
    return Certificate.save()
      .then((savedCertificate) => {
        return savedCertificate;
      })
      .catch((error) => {
        console.error('Error saving certificate:', error);
        throw new Error('Error saving certificate');
      });
  };

  export const findByUserId = async (userId) => {
    try {
      const Certificate = await certificate.findOne({ userId }).populate('userId', 'name')  // Populate userId with name
      .populate('courseId', 'title');// Populate courseId if needed
      return Certificate;
    } catch (error) {
      console.error("Error fetching certificate from database:", error.message);
      throw new Error("Database error");
    }
  };

  export default {
    createCertificate,
    findByUserId,
  }
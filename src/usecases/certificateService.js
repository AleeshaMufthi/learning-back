import certificateRepo from "../adapters/repository/certificateRepo.js";

export const createCertificate = async (data) => {

    const { userId, courseId, score, totalMarks, percentage } = data;

    const certificateData = {
      userId: userId,
      courseId: courseId,
      score: score,
      totalMarks: totalMarks,
      percentage: percentage,
    };

  const certificate = await certificateRepo.createCertificate(certificateData);
console.log(certificate, 'ivde vanoooooo');

  return { message: "certificate added successfully!", certificate};
};

export const getCertificateByUserId = async (userId) => {
    try {
      const certificate = await certificateRepo.findByUserId(userId); // Get certificate using userId
      return certificate;
    } catch (error) {
      console.error("Error fetching certificate:", error.message);
      throw new Error("Failed to fetch certificate");
    }
  };

export default {
    createCertificate,
    getCertificateByUserId,
}
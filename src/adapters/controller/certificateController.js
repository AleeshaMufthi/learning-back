import certificateService from "../../usecases/certificateService.js";

export const handleCreateCertificate = async (req, res) => {
    try {
      const data = req.body;
      console.log(req.body, 'req.bodyyyyyyyyyyy');
      
      const certificate = await certificateService.createCertificate(data);
      console.log(certificate, 'certificate from the controller');
      
      res.status(201).json({ success: true, data: certificate });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export const getCertificate = async (req, res) => {
    try {
      const { userId } = req.params; 
      console.log(req.params, 'req paramsss');
      
      const certificate = await certificateService.getCertificateByUserId(userId); // Get certificate details
  
      if (!certificate) {
        return res.status(404).json({ success: false, message: "Certificate not found" });
      }
  
      res.status(200).json({ success: true, data: certificate });  // Send the certificate data in response
    } catch (error) {
      console.error("Error fetching certificate:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export default {
    handleCreateCertificate,
    getCertificate,
  }
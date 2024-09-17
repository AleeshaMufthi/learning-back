import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

const OTP = async(mobile, otp) => {
    try{
      console.log("Authorization Token:", process.env.AUTH); 
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            variables_values: otp,
            route: 'otp',
            numbers: mobile,
          }, {
            headers: {
              Authorization: process.env.AUTH,
              'Content-Type': 'application/json',
            },
          });
      
          return response.data;
    }catch(error){
        console.error('Error sending OTP:', error);
        throw error;
    }
}

export default OTP
import axios from "axios";

const Otp = async(mobile, otp) => {
    try{
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

export default Otp
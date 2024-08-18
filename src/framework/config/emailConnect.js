import nodemailer from 'nodemailer'

// send an email, possibly containing an OTP, to a specified recipient.
const emailOtp = async (email,otp ) => {
      return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'pigabo40@gmail.com',
                pass: 'wvcv tpuo eqzo ghle'
            }
        })

        let message = {
            from: 'pigabo40@gmail.com',
            to: email,
            subject: 'For Verification Purpose',
            html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
        }

        transporter.sendMail(message, function(error, info){
            if(error){
                console.log("error");
                reject({Success: false})  
            }else{
                resolve({Success: true})
            }
        })
      })
}

export default emailOtp
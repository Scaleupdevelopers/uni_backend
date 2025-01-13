// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
// const authToken = process.env.TWILIO_AUTH_TOKEN;   // Twilio Auth Token
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

// const client = twilio(accountSid, authToken);

// export const sendOtpToPhone = async (phone: string, phoneCode: string, otp: number): Promise<void> => {
//     try {
//         const message = await client.messages.create({
//             body: `Your verification code is: ${otp}`, // Message body
//             from: twilioPhoneNumber,                  // Twilio phone number
//             to: `${phoneCode}${phone}`                // User's phone number with country code
//         });
//         console.log(`OTP sent to ${phoneCode}${phone}: ${message.sid}`);
//     } catch (error) {
//         console.error('Error sending OTP via Twilio:', error);
//         throw new Error('Failed to send OTP. Please try again.');
//     }
// };



import dotenv from 'dotenv';
dotenv.config();
import { BrevoClient } from "@getbrevo/brevo";





async function main() {
    const client = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY,
    });
    
    // const result=await client.senders.createSender({
    //     email: "akadian087@gmail.com",
    //     name: "Arman2",
    // });
    
    
//     const result=await client.senders.validateSenderByOtp(3, {
//         otp: 400589,
//     });
//     console.log(result);

//     const response = await fetch(
//     "https://api.brevo.com/v3/senders/3/validate",
//     {
//         method: "PUT",
//         headers: {
//             "accept": "application/json",
//             "api-key": process.env.BREVO_API_KEY,
//             "content-type": "application/json",
//         },
//         body: JSON.stringify({
//             otp: 400589,
//         }),
//     }
// );
    
}
main();



// import nodemailer from "nodemailer";
// import bcryptjs from "bcryptjs";
// import User from "@/models/userModel";

// export const sendemail = async ({ email, emailType, userId }: any) => {
//     try {
//         const hashedtoken = await bcryptjs.hash(userId, 10);
//         console.log(hashedtoken);
//         if (emailType === "VERIFY") {
//             await User.findByIdAndUpdate(userId, {
//                 $set:{
//                 isVerified:true,
//                 verifyToken: hashedtoken,
//                 verifyTokenExpiry: Date.now() + 360000,
//                 }
//             });
//             const updatedUser = await User.findById(userId);
// console.log("VerifyToken: ", updatedUser.verifyToken);
//         } else if (emailType === "RESET") {
//             await User.findByIdAndUpdate(userId, {
//                 $set:{
//                 forgotPasswordToken: hashedtoken,
//                 forgotPasswordTokenExpiry: Date.now() + 360000,
//                 }
//             });
//         };
    

//         // Setting up the transporter for sending emails
//         const transporter = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: "bfb0ae0bb5868f",
//                 pass: "ff6d09422f3c5e"
//             }
//         });

//         const mailOptions = {
//             from: 'senapatiashwani47@gmail.com',
//             to: email,
//             subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
//             html: `<p>Click <a href="${process.env.DOMAIN}"> Here </a> to
//                    ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
//                    </p>`,
//         };

//         // Await the mail sending
//         const mailResponse = await transporter.sendMail(mailOptions);
//         return mailResponse;

//     } catch (error: any) {
//         throw new Error(error.message);
//     }
// }

import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

// Define types for the function parameters
type EmailType = "VERIFY" | "RESET";

interface EmailParams {
    email: string;
    emailType: EmailType;
    userId: string;
}

export const sendemail = async ({ email, emailType, userId }: EmailParams) => {
    try {
        const hashedtoken = await bcryptjs.hash(userId, 10);
        console.log(hashedtoken);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    isVerified: false,
                    verifyToken: hashedtoken,
                    verifyTokenExpiry: Date.now() + 360000,
                }
            });
            const updatedUser = await User.findById(userId);
            console.log("VerifyToken: ", updatedUser?.verifyToken);
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedtoken,
                    forgotPasswordTokenExpiry: Date.now() + 360000,
                }
            });
        }

        // Setting up the transporter for sending emails
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "bfb0ae0bb5868f",
                pass: "ff6d09422f3c5e"
            }
        });

        const mailOptions = {
            from: 'senapatiashwani47@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verify?token=${hashedtoken}"> Here </a> to
                   ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
                   </p>`,
        };

        // Await the mail sending
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error) {
        // More robust error handling
        console.error("Email sending error:", error);
        throw new Error(
            error instanceof Error 
                ? error.message 
                : "Failed to send email"
        );
    }
};
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponses} from "@/types/ApiResponses"

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponses>
{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({username:userName, otp:verifyCode}),
        });
        return{success:true, message:"Verification sent successfully"}
        
    } catch (emailError) {
        console.error("Error is sending verification code", email);
        return{success:false, message:"faied to send Verification mail"}
        
    }
}
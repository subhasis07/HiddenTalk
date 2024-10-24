
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect();
    try {
        const{username, email, password}= await request.json();


        // Checking for Existing Verified Username
        const existingVerifieduserByUsername=await UserModel.findOne({
            userName: username,
            isVerified: true
        });

        if (existingVerifieduserByUsername) {
            return new Response(
                JSON.stringify({ success: false, message: 'Username is already taken' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }


        // Checking for Existing User by Email
        const existingUserByEmail= await UserModel.findOne(
            {
                email,
            }

        )

        let verifyCode=Math.floor(100000 + Math.random() * 900000).toString();

        //Handling Existing Unverified User
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return new Response(
                    JSON.stringify({ success: false, message: 'User already exists with this Email' }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }else{
                const hashedPassword=await bcrypt.hash(password,15);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+360000);
                await existingUserByEmail.save();
            }

            //Creating a New User
        }else{
            const hashedPassword= await bcrypt.hash(password,15);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser= new UserModel({
                userName: username, 
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save();
        }

        //sending verification email

        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({ success: false, message: emailResponse.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "User registered successfully. Please verify your account" }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error registering User : ", error);

        // The Response class in JavaScript is a constructor, not an API with static methods like json. It’s used to create a new response instance with custom properties.
        return new Response( //Creating a Response
            JSON.stringify({  //Passing the object , i want to send as a JSON string using JSON.stringify().
                success: false,
                message: "Error registering user"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json" //to inform the client that I am sending JSON data.
                }
            }
        );
        
    }
}
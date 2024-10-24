
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt';
import { sendVerificationEmain } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect();
    try {
        const{username, email, password}= await request.json()
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
import { z } from "zod";

export const userNameValidation =z 
        .string()
        .min(5, "usename must be at least 5 chars")
        .max(20, "userName must not be more than 20 chars")
        .regex(/^[a-zA_Z0-9_]+$/, "username must not contain special chars")


export const signUpSchema=z.object({
    username: userNameValidation,
    email: z.string().email({
        message:"Invalid Email Address"
    }),
    password: z.string().min(7, {
        message:"password must be of 7 Chars"
    })
})
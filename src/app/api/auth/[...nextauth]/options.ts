import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';


export const authOptions: NextAuthOptions= {
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials:{
                email:{label: 'Email' , type: 'text'},
                password:{label:'Password', type: 'password'},
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {userName:credentials.identifier},
                        ]
                    })
                            
                    if(!user){
                        throw new Error('No user found with this email');
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify your account before logging in');
                    }

                    const isPasswordCorrect= await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error('Incorrect password');
                    }

                } catch (error:any) {
                    throw new Error(error)                    
                }
            }
        })
    ]
}
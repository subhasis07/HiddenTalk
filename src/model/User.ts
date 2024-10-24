import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;  //in mongoose string -- s in small
    createdaAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String, //in Ts, String -- S in caps
        required:true
    },
    createdaAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    userName: string;  
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVeriied: boolean,
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String, 
        required:[true, "usernanme is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String, 
        required:[true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, `Please use a valid email address`]
    },
    verifyCode: {
        type: String, 
        required:[true, "VerifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date, 
        required:[true, "verifyCodeExpiry is required"],
    },
    isVeriied: {
        type: Boolean, 
        default: false
    },
    isAcceptingMessage: {
        type: Boolean, 
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);


export default UserModel;
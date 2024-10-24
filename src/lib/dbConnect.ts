import mongoose, { mongo } from "mongoose";

type ConnectionObject= {
    isConnected?: number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected");
        return;        
    }

    try {
        const db= await mongoose.connect(process.env.MONGODB_URI ||'');
        console.log(db);

        connection.isConnected = db.connections[0].readyState;
        console.log("db Connected ✔");
        
        
    } catch (error) {
        console.log(`DB connection failed; Error Message: ${error}` );
        
        process.exit(1)
    }
}

export default dbConnect;
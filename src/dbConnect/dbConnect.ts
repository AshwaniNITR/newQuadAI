import mongoose from "mongoose"

export default async function connectMongo(){
    try {
        console.log('Mongo URI:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI!);
        const connection =mongoose.connection;
        connection.on("connected",()=>{
            console.log("Mongo connected")
        })
        connection.on("error",(error)=>{
            console.log("MongoDb connection error",error);
            process.exit();
            
        })

    } catch (error) {
        console.log("Error occured",error)
    }
}
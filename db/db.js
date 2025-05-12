import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

try {
    mongoose.connect(process.env.DBSTRING)
  console.log("db connected")
} catch (error) {
    console.log("erroe while connecting to db", error)
}

process.on("SIGINT" , async()=>{
    await mongoose.disconnect()
    console.log("db disconnected")
    process.exit()
})


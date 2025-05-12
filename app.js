import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userModels from './db/userSchema.js'

import "./db/db.js"
import mongoose from 'mongoose'


const app = express()
app.use(express.json())

app.use(cors({
    credentials:true,origin:"http://localhost:5173"
}))

app.use(cookieParser())


app.get("/user", async (req,res)=>{
    const {uid} = req.cookies
    if(!uid) return res.status(401).json({err:"unauthenticated"})
    try {
        const allUser = await userModels.find()
    return res.status(200).json(allUser)
    } catch (error) {
        console.log("error while get all user", error)
        res.status(404).json({err:"invalid"})
    }
})

app.post("/user", async(req,res)=>{
    const {uid} = req.cookies
    if(!uid) return res.status(401).json({err:"unauthenticated"})
const {name ,email} = req.body
const newUser = {name , email ,password:"12345",rootDirID:new mongoose.Types.ObjectId() }
console.log(newUser)
try {
    await userModels.create(newUser)
   return res.status(201).json({msg:"user created"})
} catch (error) {
    console.error("User creation failed:", error.message);
    if (error?.errInfo?.details) {
      console.dir(error.errInfo.details, { depth: null });
    }
}
})


app.get("/setCookies", (req,res)=>{
    res.cookie('uid',"123456" , { httpOnly:true , maxAge:24*60*60*1000, sameSite:'none', secure:true})
    return res.status(200).json({msg:"cookie set"})
})


app.get("/isAuth", (req,res)=>{
    const {uid} = req.cookies
    if(!uid) return res.status(404).json({err:"unauthenticated"})
        res.status(200).json({msg:"authenticated"})
})

app.listen(process.env.PORT , ()=>{
    console.log("server listing on port")
})
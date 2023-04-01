import { config } from "dotenv";
import express from "express";
import cors from "cors"
import { ConnectionDB } from "./DB/DBConnecion.js";
import * as Routers from "./Src/Modules/Index.Routes.js"
import { stackLocation } from "./Src/Utils/ErrorHandling.js";
config({path:"./Config/Secret.env"})
ConnectionDB()
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000
const baseUrl = process.env.BASE_URL
app.use(`${baseUrl}/user`,Routers.UserRouter)
app.use('*', (req,res,next) => {res.status(400).json({message:'Error:404 Page Not Found'})})
app.use((err,req,res,next) => {
    if (err) {
        if (process.env.ENV_MODE == 'development') {
            return res.status(err['cause'] || 500).json({message:'Fail Response' , Error: err.message,  stack:stackLocation})
        }
        return res.status(err['cause'] || 500).json({message:'Fail Response' , Error: err.message})
    }
})
app.listen(port ,()=>{console.log(`Server Running On Port: ${port}`)})
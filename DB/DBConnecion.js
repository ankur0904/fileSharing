import mongoose from "mongoose"

export const ConnectionDB = async ()=>{
    return await mongoose.connect(process.env.DB_URL)
    .then(res => console.log("Database Connected Successfully"))
    .catch(error => console.log("Database Connection Failed",error))
}
mongoose.set('strictQuery', false);
const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const dotenv = require("dotenv")
dotenv.config({path : "./.env"})
const authorRoute = require("./src/routes/author")
const blogRoute = require("./src/routes/blog")

const app = express();
app.use(express.json());
app.use(multer().any());
app.use("/api/author",authorRoute)
app.use("/api/blog",blogRoute)


mongoose.connect(process.env.DB).then(()=>{
    console.log("mongodb is connected")
}).catch((error)=>{
    console.log(error)
})


port = process.env.PORT
app.listen(port,function(){
    console.log(`app is listening on port ${port}`)
})

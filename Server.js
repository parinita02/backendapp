const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config();

// const dburl ="mongodb://localhost:27017/projectdb"
// const dburl = process.env.mongodburl
// mongoose.connect(dburl).then(() => {
//     console.log("Connected to DB Successfully")
// }).catch((err) => {
//     console.log(err.message)
// });

//mongodb atlas  connection 
const dburl ="mongodb+srv://admin:admin@cluster0.bbqndwe.mongodb.net/projectdb?retryWrites=true&w=majority"
mongoose.connect(dburl).then(() => {
    console.log("Connected to MongoDB Atlas successfully")
}).catch((err) => {
    console.log(err.message)
});


const app = express() 
app.use(express.json()) 
app.use(cors())

const adminrouter = require("./routes/adminroutes")
const employeerouter = require("./routes/employeeroutes")


app.use("",adminrouter)
app.use("",employeerouter)

// const port= 2032
const port = process.env.PORT || 2032
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})
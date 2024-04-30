const admincontroller = require("../controllers/admincontroller")


const express = require("express")
const adminrouter = express.Router()

adminrouter.post("/insert",admincontroller.insert)
adminrouter.get("/viewemployees",admincontroller.ViewEmployees)
adminrouter.delete("/deleteemployee/:email",admincontroller.deleteemployee)
adminrouter.post("/checkadminlogin",admincontroller.checkadminlogin)
adminrouter.put("/changeadminpwd",admincontroller.changeadminpwd)
adminrouter.get("/analysis",admincontroller.analysis)

adminrouter.get("/viewleaverequests/:employeeid",admincontroller.viewleaverequests)
adminrouter.post("/changeleavestatus",admincontroller.changeleavestatus)
adminrouter.get("/viewleaverequestsbyemployee/:leaveid",admincontroller.viewleaverequestsbyemployee)

module.exports = adminrouter 
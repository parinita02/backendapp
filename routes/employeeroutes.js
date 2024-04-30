const employeecontroller = require("../controllers/employeecontroller")

const express = require("express")
const employeerouter = express.Router()

employeerouter.post("/checkemployeelogin",employeecontroller.checkemployeelogin)
employeerouter.put("/updateemployeeprofile",employeecontroller.updateemployeeprofile)
employeerouter.get("/employeeprofile/:email",employeecontroller.employeeprofile)

// employeerouter.get("/leavehistory",employeecontroller.viewleavehistory)
// employeerouter.post("/requestleave",employeecontroller.applyrequestleave)
employeerouter.get("/analysis1",employeecontroller.analysis1)
employeerouter.put("/changeemppwd",employeecontroller.changeemppwd)

employeerouter.post("/applyleave",employeecontroller.applyleave)
employeerouter.get("/leavehistory/",employeecontroller.leavehistory)
employeerouter.get("/eventimage/:filename",employeecontroller.eventimage)


module.exports= employeerouter
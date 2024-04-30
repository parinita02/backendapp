const Admin = require("../models/Admin")
const Emp=require("../models/EmpData")
const ApplyLeave = require("../models/ApplyLeave")

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const checkadminlogin = async (request, response) => 
{
   try 
   {
     const input = request.body
     const admin = await Admin.findOne(input)
     response.json(admin)
   } 
   catch (error) 
   {
     response.status(500).send(error.message);
   }
 };

 const changeadminpwd = async (request, response) => {
  try 
  {
    const { username, oldpassword, newpassword } = request.body;

    const admin = await Admin.findOne({ username, password: oldpassword });
    
     if (!admin) 
    {
      response.status(400).send('Invalid Old Password');
    }
    else
    {
        if(oldpassword==newpassword)
        {
          response.status(400).send('Both Passwords are Same');
        }
        else
        {
          await Admin.updateOne({username},{ $set: { password: newpassword } });
           response.json('Password Updated Successfully');
        }
      
    }
  } 
  catch (error) 
  {
    response.status(500).send(error.message);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './media/'); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File naming convention
  }
});

const upload = multer({ storage: storage }).single('file');

const insert = async (req, res) =>
      {
        try 
        {
          upload(req, res, async function (err) 
          {
            if (err) 
            {
              console.error(err);
              return res.status(500).send(err.message);
            }
            
            const { fullname , gender, dateofbirth, email, password, location,contact,qualification,workexperience,employeeid } = req.body;
            const fileName = req.file ? req.file.filename : undefined; // Extracting file name
      
            const newEvent = new Emp({
    fullname,
    gender,
    dateofbirth,
    email,
    password,
    location,
    contact,
    qualification,
    workexperience,
    employeeid,
    file: fileName, // Save only the file name
            });
      
            await newEvent.save();
            res.status(200).send('Event Registered Successfully');
          });
        } 
        catch (error) 
        {
          console.error(error);
          res.status(500).send(error.message);
        }
      };

      const viewemployeelist = async (req, res) => 
      {
        try 
        {
          const employeelist = await Emp.find();
          res.status(200).json(events);
        } 
        catch (error) 
        {
          res.status(500).send(error.message);
        }
      };
      
  const eventimage = async (req, res) => 
  {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../media', filename);
    console.log(filepath)
  
      fs.readFile(filepath, (err, data) => {
        if (err) 
        {
          console.error(err);
          return res.status(500).send('Error reading image file');
        }
       
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream'; // Default to octet-stream
  
  if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.pdf') {
    contentType = 'application/pdf';
  } else if (ext === '.txt') {
    contentType = 'text/plain';
  }
  
      res.setHeader('Content-Type', contentType);
        res.send(data);
      })
  }
  

  const ViewEmployees = async (request, response) => 
  {
     try 
     {
       const employees = await Emp.find();
       if(employees.length==0)
       {
         response.send("DATA NOT FOUND");
       }
       else
       {
         response.json(employees);
       }
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };
   
   const deleteemployee = async (request, response) => 
   {
      try 
      {
        const email = request.params.email
        const employee = await Emp.findOne({"email":email})
        if(employee!=null)
        {
          await Emp.deleteOne({"email":email})
          response.send("Deleted Successfully")
        }
        else
        {
          response.send("Email ID Not Found")
        }
  
      } 
      catch (error) 
      {
        response.status(500).send(error.message);
      }
    };

    const analysis = async (req, res) => {
      try 
      {
          const employeesCount = await Emp.countDocuments();
          res.json({employeesCount});
        } 
        catch (error) 
        {
            res.status(500).send(error.message);
        }
      };
  
      const viewleaverequests = async (request, response) => 
      {
        try 
        {
            const employeeid = request.params.employeeid;
            const leaves = await ApplyLeave.find({ "emp.employeeid": employeeid });
    
            if (leaves.length === 0) 
            {
                return response.status(200).send("No leaves found for this employee");
            }
            else
            {
              const employeeIds = leaves.map(leave => leave.emp.employeeid);
    
              const leaverequests = await ApplyLeave.find({ "emp.employeeid": { $in: employeeIds } });
      
              if (leaverequests.length === 0) 
              {
                  return response.status(200).send("No leaverequests found for this employee");
              }
              else
              {
                response.json(leaverequests);
              }
            }
        } 
        catch (error) 
        {
            response.status(500).send(error.message);
        }
    };
    
  const changeleavestatus = async (request, response) => 
{
  try 
  {
    const { employeeid, status } = request.body;

    if (!employeeid || !status) 
    {
      return response.status(400).send('Employee ID and status are required');
    }

    await ApplyLeave.findOneAndUpdate(
      { "emp.employeeid": employeeid },
      { $set: { leaveStatus: status } },
      { new: true } // it will return updated document
    );

    response.status(200).send('Leave Status Updated Successfully');
  } catch (error) {
    response.status(500).send(error.message);
  }
};
const viewleaverequestsbyemployee = async (request, response) => {
  try {
    const { leaveid } = request.params; // Destructure leaveid from request.params
    if (!leaveid) {
      return response.status(400).send("Leave ID is required");
    }
    
    // Assuming 'ApplyLeave' model is imported and available
    const leave = await ApplyLeave.findOne({ leaveid }); // Find by leaveid
    if (!leave) {
      return response.status(404).send("Leave not found");
    } else {
      return response.json(leave);
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

const fetchLeaveRequests = async () => {
  try {
    if (!employeeData || !employeeData.employeeid) {
      setError('Employee ID not found');
      return;
    }
    const response = await axios.get(`http://localhost:2032/viewleaverequestsbyemployee/${employeeData.employeeid}`);
    setLeaveRequests(response.data); // Assuming response.data contains the leave requests
  } catch (error) {
    setError(error.response.data);
  }
}


  module.exports = {insert,ViewEmployees,deleteemployee,checkadminlogin,changeadminpwd,analysis, viewleaverequests, changeleavestatus,eventimage,viewemployeelist,viewleaverequestsbyemployee,fetchLeaveRequests}
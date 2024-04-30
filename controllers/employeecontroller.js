const ApplyLeave = require("../models/ApplyLeave")
const Emp = require("../models/EmpData")


const multer = require('multer')
const path = require('path')
const fs = require('fs')

const updateemployeeprofile = async (request, response) => 
  {
    try 
    {
      const input = request.body;
      const email = input.email; 
      const emp = await Emp.findOne({ email });
      if (!emp) 
      {
        response.status(200).send('employee not found with the provided email id');
      }
      for (const key in input) 
      {
        if (key !== 'email' && input[key]) {
          emp[key] = input[key];
        }
      }
      await emp.save();
      response.status(200).send('Employee Profile Updated Successfully');
    } 
    catch (e) 
    {
      response.status(500).send(e.message);
    }
  };


  const checkemployeelogin = async (request, response) => 
  {
     try 
     {
       const input = request.body
       const emp= await Emp.findOne(input)
       response.json(emp)
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };

   const employeeprofile = async (request, response) => 
   {
      try 
      {
        const email = request.params.email
        const emp = await Emp.findOne({email})
        if(emp)
        {
          response.json(emp)
        }
        else
        {
          return response.status(200).send('employee not found with the provided email id');
        }
        
      } 
      catch (error) 
      {
        response.status(500).send(error.message);
      }
    };

// const viewleavehistory = async (request, response) => 
//  {
//     try 
//     {
//       const leavehistories= await LeaveHistory.find();
//       if(leavehistories.length==0)
//       {
//         response.send("DATA NOT FOUND");
//       }
//       else
//       {
//         response.json(leavehistories);
//       }
//     } 
//     catch (error) 
//     {
//       response.status(500).send(error.message);
//     }
//   };

  // const applyrequestleave = async (request, response) => {
  //   try 
  //   {
  //     const input = request.body;
  //     const applyrequestleave = new LeaveHistory(input);
  //     await applyrequestleave.save();
  //     response.send('Requested Successfully');
  //   } 
  //   catch(e) 
  //   {
  //     response.status(500).send(e.message);
  //   }
  // };

  const analysis1 = async (req, res) => {
    try 
    {
        const leavesCount = await ApplyLeave.countDocuments();
        res.json({leavesCount});
      } 
      catch (error) 
      {
          res.status(500).send(error.message);
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

    const applyleave = async (req, res) =>
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
          
          const {emp, typeofleave ,startdate , enddate,reason } = req.body;
          const fileName = req.file ? req.file.filename : undefined; // Extracting file name
    
          const newEvent = new ApplyLeave({
            emp,
           typeofleave,
           startdate,
           enddate,
           reason,
            file: fileName // Save only the file name
          });
    
          await newEvent.save();
          res.status(200).send('Leave Applied Successfully');
        });
      } 
      catch (error) 
      {
        console.error(error);
        res.status(500).send(error.message);
      }
    };

   
    // const applyleave = async (req, res) => {
    //   try {
    //     upload(req, res, async function (err) {
    //       if (err) {
    //         console.error(err);
    //         return res.status(500).send(err.message);
    //       }
          
    //       const { typeofleave, startdate, enddate, reason } = req.body;
    //       const fileName = req.file ? req.file.filename : undefined; // Extracting file name
    
    //       // Assuming employee data is available in req.body.emp
    //       const empData = req.body.emp;
    
    //       const newApplyLeave = new ApplyLeave({
    //         emp: empData, // Include employee data
    //         typeofleave,
    //         startdate,
    //         enddate,
    //         reason,
    //         file: fileName, // Save only the file name
    //         leaveStatus: "APPLIED" // Default status
    //       });
    
    //       await newApplyLeave.save();
    //       res.status(200).send('Leave Applied Successfully');
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send(error.message);
    //   }
    // };
    
    
    const leavehistory = async (req, res) => 
    {
      try 
      {
        const leaves = await ApplyLeave.find();
        res.status(200).json(leaves);
      } 
      catch (error) 
      {
        res.status(500).send(error.message);
      }
    };

//     const leavehistory = async (request, response) => 
//  {
//     try 
//     {
//       const empemployeeid = request.params.empemployeeid
//       const leaves = await ApplyLeave.find({"emp.employeeid":empemployeeid});
//       if(leaves.length==0)
//       {
//         response.status(200).send("DATA NOT FOUND");
//       }
//       else
//       {
//         response.json(leaves);
//       }
//     } 
//     catch (error) 
//     {
//       response.status(500).send(error.message);
//     }
//   };
 
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
    
    const changeemppwd = async (request, response) => 
  {
    try 
    {
      const { email, oldpassword, newpassword } = request.body;

      const emp = await Emp.findOne({email,password: oldpassword});

      if(!emp)
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
           await Emp.updateOne({email},{ $set: { password: newpassword } });
           response.json('Password Updated Successfully');
        }
      }
    }
    catch (error)
    {
      response.status(500).send(error.message);
    }
  };

  module.exports={updateemployeeprofile,checkemployeelogin,employeeprofile,analysis1,applyleave,leavehistory,eventimage,changeemppwd}
const mongoose = require("mongoose")

// const employeeschema = new mongoose.Schema({
//   employeeid: {
//     type: String,
//     required: true
//   },  
//   fullname: {
//       type: String,
//       required: true
//     },
//     gender: {
//       type: String,
//       required:true,
//       enum: ['male', 'female', 'others']
//     },
//     dateofbirth: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     location: {
//       type: String,
//       required: true
//     },
//     contact: {
//         type: String,
//         required: true,
//         unique:true
//       },
//       qualification: {
//         type: String,
//         required: true
//       },
//       workexperience: {
//         type: String,
//         required: true
//       },
//   });

  const adminschema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });


const admin = mongoose.model('Admin',adminschema);

module.exports = admin;
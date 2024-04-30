const mongoose = require("mongoose");
const moment = require('moment-timezone');

const applyleaveschema = new mongoose.Schema({ 
  emp: {
    type: Object,
    required: true
  },
  typeofleave: {
    type: String,
    required: true,
    enum: ['vacation', 'sick', 'maternity', 'others']
  },
  startdate: {
    type: String,
    required: true
  },
  enddate: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  file: {
    type: String, // URL
    required: true,
  },
  leaveStatus: {
    type: String,
    required: true,
    default: "APPLIED"
  },
  postedtime: {
    type: String,
    default: () => moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss A')
  },
  leaveid: {
    type: Number,
    unique: true,
    required: true,
    default: () => generateRandomId()
  }
});

const ApplyLeave = mongoose.model('Applyleave', applyleaveschema);

function generateRandomId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

// Middleware to generate leaveid before saving
applyleaveschema.pre('save', async function (next) {
  if (!this.leaveid || typeof this.leaveid !== 'number') {
    this.leaveid = generateRandomId();
  }
  next();
});

module.exports = ApplyLeave;

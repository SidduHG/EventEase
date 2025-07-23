const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String, required:false,
  },
   profileImage: { type: String }, 
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

 
  verifiedOrganizer: { type: Boolean, default: false },
  eventCount: { type: Number, default: 0 }, // total events created
  rejectionCount: { type: Number, default: 0 }, // total rejections

  // Optional enhancement
  tempBanned: { type: Boolean, default: false }, // auto-set if >3 rejections
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
 
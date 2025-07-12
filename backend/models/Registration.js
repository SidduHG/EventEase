const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guests can register
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  ticket: { 
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    name: String,
    price: Number
  },
  quantity: { type: Number, default: 1, min: 1 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'free'], default: 'pending' },
  registrationDate: { type: Date, default: Date.now },
  paymentIntentId: String // For payment processing
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
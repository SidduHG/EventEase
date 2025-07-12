const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  quantity: { type: Number, default: null },
  saleStart: Date,
  saleEnd: Date,
});

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'concert']
  },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    type: {
      type: String,
      required: true,
      enum: ['physical', 'virtual', 'hybrid']
    },
    address: String,
    url: String
  },
  registrationType: {
    type: String,
    required: true,
    enum: ['paid']
  },
  maxAttendees: { type: Number, default: null },
  tickets: [ticketSchema],
  imageUrl: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantity: { 
    type: Number, 
    default: null,
    min: 1
  },
  saleStart: { 
    type: Date, 
    required: true 
  },
  saleEnd: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > this.saleStart;
      },
      message: 'Sale end date must be after sale start date'
    }
  }
});

const eventSchema = new mongoose.Schema({
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'concert'],
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: {
      type: String,
      required: true,
      enum: ['physical', 'virtual', 'hybrid'],
      lowercase: true,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      required: function() {
        return this.location.type === 'physical';
      }
    },
    url: {
      type: String,
      trim: true,
      required: function() {
        return this.location.type !== 'physical';
      }
    }
  },
  registrationType: {
    type: String,
    required: true,
    enum: ['free', 'paid'],
    lowercase: true,
    trim: true
  },
  maxAttendees: { 
    type: Number, 
    default: null,
    min: 1
  },
  tickets: { 
    type: [ticketSchema],
    required: function() {
      return this.registrationType === 'paid';
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
eventSchema.index({ organizer: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ registrationType: 1 });

module.exports = mongoose.model('Event', eventSchema);
const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitation',
      required: true,
      index: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    attending: {
      type: Boolean,
      required: [true, 'Attendance response is required'],
    },
    message: {
      type: String,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RSVP', rsvpSchema);

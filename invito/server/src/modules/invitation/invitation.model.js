const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    templateId: {
      type: String,
      required: [true, 'Template selection is required'],
    },
    hostName: {
      type: String,
      required: [true, 'Host name is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventTime: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    mapLink: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    rsvpEnabled: {
      type: Boolean,
      default: true,
    },
    dressCode: {
      type: String,
      default: '',
    },
    contactInfo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to get RSVP count
invitationSchema.virtual('rsvpCount', {
  ref: 'RSVP',
  localField: '_id',
  foreignField: 'invitationId',
  count: true,
});

invitationSchema.set('toJSON', { virtuals: true });
invitationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Invitation', invitationSchema);

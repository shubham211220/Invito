const { body } = require('express-validator');

const createInvitationValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('templateId').notEmpty().withMessage('Template selection is required'),
  body('hostName').trim().notEmpty().withMessage('Host name is required'),
  body('eventDate').notEmpty().withMessage('Event date is required').isISO8601().withMessage('Invalid date format'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('rsvpEnabled').optional().isBoolean().withMessage('RSVP enabled must be a boolean'),
];

const updateInvitationValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('eventDate').optional().isISO8601().withMessage('Invalid date format'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('rsvpEnabled').optional().isBoolean().withMessage('RSVP enabled must be a boolean'),
];

module.exports = { createInvitationValidation, updateInvitationValidation };

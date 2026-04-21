const express = require('express');
const router = express.Router();
const rsvpController = require('./rsvp.controller');
const auth = require('../../middleware/auth');

// Public route — guests submit RSVP
router.post('/:slug', rsvpController.submitRsvp);

// Protected routes — invitation owner views/manages RSVPs
router.get('/invitation/:id', auth, rsvpController.getByInvitation);
router.delete('/:id', auth, rsvpController.deleteRsvp);

module.exports = router;

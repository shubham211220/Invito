const express = require('express');
const router = express.Router();
const invitationController = require('./invitation.controller');
const { createInvitationValidation, updateInvitationValidation } = require('./invitation.validator');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/stats', invitationController.getStats);
router.get('/', invitationController.getAll);
router.post('/', createInvitationValidation, validate, invitationController.create);
router.get('/:id', invitationController.getById);
router.put('/:id', updateInvitationValidation, validate, invitationController.update);
router.delete('/:id', invitationController.delete);

module.exports = router;

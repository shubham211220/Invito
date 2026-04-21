const RSVP = require('./rsvp.model');
const Invitation = require('../invitation/invitation.model');

class RsvpService {
  /**
   * Submit an RSVP for an invitation (by slug).
   */
  async submitRsvp(slug, data) {
    const invitation = await Invitation.findOne({ slug });
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!invitation.rsvpEnabled) {
      const error = new Error('RSVP is not enabled for this invitation.');
      error.statusCode = 400;
      throw error;
    }

    const rsvp = await RSVP.create({
      invitationId: invitation._id,
      guestName: data.guestName,
      attending: data.attending,
      message: data.message || '',
    });

    return rsvp;
  }

  /**
   * Get all RSVPs for an invitation (owner only).
   */
  async getByInvitationId(invitationId, userId) {
    // Verify the invitation belongs to the user
    const invitation = await Invitation.findOne({ _id: invitationId, userId });
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }

    const rsvps = await RSVP.find({ invitationId }).sort({ createdAt: -1 });
    const stats = {
      total: rsvps.length,
      attending: rsvps.filter((r) => r.attending).length,
      declined: rsvps.filter((r) => !r.attending).length,
    };

    return { rsvps, stats };
  }

  /**
   * Delete an RSVP (owner of invitation only).
   */
  async deleteRsvp(rsvpId, userId) {
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp) {
      const error = new Error('RSVP not found.');
      error.statusCode = 404;
      throw error;
    }

    // Verify the invitation belongs to this user
    const invitation = await Invitation.findOne({ _id: rsvp.invitationId, userId });
    if (!invitation) {
      const error = new Error('Not authorized to delete this RSVP.');
      error.statusCode = 403;
      throw error;
    }

    await RSVP.deleteOne({ _id: rsvpId });
    return { message: 'RSVP deleted successfully.' };
  }
}

module.exports = new RsvpService();

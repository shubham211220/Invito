const Invitation = require('./invitation.model');
const RSVP = require('../rsvp/rsvp.model');
const User = require('../user/user.model');
const generateSlug = require('../../utils/generateSlug');

class InvitationService {
  /**
   * Create a new invitation with unique slug.
   */
  async create(userId, data) {
    let slug = generateSlug();

    // Ensure uniqueness
    let existing = await Invitation.findOne({ slug });
    while (existing) {
      slug = generateSlug();
      existing = await Invitation.findOne({ slug });
    }

    // Fetch user's plan
    const user = await User.findById(userId).select('plan');

    const invitation = await Invitation.create({
      ...data,
      userId,
      slug,
      userPlan: user?.plan || 'free',
    });

    return invitation;
  }

  /**
   * Get all invitations for a user with RSVP counts.
   */
  async getByUserId(userId) {
    const invitations = await Invitation.find({ userId })
      .populate('rsvpCount')
      .sort({ createdAt: -1 });
    return invitations;
  }

  /**
   * Get a single invitation by ID (owner only).
   */
  async getById(id, userId) {
    const invitation = await Invitation.findOne({ _id: id, userId }).populate('rsvpCount');
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }
    return invitation;
  }

  /**
   * Get a public invitation by slug (no auth required).
   */
  async getBySlug(slug) {
    const invitation = await Invitation.findOne({ slug }).populate('rsvpCount');
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }
    return invitation;
  }

  /**
   * Update an invitation.
   */
  async update(id, userId, data) {
    const invitation = await Invitation.findOne({ _id: id, userId });
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }

    // Update allowed fields
    const allowedFields = [
      'title', 'templateId', 'hostName', 'eventDate', 'eventTime',
      'location', 'mapLink', 'description', 'imageUrl',
      'rsvpEnabled', 'dressCode', 'contactInfo', 'galleryImages', 'musicUrl',
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        invitation[field] = data[field];
      }
    });

    await invitation.save();
    return invitation;
  }

  /**
   * Delete an invitation and its RSVPs.
   */
  async delete(id, userId) {
    const invitation = await Invitation.findOne({ _id: id, userId });
    if (!invitation) {
      const error = new Error('Invitation not found.');
      error.statusCode = 404;
      throw error;
    }

    // Delete all associated RSVPs
    await RSVP.deleteMany({ invitationId: id });
    await Invitation.deleteOne({ _id: id });

    return { message: 'Invitation deleted successfully.' };
  }

  /**
   * Get dashboard stats for a user.
   */
  async getStats(userId) {
    const totalInvitations = await Invitation.countDocuments({ userId });
    const invitationIds = await Invitation.find({ userId }).select('_id');
    const ids = invitationIds.map((inv) => inv._id);

    const totalRsvps = await RSVP.countDocuments({ invitationId: { $in: ids } });
    const attendingRsvps = await RSVP.countDocuments({
      invitationId: { $in: ids },
      attending: true,
    });

    return {
      totalInvitations,
      totalRsvps,
      attendingRsvps,
      declinedRsvps: totalRsvps - attendingRsvps,
    };
  }
}

module.exports = new InvitationService();

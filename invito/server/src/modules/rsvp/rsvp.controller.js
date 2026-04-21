const rsvpService = require('./rsvp.service');
const ApiResponse = require('../../utils/apiResponse');

class RsvpController {
  /**
   * POST /api/rsvp/:slug — Submit RSVP (public).
   */
  async submitRsvp(req, res, next) {
    try {
      const rsvp = await rsvpService.submitRsvp(req.params.slug, req.body);
      return ApiResponse.created(res, { rsvp }, 'RSVP submitted successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/rsvp/invitation/:id — Get RSVPs for invitation (protected).
   */
  async getByInvitation(req, res, next) {
    try {
      const result = await rsvpService.getByInvitationId(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/rsvp/:id — Delete an RSVP (protected).
   */
  async deleteRsvp(req, res, next) {
    try {
      const result = await rsvpService.deleteRsvp(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RsvpController();

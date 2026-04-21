const invitationService = require('./invitation.service');
const ApiResponse = require('../../utils/apiResponse');

class InvitationController {
  /**
   * POST /api/invitations
   */
  async create(req, res, next) {
    try {
      const invitation = await invitationService.create(req.user._id, req.body);
      return ApiResponse.created(res, { invitation }, 'Invitation created successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invitations
   */
  async getAll(req, res, next) {
    try {
      const invitations = await invitationService.getByUserId(req.user._id);
      return ApiResponse.success(res, { invitations });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invitations/stats
   */
  async getStats(req, res, next) {
    try {
      const stats = await invitationService.getStats(req.user._id);
      return ApiResponse.success(res, { stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invitations/:id
   */
  async getById(req, res, next) {
    try {
      const invitation = await invitationService.getById(req.params.id, req.user._id);
      return ApiResponse.success(res, { invitation });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/invitations/:id
   */
  async update(req, res, next) {
    try {
      const invitation = await invitationService.update(req.params.id, req.user._id, req.body);
      return ApiResponse.success(res, { invitation }, 'Invitation updated successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/invitations/:id
   */
  async delete(req, res, next) {
    try {
      const result = await invitationService.delete(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invite/:slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const invitation = await invitationService.getBySlug(req.params.slug);
      return ApiResponse.success(res, { invitation });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvitationController();

const imageService = require('../services/imageService');
const { formatResponse } = require('../utils/response');

/**
 * Controller xử lý các request liên quan đến Image
 */
class ImageController {
  /**
   * Upload một hình ảnh mới
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async uploadImage(req, res) {
    try {
      const { noteId, userId } = req.body;
      
      if (!noteId || !userId) {
        return res.status(400).json(formatResponse(400, 'Note ID and User ID are required'));
      }
      
      if (!req.file) {
        return res.status(400).json(formatResponse(400, 'No image file uploaded'));
      }
      
      const image = await imageService.uploadImage(req.file, noteId, userId);
      return res.status(201).json(formatResponse(201, 'Image uploaded successfully', image));
    } catch (error) {
      console.error('Error in uploadImage controller:', error);
      return res.status(500).json(formatResponse(500, 'Error uploading image'));
    }
  }

  /**
   * Lấy thông tin hình ảnh theo ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getImageById(req, res) {
    try {
      const { id } = req.params;
      const image = await imageService.getImageById(id);
      
      if (!image) {
        return res.status(404).json(formatResponse(404, 'Image not found'));
      }
      
      return res.status(200).json(formatResponse(200, 'Image found', image));
    } catch (error) {
      console.error('Error in getImageById controller:', error);
      return res.status(500).json(formatResponse(500, 'Error getting image'));
    }
  }

  /**
   * Lấy tất cả hình ảnh của một note
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getImagesByNoteId(req, res) {
    try {
      const { noteId } = req.params;
      const images = await imageService.getImagesByNoteId(noteId);
      return res.status(200).json(formatResponse(200, `Images for note ${noteId}`, images));
    } catch (error) {
      console.error('Error in getImagesByNoteId controller:', error);
      return res.status(500).json(formatResponse(500, 'Error getting images'));
    }
  }

  /**
   * Lấy tất cả hình ảnh của một user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getImagesByUserId(req, res) {
    try {
      const { userId } = req.params;
      const images = await imageService.getImagesByUserId(userId);
      return res.status(200).json(formatResponse(200, `Images for user ${userId}`, images));
    } catch (error) {
      console.error('Error in getImagesByUserId controller:', error);
      return res.status(500).json(formatResponse(500, 'Error getting images'));
    }
  }

  /**
   * Xóa một hình ảnh theo ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteImage(req, res) {
    try {
      const { id } = req.params;
      const deleted = await imageService.deleteImage(id);
      
      if (!deleted) {
        return res.status(404).json(formatResponse(404, 'Image not found'));
      }
      
      return res.status(200).json(formatResponse(200, 'Image deleted successfully'));
    } catch (error) {
      console.error('Error in deleteImage controller:', error);
      return res.status(500).json(formatResponse(500, 'Error deleting image'));
    }
  }

  /**
   * Xóa tất cả hình ảnh của một note
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteImagesByNoteId(req, res) {
    try {
      const { noteId } = req.params;
      const count = await imageService.deleteImagesByNoteId(noteId);
      return res.status(200).json(formatResponse(200, `Deleted ${count} images for note ${noteId}`));
    } catch (error) {
      console.error('Error in deleteImagesByNoteId controller:', error);
      return res.status(500).json(formatResponse(500, 'Error deleting images'));
    }
  }
}

module.exports = new ImageController();
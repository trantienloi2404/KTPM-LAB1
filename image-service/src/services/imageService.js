const cloudinary = require('../config/cloudinary');
const firebaseService = require('./firebaseService');
const fs = require('fs');
const path = require('path');

/**
 * Service xử lý thao tác với Images
 */
class ImageService {
  /**
   * Upload image lên Cloudinary và lưu thông tin vào Firebase
   * @param {Object} file - File từ multer
   * @param {string} noteId - ID của note
   * @param {string} userId - ID của user
   * @returns {Promise<Object>} - Trả về thông tin image đã lưu
   */
  async uploadImage(file, noteId, userId) {
    try {
      // Upload lên Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `notes/${noteId}`,
        resource_type: 'image'
      });
      
      // Xóa file tạm sau khi upload
      fs.unlinkSync(file.path);
      
      // Lưu thông tin vào Firebase
      const imageData = {
        noteId: noteId,
        userId: userId,
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        createdAt: new Date().toISOString()
      };
      
      return await firebaseService.saveImage(imageData);
    } catch (error) {
      // Đảm bảo xóa file tạm nếu có lỗi xảy ra
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin image theo ID
   * @param {string} id - ID của image
   * @returns {Promise<Object|null>} - Trả về thông tin image hoặc null
   */
  async getImageById(id) {
    return await firebaseService.getImageById(id);
  }

  /**
   * Lấy tất cả images của một note
   * @param {string} noteId - ID của note
   * @returns {Promise<Array>} - Trả về danh sách images
   */
  async getImagesByNoteId(noteId) {
    return await firebaseService.getImagesByNoteId(noteId);
  }

  /**
   * Lấy tất cả images của một user
   * @param {string} userId - ID của user
   * @returns {Promise<Array>} - Trả về danh sách images
   */
  async getImagesByUserId(userId) {
    return await firebaseService.getImagesByUserId(userId);
  }

  /**
   * Xóa image theo ID
   * @param {string} id - ID của image cần xóa
   * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
   */
  async deleteImage(id) {
    try {
      // Lấy thông tin image trước khi xóa
      const image = await firebaseService.getImageById(id);
      if (!image) return false;
      
      // Xóa image từ Cloudinary
      await cloudinary.uploader.destroy(image.publicId);
      
      // Xóa thông tin từ Firebase
      return await firebaseService.deleteImage(id);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Xóa tất cả images của một note
   * @param {string} noteId - ID của note
   * @returns {Promise<number>} - Trả về số lượng images đã xóa
   */
  async deleteImagesByNoteId(noteId) {
    try {
      // Lấy tất cả images của note
      const images = await firebaseService.getImagesByNoteId(noteId);
      
      // Xóa từng image từ Cloudinary
      for (const image of images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
      
      // Xóa tất cả thông tin từ Firebase
      return await firebaseService.deleteImagesByNoteId(noteId);
    } catch (error) {
      console.error('Error deleting images by note ID:', error);
      throw error;
    }
  }
}

module.exports = new ImageService();
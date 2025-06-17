const { imagesCollection } = require('../config/firebase');

/**
 * Service xử lý thao tác với Firebase
 */
class FirebaseService {
  /**
   * Lưu thông tin image vào Firebase
   * @param {Object} imageData - Dữ liệu hình ảnh để lưu
   * @returns {Promise<Object>} - Trả về đối tượng đã lưu với ID
   */
  async saveImage(imageData) {
    try {
      const docRef = await imagesCollection.add({
        ...imageData,
        createdAt: new Date().toISOString()
      });
      
      const doc = await docRef.get();
      return {
        id: docRef.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error saving image to Firebase:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin image theo ID
   * @param {string} id - ID của image cần lấy
   * @returns {Promise<Object|null>} - Trả về thông tin image hoặc null nếu không tìm thấy
   */
  async getImageById(id) {
    try {
      const doc = await imagesCollection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error getting image from Firebase:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả images của một note
   * @param {string} noteId - ID của note
   * @returns {Promise<Array>} - Trả về danh sách images thuộc về note
   */
  async getImagesByNoteId(noteId) {
    try {
      const snapshot = await imagesCollection.where('noteId', '==', noteId).get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting images by note ID:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả images của một user
   * @param {string} userId - ID của user
   * @returns {Promise<Array>} - Trả về danh sách images thuộc về user
   */
  async getImagesByUserId(userId) {
    try {
      const snapshot = await imagesCollection.where('userId', '==', userId).get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting images by user ID:', error);
      throw error;
    }
  }

  /**
   * Xóa image theo ID
   * @param {string} id - ID của image cần xóa
   * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
   */
  async deleteImage(id) {
    try {
      await imagesCollection.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting image from Firebase:', error);
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
      const batch = imagesCollection.firestore.batch();
      const snapshot = await imagesCollection.where('noteId', '==', noteId).get();
      
      if (snapshot.empty) return 0;
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return snapshot.size;
    } catch (error) {
      console.error('Error deleting images by note ID:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();
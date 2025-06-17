const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middleware/upload');

// Lưu ý thứ tự các route - route cụ thể phải đặt trước route có tham số

// Get images by note ID - đặt trước route có tham số :id
router.get('/note/:noteId', imageController.getImagesByNoteId);

// Get images by user ID - đặt trước route có tham số :id
router.get('/user/:userId', imageController.getImagesByUserId);

// Delete all images for a note - đặt trước route có tham số :id
router.delete('/note/:noteId', imageController.deleteImagesByNoteId);

// Upload a new image
router.post('/', upload.single('image'), imageController.uploadImage);

// Get image by ID
router.get('/:id', imageController.getImageById);

// Delete image by ID
router.delete('/:id', imageController.deleteImage);

module.exports = router;
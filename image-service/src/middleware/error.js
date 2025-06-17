/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Xử lý lỗi Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 400,
      message: 'File too large. Maximum size is 5MB'
    });
  }
  
  // Xử lý lỗi không đúng định dạng file
  if (err.message === 'Not an image! Please upload only images.') {
    return res.status(400).json({
      status: 400,
      message: err.message
    });
  }
  
  // Xử lý các lỗi khác
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error'
  });
};

module.exports = errorHandler;
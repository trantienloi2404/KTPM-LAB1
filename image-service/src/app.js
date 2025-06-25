const express = require('express');
const path = require('path');
const fs = require('fs');
const configExpress = require('./config/express');
const errorHandler = require('./middleware/error');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

// Khởi tạo Express app
const app = express();

// Áp dụng cấu hình Express
configExpress(app);

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Đăng ký routes
app.use('/api/images', imageRoutes);

// Đăng ký middleware xử lý lỗi
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
  console.log(`Image Service running on port ${PORT}`);
});

module.exports = app;
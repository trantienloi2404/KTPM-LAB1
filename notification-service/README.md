# 🔔 Simple Notification Service

Một notification service nội bộ đơn giản được xây dựng bằng NestJS và TypeScript. Chỉ dành cho quản lý thông báo trong app, không gửi email/SMS/push notifications.

## ✨ Tính năng

- 🔔 CRUD notifications cơ bản với validation
- 👤 Quản lý thông báo theo user
- 📬 Đánh dấu đã đọc/chưa đọc
- 🎯 Hệ thống priority (low, normal, high)
- 📊 Thống kê và báo cáo
- 📚 Swagger API documentation
- 🗄️ SQLite database - đơn giản, không cần setup
- 🐳 Docker support - chạy 1 lệnh là xong
- 🔧 Dễ tích hợp vào các project khác

## 🚀 Cách chạy nhanh nhất

### Option 1: Docker (Khuyến nghị) 🐳

```bash
# Chạy với Docker Compose (1 lệnh duy nhất)
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng service
docker-compose down
```

### Option 2: Chạy trực tiếp

```bash
# Cài đặt dependencies
npm install

# Chạy development mode
npm run start:dev

# Hoặc build và chạy production
npm run build
npm run start:prod
```

## 📡 Truy cập service

- **API Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api (để kiểm tra service có hoạt động không)

## 📚 API Documentation

### 🆕 Tạo notification mới
```bash
POST /api/notifications
Content-Type: application/json

{
  "title": "Tiêu đề thông báo",
  "message": "Nội dung thông báo chi tiết",
  "userId": "user-id-123",     // Optional - để trống nếu là system notification
  "priority": "normal",        // low | normal | high
  "data": {                    // Optional - data bổ sung
    "orderId": "ORD-123",
    "amount": 1500000
  }
}
```

### 📖 Xem notifications
```bash
# Tất cả notifications (có phân trang)
GET /api/notifications?page=1&limit=10

# Notifications của 1 user cụ thể
GET /api/notifications/user/user-id-123

# Chỉ những notifications chưa đọc
GET /api/notifications/user/user-id-123/unread

# Lấy 1 notification theo ID
GET /api/notifications/notification-id-456
```

### ✅ Đánh dấu đã đọc
```bash
# Đánh dấu 1 notification đã đọc
PATCH /api/notifications/notification-id-456/read

# Đánh dấu tất cả notifications của user đã đọc
PATCH /api/notifications/user/user-id-123/read-all
```

### 📊 Thống kê
```bash
# Thống kê tổng quan
GET /api/notifications/stats

# Thống kê của 1 user
GET /api/notifications/stats/user-id-123
```

### 🗑️ Xóa notifications
```bash
# Xóa 1 notification
DELETE /api/notifications/notification-id-456

# Xóa tất cả notifications của user
DELETE /api/notifications/user/user-id-123
```
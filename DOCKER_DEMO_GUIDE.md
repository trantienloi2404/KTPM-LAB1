# Docker Demo Mode Guide

Hướng dẫn chạy dự án với Docker trong chế độ demo (bỏ qua authentication).

## 🚀 Cách chạy:

### 1. **Build và chạy tất cả services:**
```bash
docker-compose up --build
```

### 2. **Chạy chỉ backend services (nếu frontend có lỗi):**
```bash
docker-compose up --build postgres_authenticate postgres_todo postgres_notification postgres_image redis authenticate-service todotask-service notification-service image-service
```

### 3. **Chạy frontend riêng (nếu cần):**
```bash
cd frontend
npm start
```

## 📋 Services và Ports:

- **Frontend**: http://localhost:3001 (Docker) hoặc http://localhost:3000 (npm)
- **Authenticate Service**: http://localhost:8081
- **Todo Service**: http://localhost:8082  
- **Notification Service**: http://localhost:8083
- **Image Service**: http://localhost:8084
- **PostgreSQL Databases**: 5432, 5433, 5434, 5435
- **Redis**: 6379

## ⚡ Demo Mode đã được kích hoạt:

- ✅ Bỏ qua authentication
- ✅ Tự động dùng userId = 1 cho tất cả todo operations
- ✅ Mock auth API responses
- ✅ Nginx proxy routing đã được fix (/api/todos)

## 🔧 Troubleshooting:

### Nếu gặp lỗi "dependency failed to start" hoặc "unhealthy":
Lỗi này đã được fix! Health checks đã được tắt để tránh curl/wget dependency issues:
```bash
# Stop và rebuild hoàn toàn
docker-compose down -v
docker-compose up --build
```

### Nếu gặp lỗi "502 Bad Gateway":
Lỗi này đã được fix! API routing và health checks đã được cập nhật:
```bash
# Stop và rebuild hoàn toàn
docker-compose down -v
docker-compose up --build
```

### Nếu gặp lỗi "n.map is not a function":
Lỗi này đã được fix! Restart docker:
```bash
docker-compose down
docker-compose up --build
```

### Nếu frontend service không start:
```bash
# Stop tất cả
docker-compose down

# Chạy chỉ backend
docker-compose up --build postgres_authenticate postgres_todo redis authenticate-service todotask-service

# Chạy frontend local
cd frontend
npm install
npm start
```

### Nếu có lỗi environment variables:
- Kiểm tra file `.env` đã được tạo
- Các biến optional có thể để giá trị demo

### Nếu có lỗi database connection:
```bash
# Xóa volumes và restart
docker-compose down -v
docker-compose up --build
```

## 🎯 Để trình bày:

1. **Chạy full Docker stack:**
   ```bash
   docker-compose up --build
   ```
   
2. **Truy cập:** http://localhost:3001

3. **Demo features:**
   - Todo list (không cần đăng nhập)
   - Profile page  
   - All CRUD operations

## 📝 Lưu ý:

- Demo mode bypass toàn bộ authentication
- Dữ liệu sẽ persist trong Docker volumes
- Để tắt demo mode, xem `frontend/DEMO_MODE.md` 
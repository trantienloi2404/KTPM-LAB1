# Image Service

Microservice để quản lý và lưu trữ hình ảnh cho ứng dụng Note.

## Công nghệ sử dụng

- **Node.js + Express:** Backend API
- **Cloudinary:** Lưu trữ hình ảnh
- **Firebase Firestore:** Lưu trữ metadata hình ảnh
- **Docker:** Container hóa ứng dụng

## Cài đặt và chạy

### 1. Cài đặt thủ công

```bash
# Cài đặt các package cần thiết
npm install

# Chạy server
npm run dev

# Chạy với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng service
docker-compose down

API Hướng dẫn sử dụng
a) Upload Image
Method: POST

URL: http://localhost:8084/api/images

Headers: Không cần thiết lập thêm

Body: Chọn form-data

image (Type: File) → Chọn một file hình ảnh từ máy tính

noteId (Type: Text) → Ví dụ: 123

userId (Type: Text) → Ví dụ: 456

b) Get Images by Note ID
Method: GET

URL: http://localhost:8084/api/images/note/123 (thay 123 bằng noteId thực tế)


c) Get Image by ID
Method: GET

URL: http://localhost:8084/api/images/[image-id] (thay [image-id] bằng ID của hình ảnh đã upload)


d) Delete Image
Method: DELETE

URL: http://localhost:8084/api/images/[image-id] (thay [image-id] bằng ID của hình ảnh đã upload)


e) Delete All Images of a Note
Method: DELETE

URL: http://localhost:8084/api/images/note/123 (thay 123 bằng noteId thực tế)



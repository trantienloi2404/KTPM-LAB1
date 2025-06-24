# Demo Mode Guide

Demo mode đã được kích hoạt để bỏ qua authentication cho việc trình bày dự án.

## Để tắt Demo Mode (khôi phục authentication):

1. **Tắt PrivateRoute bypass:**
   - Mở file `src/components/auth/PrivateRoute.js`
   - Đổi `const DEMO_MODE = true;` thành `const DEMO_MODE = false;`

2. **Tắt axios interceptors:**
   - Mở file `src/index.js` 
   - Đổi `const DEMO_MODE = true;` thành `const DEMO_MODE = false;`

3. **Khôi phục auth state:**
   - Mở file `src/store/slices/authSlice.js`
   - Đổi initial state về:
   ```javascript
   const initialState = {
     user: null,
     token: localStorage.getItem('token'),
     loading: false,
     error: null,
   };
   ```

4. **Xóa demo notice:**
   - Mở file `src/App.js`
   - Xóa phần Alert component

## Demo Mode Features:

- ✅ Bỏ qua kiểm tra authentication 
- ✅ Tự động thêm userId vào todo requests
- ✅ Mock auth API responses
- ✅ Hiển thị thông báo demo mode
- ✅ Sử dụng user demo: "Demo User" (ID: 1)

## Lưu ý:
- Trong demo mode, app sẽ hoạt động như user đã đăng nhập
- Tất cả todo operations sẽ sử dụng userId = 1
- Auth API calls sẽ được mock để tránh lỗi 
FROM node:18-alpine

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Tạo thư mục uploads
RUN mkdir -p src/uploads

# Expose port
EXPOSE 8084

# Start application
CMD ["node", "src/app.js"]
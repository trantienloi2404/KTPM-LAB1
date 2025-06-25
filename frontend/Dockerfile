# ================================
# Build Stage
# ================================
FROM node:18-alpine AS builder

# Install dependencies for better performance
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with optimizations
RUN npm install && npm cache clean --force

# Set NODE_OPTIONS for build optimization
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy source code
COPY . .

# Build the application with optimizations
RUN npm run build && \
    rm -rf node_modules

# ================================
# Production Stage  
# ================================
FROM nginx:alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx with optimized config
CMD ["nginx", "-g", "daemon off;"] 
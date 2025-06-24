# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build && \
    rm -rf node_modules

# Production Stage
FROM node:20-alpine AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package.json ./
COPY yarn.lock ./
# Install only production dependencies
RUN yarn install --only=production

# Copy built app from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Switch to non-root user
USER nestjs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
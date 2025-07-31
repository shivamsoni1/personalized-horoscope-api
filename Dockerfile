# Local development Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies including curl for health checks
RUN apk add --no-cache curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for local development)
RUN npm install

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application with MongoDB wait
CMD ["node", "wait-for-mongo.js"]
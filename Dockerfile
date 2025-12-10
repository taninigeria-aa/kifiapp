FROM node:18-alpine AS builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY backend/ ./backend/
WORKDIR /app/backend

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/backend/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]

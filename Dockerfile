# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy-peer-deps to avoid conflicts with React 19
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install serve globally to serve the build
RUN npm install -g serve

# Copy only the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5500
EXPOSE 5500

# Command to serve the static files
CMD ["serve", "-s", "dist", "-l", "5500"]

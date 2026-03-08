# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies (using legacy-peer-deps to resolve eslint conflicts)
RUN npm install --legacy-peer-deps

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# Stage 2: Setup the Node.js server
FROM node:20-alpine AS production

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy server source code
COPY server/ ./

# Copy built frontend from stage 1 to client-build folder
COPY --from=frontend-build /app/client/dist ./client-build

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

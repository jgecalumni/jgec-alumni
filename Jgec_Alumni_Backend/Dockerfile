# Base image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

# This will install dependencies and automatically run `prisma generate` due to the postinstall script
RUN npm install

# Copy all source files
COPY . .

# Build the TypeScript code
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the build artifacts and node modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# The backend index.ts uses port 8000 by default
EXPOSE 8000

# Start the Node.js server
CMD ["npm", "start"]

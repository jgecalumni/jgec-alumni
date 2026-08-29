# Base image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
# Using package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Pass build arguments for Next.js public variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expose port (Next.js config in package.json uses 4000)
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start"]

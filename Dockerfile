# Multi-stage Dockerfile for Next.js application

# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# ============================================================================
# Stage 2: Build dependencies (for development and testing)
# ============================================================================
FROM node:20-alpine AS build-dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci && \
    npm cache clean --force

# ============================================================================
# Stage 3: Builder (compiles TypeScript and builds Next.js)
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY --from=build-dependencies /app/node_modules ./node_modules

COPY . .

# Build the application
RUN npm run build

# ============================================================================
# Stage 4: Development
# ============================================================================
FROM node:20-alpine AS development

WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# ============================================================================
# Stage 5: Testing
# ============================================================================
FROM builder AS testing

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENV NODE_ENV=test

# Run tests if they exist
CMD ["npm", "run", "dev"]

# ============================================================================
# Stage 6: Production
# ============================================================================
FROM node:20-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy only built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]

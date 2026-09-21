FROM node:24-alpine AS builder
WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy sources
COPY . .

FROM node:24-alpine
WORKDIR /usr/src/app

# Copy app from builder
COPY --from=builder /usr/src/app .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]

# --- Build stage: compile bcrypt native bindings ---
FROM node:22-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# --- Production stage: slim image without build tools ---
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]

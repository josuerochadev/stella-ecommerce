# --- Build stage: install deps and build static assets ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
# --legacy-peer-deps required: react-scripts@5 expects typescript@^4
# but the project uses typescript@^5. Safe to ignore until react-scripts
# is upgraded or replaced.
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# --- Production stage: serve static files with nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# SPA fallback: redirect all routes to index.html
RUN printf 'server {\n\
  listen 3001;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

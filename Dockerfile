# ---- Build stage ----
FROM node:24-alpine AS build
WORKDIR /app

# Copy only manifests first (better caching)
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Copy source and build
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm run build


# ---- Runtime stage (nginx) ----
FROM nginx:alpine AS runtime

# Copy built assets into nginx web root
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Replace default server config (SPA + caching headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

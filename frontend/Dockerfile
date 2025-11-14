# Build Stage
FROM oven/bun:latest AS build

WORKDIR /app

# copy package files
COPY  bun.lock  package.json ./

# Install dependencies
RUN  bun install

# Copy project files
COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL


# Buld Vite
RUN bun run build

# Deploy Stage Using Nginx
FROM nginx:1.27-alpine AS deploy


# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


# Use a multi-stage build to separate the build stage from the final image.
FROM oven/bun:latest AS app-builder
WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

# Stage 2: Create a production-ready bundle
COPY . .
RUN bun run build

# Stage 3: Build the final Nginx configuration and copy it to the final image
FROM nginx:mainline-alpine
ARG PORT
COPY configs/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=app-builder /app/dist /usr/share/nginx/html

# Expose the port and start Nginx
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]

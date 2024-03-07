# install node_modules
FROM oven/bun:latest AS modules
WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install

# build the files
FROM oven/bun:latest as builder
WORKDIR /app
COPY --from=modules /app/node_modules node_modules/
COPY . .
RUN bun run build

FROM nginx:mainline-alpine
ARG PORT
COPY --from=builder /app/dist /usr/share/nginx/html
COPY configs/nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]


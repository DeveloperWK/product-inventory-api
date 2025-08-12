FROM ubuntu AS build


RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt install -y nodejs && \
    npm install -g pnpm typescript

WORKDIR /app


COPY package.json pnpm-lock.yaml tsconfig.json .env ./
RUN pnpm i


COPY . .


RUN pnpm run build
FROM node:alpine AS runner

WORKDIR /app


COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env

COPY --from=build /app/dist .

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]

FROM node:20.15.1-bookworm-slim AS builder
RUN echo "Dockerfile: making production build"

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package*.json nest-cli*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.15.1-bookworm-slim
RUN echo "Dockerfile: making runtime environment"
LABEL maintainer="joonseokhu"

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apk add --no-cache tini tzdata
RUN mkdir /var/log/nodejs
RUN mkdir /var/log/git-lfs
RUN mkdir /srv/git-lfs
RUN chown node:node /var/log/nodejs
RUN chown node:node /var/log/git-lfs

COPY package*.json nest-cli*.json ./
COPY --from=builder /usr/src/app/dist ./dist
RUN npm ci --omit=dev

EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]

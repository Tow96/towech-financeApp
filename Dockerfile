ARG ALPINE_VERSION=3.18
FROM node:18-alpine${ALPINE_VERSION} AS base

# Dependencies ------------------------------------------------------------------------------------
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder -----------------------------------------------------------------------------------------
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN npm run build

# Runner ------------------------------------------------------------------------------------------
  FROM alpine:${ALPINE_VERSION} AS runner
  WORKDIR /usr/src/app
  
  # RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  #   && chown node:node ./
  
  RUN apk add --update nodejs dumb-init \
    && addgroup -g 1001 node && adduser -u 1001 -G node -s /bin/sh -D node \
    && chown node:node ./
  
  USER node
  ENV NEXT_TELEMETRY_DISABLED 1
  ENV HOSTNAME "0.0.0.0"
  ENV PORT 3000
  
  # COPY --from=builder /app/public ./public
  COPY --from=builder /app/next.config.mjs ./
  COPY --from=builder --chown=nextjs:nodejs /app/dist/static ./dist/static
  COPY --from=builder --chown=nextjs:nodejs /app/dist/standalone ./
  
  EXPOSE 3000
  CMD ["dumb-init", "node", "server.js"]
  
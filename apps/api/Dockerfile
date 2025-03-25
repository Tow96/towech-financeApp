ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine AS base

# Dependencies ------------------------------------------------------------------------------------
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY dist/apps/Api/package*.json ./
RUN npm install --omit=dev

# Runner ------------------------------------------------------------------------------------------
FROM alpine:${ALPINE_VERSION} AS runner
WORKDIR /usr/src/app

ARG UID=1001
ARG USER=nestjs
ARG GID=1001
ARG GROUP=node

COPY --from=base /usr/lib /usr/lib
COPY --from=base /usr/local/lib /usr/local/lib
COPY --from=base /usr/local/include /usr/local/include
COPY --from=base /usr/local/bin /usr/local/bin

RUN apk add --update dumb-init \
  && addgroup -g ${GID} ${GROUP} \
  && adduser -u ${UID} -G ${GROUP} -s /bin/sh -D ${USER} \
  && chown ${USER}:${GROUP} ./

USER ${USER}
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV PORT 3000
  
COPY --from=deps --chown=${USER}:${GROUP} /app/node_modules ./node_modules
COPY --from=deps --chown=${USER}:${GROUP} /app/package.json ./package.json
COPY --chown=${USER}:${GROUP} dist/apps/Api .

EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]

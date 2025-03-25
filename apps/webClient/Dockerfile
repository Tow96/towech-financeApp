
ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine AS base

FROM alpine:${ALPINE_VERSION} AS runner
WORKDIR /usr/src/app

ARG UID=1001
ARG USER=nextjs
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
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV PORT=3000

COPY apps/webclient/next.config.js ./
# COPY --chown=${USER}:${GROUP} apps/webclient/public ./public
COPY --chown=${USER}:${GROUP} apps/webclient/.next/static ./.next/static
COPY --chown=${USER}:${GROUP} apps/webclient/.next/standalone/apps/webclient ./
COPY --chown=${USER}:${GROUP} apps/webclient/.next/standalone/package.json ./
COPY --chown=${USER}:${GROUP} apps/webclient/.next/standalone/node_modules ./node_modules

EXPOSE 3000
CMD ["dumb-init", "node", "server.js"]
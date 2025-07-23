ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

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

COPY next.config.ts ./
COPY --from=base --chown=${USER}:${GROUP} /app/public ./public
COPY --from=base --chown=${USER}:${GROUP} /app/.next/static ./.next/static
COPY --from=base --chown=${USER}:${GROUP} /app/.next/standalone ./
COPY --from=base --chown=${USER}:${GROUP} /app/.next/standalone/node_modules ./node_modules

EXPOSE 3000
CMD ["dumb-init", "node", "server.js"]

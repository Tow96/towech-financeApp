ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=24.6.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY LICENSE tsconfig.json vite.config.ts ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM alpine:${ALPINE_VERSION} AS runner
WORKDIR /usr/app

ARG UID=1001
ARG USER=node
ARG GID=1001
ARG GROUP=node

# We copy the node install so we have the exact same version as the builder
COPY --from=base /usr/lib /usr/lib
COPY --from=base /usr/local/lib /usr/local/lib
COPY --from=base /usr/local/include /usr/local/include
COPY --from=base /usr/local/bin /usr/local/bin

RUN addgroup -g ${GID} ${GROUP} \
    && adduser -u ${UID} -G ${GROUP} -s /bin/sh -D ${USER} \
    && chown ${USER}:${GROUP} ./

USER ${USER}
ENV NODE_ENV=production

COPY --from=base --chown=${USER}:${GROUP} /app/.output ./.output
COPY --from=base --chown=${USER}:${GROUP} /app/LICENSE ./LICENSE
COPY --from=base --chown=${USER}:${GROUP} /app/package*.json ./

EXPOSE 3000
CMD npm start

# Entry points for debug
#ENTRYPOINT ["/bin/sh", "-c"]
#CMD ["echo 'Container started. Use docker exec to debug.' && tail -f /dev/null"]
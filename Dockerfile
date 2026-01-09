ARG ALPINE_VERSION=3.18
ARG NODE_VERSION=24.6.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS src
COPY . /app

# Build dependency fetching -----------------------------------------------------------------------
FROM src AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
    
# Runner ------------------------------------------------------------------------------------------
FROM base AS runner

COPY --from=src /app/LICENSE /app/LICENSE
COPY --from=src /app/package*.json /app
COPY --from=build /app/.output /app/.output
EXPOSE 3000

CMD ["pnpm", "run", "start"]

# # Entry point for debug without starting
# ENTRYPOINT ["/bin/sh", "-c"]
# CMD ["echo 'Container started. Use docker exec to debug.' && tail -f /dev/null"]

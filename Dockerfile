
# Base stage to install node deps

FROM --platform=linux/amd64 node:20-alpine AS base
WORKDIR /app

COPY package*.json ./

RUN npm ci

# Build stage to transpile `src` into `dist`

FROM base AS build

COPY --from=base package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN npm run build \
    && npm prune --production

# Final stage for production app image

FROM base AS production

ENV NODE_ENV="production"
ENV PORT=3000

COPY --from=build --chown=node:node package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Remove if you don't have public files
COPY --from=build --chown=node:node /app/public ./public
RUN mkdir -p /app/shared/public

EXPOSE $PORT

CMD ["node", "dist/main.js"]
# syntax=docker/dockerfile:1.4

##############################
#       BUILDER STAGE
##############################
FROM node:24-slim AS builder

RUN npm install -g pm2

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (dev needed for TS + Prisma)
RUN npm ci

# Copy source code
COPY . .

# Use BuildKit secrets WITHOUT baking into image
# Secrets are loaded into env only during this RUN step
RUN --mount=type=secret,id=envfile \
    set -a && . /run/secrets/envfile && set +a && \
    npm run prisma:generate:all && \
    npm run build


##############################
#     PRODUCTION STAGE
##############################
FROM node:24-slim AS prod

RUN npm install -g pm2

WORKDIR /usr/src/app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /usr/src/app/dist ./dist

# Runtime port (you can override with -p or env)
EXPOSE 5000

CMD ["pm2-runtime", "./dist/server.js", "--name", "shoppy-apps-backend"]

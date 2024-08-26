
ARG BASE=node:20-alpine

FROM ${BASE} AS dependencies

RUN apk update \
	&& apk add --no-cache openssl curl libc6-compat \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/*

RUN openssl version && curl --version
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --production=true --frozen-lockfile --ignore-scripts \
    && npx prisma generate \
    && node-prune \
    && cp -R node_modules prod_node_modules \
    && yarn install --production=false --prefer-offline \
    && npx prisma generate \
    && rm -rf prisma \
    && yarn cache clean

#------ target bulider

# Rebuild the source code only when needed
FROM ${BASE} AS builder
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# only for SSG pages
ARG ARG_DATABASE_URL
ENV DATABASE_URL=$ARG_DATABASE_URL

ARG ARG_AUTH_URL
ENV AUTH_URL=$ARG_AUTH_URL

# debug
RUN echo "DATABASE_URL=$DATABASE_URL"
RUN echo "AUTH_URL=$AUTH_URL"

# ENV DEBUG=*

# npx prisma migrate deploy && npx prisma db seed - not needed
# connect to existing db with data
# build reads DATABASE_URL env, and needs dev dependencies
RUN yarn build && rm -rf node_modules

#------ target production

# Production image, copy all the files and run next
FROM ${BASE} AS production
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
# use schema from container
COPY --from=builder --chown=node:node /app/prisma ./prisma

# volumes
COPY --from=builder --chown=node:node /app/uploads ./uploads

# in command in d-c.yml
RUN chmod 766 -R uploads

USER node

EXPOSE 3000
ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

# run migrate and seed here
CMD ["yarn", "start"]
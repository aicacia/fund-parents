FROM node:16-alpine as base

RUN apk add --no-cache python3 g++ make zlib-dev
RUN npm install -g npm@8.16.0

WORKDIR /app

FROM base as builder

COPY package*.json ./
RUN npm install

ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fund-parents-com
ENV DATABASE_URL=$DATABASE_URL

RUN echo "DATABASE_URL=$DATABASE_URL" >> .env

COPY . .

RUN npm run prisma generate
RUN NODE_ENV=production npm run build

FROM base

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/prisma .

RUN NODE_ENV=production npm install

COPY --from=builder /app/build .

EXPOSE 3000

CMD [ "node", "index.js" ]
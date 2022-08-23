# fund-parents

This is the main application repository for fund-parents.

## Installation

docker run --rm -d --name fund-parents-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:13-alpine

```bash
npm install
```

Setup environment

```bash
cp .env.example .env

# set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET in .env
# generate a value for JWT_SECRET_KEY, and set it in .env
npm run secret
```

Setup database

**Option 1** : docker-compose mongo backend

```bash
npm run mongo

# now sign-in with your user in the frontend
# then login to mongo and make your user a creator
mongo -u root -p password admin
> use fund-parents-app
> db.User.updateOne({username: "nathanfaucett"}, {$set: {creator: true}})

# set DATABASE_URL in .env
```

**Option 2** : set `DATABASE_URL`

If you have a local mongo db or online instance, just set `DATABASE_URL` in the .env to have the app connect to the db.

## Development

### Prisma

After any updates to the database schema in `prisma/schema.prisma` you should run `npm run prisma generate` to update the type defs.

## Deployment

```bash
export KUBECONFIG=~/my/path/to/appname-kubeconfig.yaml
NODE_ENV=production npm run helm
```

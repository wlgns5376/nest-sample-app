# Nest.js review app
## Installation

```bash
$ npm install

$ cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

### Test enviroment
```bash
$ cp .env .env.test
```

```
PORT=3000

MONGO_CONNECTION_URI=mongodb://localhost:27017/nest-test

STATIC_PATH=test/public
```

### Run

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
$ docker-compose up
```

## License

Nest is [MIT licensed](LICENSE).

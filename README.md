# Quer Apostar?

Back-end for Quer Apostar a sports betting system

## Deploy

This API is available on REnder 

[https://quer-apostar.onrender.com](https://quer-apostar.onrender.com/health)


## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example` file (see "Running application locally or inside docker section" for details)
5. Run all migrations

```bash
npm run dev:migration:run
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

## How to run tests

1. Follow the steps in the last section
2. Configure the `.env.test` file using the `.env.example` file (see "Running application locally or inside docker" section for details)
3. Run all migrations:

```bash
npm run test:migration:run
```

4. Run test:

```bash
npm run test
```

## Building and starting for production

```bash
npm run build
npm start
```

## How to run Docker Image

```bash
docker run -d --name my-container -p 4040:4000 diegobeker/querapostar
```

Check it out on localhost/4040/health

## Build docker image from this project

Clone this repository and run

```bash
docker build -t myusername/myimage:tag .
```

```bash
docker run -d --name my-container -p 4040:4000 myusername/myimage:tag
```

Check it out on localhost/4040/health

## How to run with docker-compose

Clone this repository and run

```bash
docker compose up
```

```bash
docker compose down
```
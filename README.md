# Quer Apostar?

Back-end for Quer Apostar a sports betting system

## Deploy

This API is available on REnder 

[https://quer-apostar.onrender.com](https://quer-apostar.onrender.com/health)

## Tools
<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="NodeJs" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="ExpressJs" src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
<img alt="Jest" src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

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

## Entities

### Participant 

```typescript
{
	id: number; // ex: 1
	createdAt: string; // ex: "2023-09-27T19:22:50.503Z"
	updatedAt: string; // ex: "2023-09-27T19:22:50.503Z"
	name: string; // ex: "James"
	balance: number; // balance of a participant in cents, ex: 1000 ($ 10,00)
}
```

### Game 

```typescript
{
	id: number; // game id
	createdAt: string;
	updatedAt: string;
	homeTeamName: string; // ex: "Flamengo"
	awayTeamName: string; // ex: "Fluminense"
	homeTeamScore: number; // score of Home team, ex: 3
	awayTeamScore: number; // score of away team, ex: 1
	isFinished: boolean; // true if game is finished, false if it is not finished
}
```

### Bet

```typescript
{
	id: number; // bet id
	createdAt: string;
	updatedAt: string;
	homeTeamScore: number; // bet on score of Home team, ex: 3,
	awayTeamScore: number; // bet on score of Away team, ex: 2,
	amountBet: number; // amount bet in cents
	gameId: number; // game id
	participantId: number; // participant id that made the bet
	status: string; // state of the bet, it can be PENDING (game is not finished), WON (got the final score right) ou LOST (got the final score wrong)
	amountWon: number || null; // amount won or null while the bet status is PENDING
}
```

## Endpoints 

### POST /participants

- Create a participant with an initial balance

- Request Body: name and balance

```json
{
	"name": "Diego",
	"balance": 10000, // represented in cents, must be 10000 or greater
}
```

- Response: participant created

```json
{
    "id": 65,
    "createdAt": "2023-10-08T14:38:56.720Z",
    "updatedAt": "2023-10-08T14:50:52.898Z",
    "name": "Yasmin Pereira",
    "balance": 659801
}
```

### POST /games

- Create a new game with initial score 0x0 and isFinished = false

- Request Body: home team and away team names

```json
{
	"homeTeamName": "Flamengo",
	"awayTeamName": "Fluminense"
}
```
- Response: game created

 ```json
{
    "id": 76,
    "createdAt": "2023-10-08T22:28:03.779Z",
    "updatedAt": "2023-10-08T22:28:03.779Z",
    "homeTeamName": "Flamengo",
    "awayTeamName": "Fluminense",
    "homeTeamScore": 0,
    "awayTeamScore": 0,
    "isFinished": false
}
```

### POST /bets

- Create a bet that belong to a participant in a specific game

- Request Body: home team and away team names

```json
{ 
	"homeTeamScore": 3,
	"awayTeamScore": 2, 
	"amountBet": 1000,
	"gameId": 75,
	"participantId": 67
}
```

- Response: bet created

 ```json
{
    "id": 32,
    "createdAt": "2023-10-08T22:57:34.602Z",
    "updatedAt": "2023-10-08T22:57:34.602Z",
    "homeTeamScore": 3,
    "awayTeamScore": 2,
    "amountBet": 1000,
    "gameId": 76,
    "participantId": 67,
    "status": "PENDING",
    "amountWon": null
}
```

### POST /games/:id/finish

- Finish a game and update all bets that belong to that game, also update the balance of participants.

- Request Body: home team and away team names

```json
{
	"homeTeamScore": 3,
	"awayTeamScore": 2
}
```

- Response: game finished

 ```json
{
    "id": 76,
    "createdAt": "2023-10-08T22:28:03.779Z",
    "updatedAt": "2023-10-08T23:00:11.027Z",
    "homeTeamName": "Flamengo",
    "awayTeamName": "Fluminense",
    "homeTeamScore": 3,
    "awayTeamScore": 2,
    "isFinished": true
}
```

### GET /participants

- Return all participants with current balance

- Response: all participants

 ```json
[   
    {
        "id": 66,
        "createdAt": "2023-10-08T14:38:57.030Z",
        "updatedAt": "2023-10-08T14:38:57.030Z",
        "name": "Lorena Xavier",
        "balance": 229050
    },
    {
        "id": 67,
        "createdAt": "2023-10-08T14:49:40.128Z",
        "updatedAt": "2023-10-08T22:57:34.555Z",
        "name": "Jose",
        "balance": 11500
    }
]
```

### GET /games

- Return all games

 ```json
[
    {
        "id": 75,
        "createdAt": "2023-10-08T14:49:56.005Z",
        "updatedAt": "2023-10-08T14:51:49.718Z",
        "homeTeamName": "Flamengo",
        "awayTeamName": "Fluminense",
        "homeTeamScore": 3,
        "awayTeamScore": 2,
        "isFinished": true
    },
    {
        "id": 76,
        "createdAt": "2023-10-08T22:28:03.779Z",
        "updatedAt": "2023-10-08T23:00:11.027Z",
        "homeTeamName": "Corinthians",
        "awayTeamName": "Palmeiras",
        "homeTeamScore": 0,
        "awayTeamScore": 0,
        "isFinished": false
    }
]
```

### GET /games/:id

- Return a specifc game with all bets of that game

```json
{
    "id": 76,
    "createdAt": "2023-10-08T22:28:03.779Z",
    "updatedAt": "2023-10-08T23:00:11.027Z",
    "homeTeamName": "Flamengo",
    "awayTeamName": "Fluminense",
    "homeTeamScore": 3,
    "awayTeamScore": 2,
    "isFinished": true,
    "Bet": [
        {
            "id": 32,
            "createdAt": "2023-10-08T22:57:34.602Z",
            "updatedAt": "2023-10-08T22:57:34.602Z",
            "homeTeamScore": 3,
            "awayTeamScore": 2,
            "amountBet": 1000,
            "gameId": 76,
            "participantId": 67,
            "status": "WON",
            "amountWon": 700
        }
    ]
}
```
# Starton Coding Challenge

<p align="center">
  <a href="https://www.starton.io/" target="blank"><img src="https://www.starton.io/favicon.ico" width="120" alt="Starton Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Objective

Create an application that retrieves real-time transactions on the Polygon Mainnet blockchain and saves them to a database.

## Problems

- The application must handle soft forks and mark the forked blocks in the database as FORKED.

  WARNING: One fork can hide another.

- The application must be replicable on multiple servers without retrieving duplicate blocks.

## Tech stack

- NestJS, NodeJS, Typescript
- PostgreSQL, MikroORM, pgAdmin
- EthersJS - Alchemy
- CacheManager, Redis
- Docker
- WebSocket
- Jest

## Solutions

The solution I developed for this technical test involved creating a NestJS project using TypeScript and setting up a PostgreSQL database with Docker-compose. I then connected the application to the Alchemy RPC endpoint using WebSockets for real-time block updates. I stored blocks in the database and visualized them using pgAdmin. To handle forks and forks of forks, I compared the parentHash of each block to its previous block. To make the server replicable and avoid storing blocks twice, I used Redis caching along with the NestJS CacheManager.

I chose WebSockets over Cron jobs for their efficiency and real-time updates, despite their increased complexity. This choice resulted in a more responsive and faster application, without the need for constant polling.

## Possible improvements

- Incorporating a queue manager system like RabbitMQ can further enhance server replicability and scalability by efficiently distributing and processing tasks across multiple instances, ensuring seamless load distribution, and providing a robust messaging system for better fault tolerance and reliability.
- Addressing synchronization, load balancing, scalability, and fault tolerance when replicating the application across multiple servers will ensure its success. This includes using Redis clustering for horizontal scaling and high availability, monitoring database performance, and implementing health checks to detect and recover from issues gracefully.
- Implementing a more efficient fork detection mechanism that not only identifies forks but also detects forks of forks by finding common ancestor blocks, traversing both chains, and comparing block hashes. This could involve optimizing the process through caching block hashes or utilizing an efficient data structure to expedite the search for matching hashes, ultimately reducing resource consumption for longer chains.

## Prerequisites

- Git
- NodeJS
- Docker

## Project Setup

- Clone the project

```bash
    $ git clone https://github.com/fbenfraj/starton-challenge.git
```

- Create a `.env` at the root of the folder and enter the following variables (replace the Alchemy API key with yours):

```bash
    ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    POSTGRES_DB=mydb
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    PGADMIN_DEFAULT_EMAIL=admin@example.com
    PGADMIN_DEFAULT_PASSWORD=root
```

## Installation

```bash
    $ npm install
```

## Running the app

```bash
    $ docker-compose up -d
    $ npm start
```

## Viewing data on pgAdmin

- Make sure the Docker container is running (see Running the app above)
- Go to `http://localhost:5050/`
- Log in with the credentials you setup in the `.env` file (`PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD`)
- Once on the dashboard, click on "Add New Server"

  - Name: my-postgres
  - Connection tab > Host name: my-postgres
  - Username: $POSTGRES_USER
  - Password: $POSTGRES_PASSWORD

- Click on Save
- On the left pannel, navigate to my-postgres > mydb > Schemas > public > Tables
- Right click on the "block" table > View/Edit Data > All rows

## Test

```bash
$ npm run test
```

## Stay in touch

- Author - [Ben Fraj Farouk](https://www.linkedin.com/in/farouk-benfraj/)

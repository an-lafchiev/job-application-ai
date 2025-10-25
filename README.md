## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker and Docker Compose
- Git
- Node.js (v14 or later)
- Yarn

## Getting Started

1. If you haven't already, clone your repository:

   ```
   git clone https://github.com/<your-username>/<your-new-repo-name>.git
   cd <your-new-repo-name>
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```
   POSTGRES_PASSWORD=your_postgres_password
   DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@localhost:5432/postgres


   PORT=3000
   NODE_ENV=development

   JWT_SECRET=your-secret
   JWT_EXPIRES_IN=7d

   BCRYPT_SALT_ROUNDS=12

   PORT=3000
   NODE_ENV=development

   WEBHOOK_SECRET = your-webhook-secret
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5432

   LOG_LEVEL=info

   ```

```

4. Start the PostgreSQL database using Docker:
```

docker-compose up -d db

```

5. Run database migrations and generate Prisma client:
```

yarn prisma:migrate:deploy

```

6. Start the development server:
```

yarn dev

```

The application should now be running at `http://localhost:3000`. You can verify this by accessing the hello world
endpoint at `http://localhost:3000/api/hello`.


## Available Scripts

- `yarn start`: Run the production build
- `yarn dev`: Start the development server with hot-reloading
- `yarn build`: Build the project using Webpack
- `yarn build:start`: Build and start the Docker containers
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run Prisma migrations in development (also generates the client)
- `yarn prisma:migrate:deploy`: Run Prisma migrations in production (also generates the client)
- `yarn prisma:studio`: Open Prisma Studio for database management

## API Endpoints

1. Hello World
    - **URL:** `/api/hello`
    - **Method:** GET
    - **Response:** Returns a simple string

2. Webhook
    - **URL:** `/api/webhook/receive-application`
    - **Method:** POST
    - **Response:** Returns a created conversation

3. Auth
    - **URL:** `/api/auth/register`
    - **Method:** POST
    - **Response:** Returns a user and a token

    - **URL:** `/api/auth/login`
    - **Method:** POST
    - **Response:** Returns a token

4. Conversation (Protected routes)
    - **URL:** `/api/conversations`
    - **Method:** GET
    - **Response:** Returns conversation, can be filtered by stataus

    - **URL:** `/api/conversations/:id`
    - **Method:** GET
    - **Response:** Returns a single conversation


## Database Schema

The project uses Prisma ORM with a PostgreSQL database. Here's an overview of the main models:

### Conversation

- Fields: `id`, `candidateId`, `jobId`, `status`, `createdAt`, `updatedAt`
- Status can be: `CREATED`, `ONGOING`, `COMPLETED`
- Unique constraint on `candidateId` and `jobId` combination

### Candidate

- Fields: `id`, `phoneNumber`, `firstName`, `lastName`, `emailAddress`
- Has a one-to-many relationship with `Conversation`

For the full schema details, refer to the `prisma/schema.prisma` file in the project.

```

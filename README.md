# Development Setup

## 1. Install Dependencies

Install Node.js dependencies on your host machine:

```sh
npm install
```

## 2. Start Docker Services

Start App, PostgreSQL and Adminer services:

```sh
docker compose up -d
```

## 3. Generate Prisma Client

Generate the Prisma client inside the container:

```sh
docker compose exec app npx prisma generate
```

## 4. Prepare Environment Variables

- Copy `.env.example` to `.env`.
- Fill in the required variables in `.env`.

## 5. Get Auth Secret

- Exec into the app service:
  ```sh
  docker compose exec app sh
  ```
- Run the following command to get the auth secret:
  ```sh
  npx auth secret --raw
  ```
- Use the output as your auth token.

## 6. Setup Database

```sh
docker compose exec app npx prisma db push
```

## 7. Seed Database (For default categories)

Populate the database with initial data:

```sh
docker compose exec app npx prisma db seed
```

## Development Approach

This project uses a simplified Docker + host development setup:

### Why This Setup?

- **Docker**: Provides PostgreSQL database and consistent runtime environment
- **Host**: Manages all dependencies and generated files for optimal IDE support

### How It Works

The `docker-compose.yaml` simply mounts your source code:

```yaml
volumes:
  - .:/app # Sync source code and dependencies
```

### Benefits

This gives you:

- ✅ Full TypeScript IntelliSense and autocompletion
- ✅ Working ESLint and Prettier integration
- ✅ Fast dependency installation and updates
- ✅ Consistent Docker runtime environment
- ✅ Simplified development workflow

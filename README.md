# Development Setup

## 1. Start Docker Compose

```sh
docker compose up
```

## 2. Prepare Environment Variables

- Copy `.env.example` to `.env`.
- Fill in the required variables in `.env`.

## 3. Get Auth Secret

- Exec into the app service:
  ```sh
  docker compose exec app sh
  ```
- Run the following command to get the auth secret:
  ```sh
  npx auth secret --raw
  ```
- Use the output as your auth token.

## 4. Push the db

```sh
docker compose exec app npx prisma db push
```

FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* tsconfig.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "app.ts"]

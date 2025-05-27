# 🧾 Dynadok API

API RESTful para cadastro, consulta e atualização de clientes, com mensageria e cache, construída com Node.js, TypeScript e princípios de Clean Architecture.

---

## Tecnologias utilizadas

- **Node.js** + **Express** – Backend da aplicação
- **TypeScript** – Tipagem estática
- **MongoDB** – Banco de dados NoSQL
- **Mongoose** – ODM para MongoDB
- **Redis** – Cache de alto desempenho
- **RabbitMQ** – Mensageria com filas e DLQ
- **Jest** – Testes unitários
- **Docker + Docker Compose** – Contêineres e orquestração
- **Mongo Express** – Interface gráfica do MongoDB

---

## ▶️ Como rodar com Docker

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone o projeto

```bash
git clone https://github.com/rodrigomf22/dynadok.git
cd dynadok
```

### 2. Suba os serviços com Docker Compose

```bash
docker compose -f docker/docker-compose.yml -p dynadok up -d --build
```

Esse comando irá:

✅ Buildar a imagem da aplicação  
✅ Subir os containers da API, MongoDB, Redis, RabbitMQ e Mongo Express

---

## 🛠 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
PORT=3000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/dynadok?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672
```

Esses valores já estão configurados no `docker-compose.yml`.

---

## 🧪 Testes

### Localmente

```bash
npm install
npm run test
```

### Usando container

```bash
docker exec -it dynadok-api npm run test
```

Os testes cobrem:

- Casos de uso (use cases)
- Repositórios
- Regras de negócio

---

## 🔗 Acessos

| Serviço          | URL                        | Credenciais       |
|------------------|----------------------------|-------------------|
| API              | http://localhost:3000/api  | -                 |
| Health Check     | http://localhost:3000/health | -               |
| Mongo Express    | http://localhost:8081       | admin / pass     |
| RabbitMQ Console | http://localhost:15672      | admin / admin123 |

---

## Comandos úteis

### Subir os containers

```bash
docker compose -f docker/docker-compose.yml -p dynadok up -d
```

### Parar os containers

```bash
docker compose -f docker/docker-compose.yml -p dynadok down
```

### Rebuildar a imagem

```bash
docker compose -f docker/docker-compose.yml -p dynadok up -d --build
```

---

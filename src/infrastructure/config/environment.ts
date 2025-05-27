import dotenv from 'dotenv';
dotenv.config();

export const environment = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cliente_db',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT || 6379),
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
};

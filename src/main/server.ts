import 'reflect-metadata';
import './container';
import app from './app';
import dotenv from 'dotenv';
import { connectToDatabase } from '../infrastructure/config/database';
import { connectToRedis } from '../infrastructure/database/redis/connection';
import { connectToRabbitMQ } from '../infrastructure/messaging/rabbitmq/connection';
import { setupRabbitMQ } from '../infrastructure/messaging/rabbitmq/setup';
import { startClienteCadastradoConsumer } from '../infrastructure/messaging/rabbitmq/consumers/ClienteCadastradoConsumer';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectToDatabase();
    await connectToRedis();
    await connectToRabbitMQ();
    await setupRabbitMQ();
    await startClienteCadastradoConsumer();
    app.listen(PORT, () => {
      console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

start();

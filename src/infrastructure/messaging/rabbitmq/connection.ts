import amqp from 'amqplib';
import { environment } from '../../config/environment';

let channel: amqp.Channel;

export async function connectToRabbitMQ(): Promise<amqp.Channel> {
  const connection = await amqp.connect(environment.rabbitmqUrl);
  channel = await connection.createChannel();
  console.log('[RabbitMQ] Conectado e canal criado!');
  return channel;
}

export function getRabbitMQChannel(): amqp.Channel {
  if (!channel) {
    throw new Error('RabbitMQ não conectado. Execute connectToRabbitMQ() antes.');
  }
  return channel;
}

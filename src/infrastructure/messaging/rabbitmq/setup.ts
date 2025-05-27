import { getRabbitMQChannel } from "./connection";

export async function setupRabbitMQ(): Promise<void> {
  const channel = getRabbitMQChannel();

  const exchange = 'cliente_events';
  const mainQueue = 'cliente.cadastrado';
  const dlqQueue = 'cliente.cadastrado.dlq';
  const routingKey = 'cliente.cadastrado';

  try {
    await channel.deleteQueue(mainQueue);
    await channel.deleteQueue(dlqQueue);
    console.log('[RabbitMQ] Filas antigas removidas');
  } catch (_) {
    console.warn('[RabbitMQ] Nenhuma fila antiga encontrada para remover');
  }

  await channel.assertQueue(dlqQueue, {
    durable: true
  });

  await channel.assertQueue(mainQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': '',
      'x-dead-letter-routing-key': dlqQueue
    }
  });

  await channel.assertExchange(exchange, 'topic', { durable: true });

  await channel.bindQueue(mainQueue, exchange, routingKey);

  console.log('[RabbitMQ] Exchange, fila principal e DLQ configuradas com sucesso');
}

import { getRabbitMQChannel } from './connection';
import { IMessageQueue } from '../../../application/ports/IMessageQueue';

export class RabbitMQService implements IMessageQueue {
  async publish(exchange: string, routingKey: string, payload: unknown): Promise<void> {
    const channel = getRabbitMQChannel();
    const buffer = Buffer.from(JSON.stringify(payload));

    channel.publish(exchange, routingKey, buffer, {
      persistent: true,
      contentType: 'application/json'
    });
  }
}

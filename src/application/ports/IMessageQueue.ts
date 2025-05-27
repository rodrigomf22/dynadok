export interface IMessageQueue {
    publish(exchange: string, routingKey: string, payload: unknown): Promise<void>;
  }
  
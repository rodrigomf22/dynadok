import { createClient } from 'redis';
import { environment } from '../../config/environment';

export const redisClient = createClient({
  socket: {
    host: environment.redisHost,
    port: environment.redisPort
  }
});

export async function connectToRedis(): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('[Redis] Conectado com sucesso!');
    }
  } catch (error) {
    console.error('[Redis] Erro na conexão:', error);
    throw error;
  }
}

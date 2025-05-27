import mongoose from 'mongoose';
import { environment } from './environment';

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(environment.mongoUri);
    console.log('[MongoDB] Conectado com sucesso!');
  } catch (error) {
    console.error('[MongoDB] Erro na conexão:', error);
    process.exit(1);
  }
}

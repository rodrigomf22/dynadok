import { getRabbitMQChannel } from '../connection';
import { container } from 'tsyringe';
import { SalvarLogDeClienteUseCase } from '../../../../domain/usecases/logs/SalvarLogDeClienteUseCase';
import { ClienteLog } from '../../../../domain/entities/ClienteLog';

export async function startClienteCadastradoConsumer(): Promise<void> {
  const channel = getRabbitMQChannel();
  const queue = 'cliente.cadastrado';

  channel.consume(queue, async (msg) => {
    if (!msg) return;
  
    try {
      const data = JSON.parse(msg.content.toString());
      console.log('[Consumer] Mensagem recebida:', data);
  
      const useCase = container.resolve(SalvarLogDeClienteUseCase);
      const log = new ClienteLog(data.event, data.email, new Date(data.createdAt));
      await useCase.execute(log);
  
      channel.ack(msg);
    } catch (err) {
      console.error('[Consumer] Erro ao processar mensagem:', err);
      channel.nack(msg, false, false);
    }
  });
  

  console.log(`[Consumer] Aguardando mensagens na fila ${queue}...`);
}

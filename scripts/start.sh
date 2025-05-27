#!/bin/bash

# Script para inicializar a aplicação com Docker

set -e

echo "Iniciando Cliente API..."

API_HEALTH_URL="http://localhost:3000/health"

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "Erro: Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "Erro: Docker Compose não encontrado. Por favor, instale o Docker Compose."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
fi

# Parar containers existentes (se houver)
echo "Parando containers existentes..."
docker-compose down

# Remover volumes órfãos (opcional)
read -p "Deseja limpar volumes existentes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    docker volume prune -f
fi

# Build e start dos serviços
echo "Construindo a aplicação..."
docker-compose build --no-cache

echo "Iniciando os serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
echo "Aguardando os serviços ficarem prontos..."
sleep 30

# Verificar status dos serviços
echo "Status dos serviços:"
docker-compose ps

# Verificar saúde da aplicação
echo "Verificando saúde da aplicação..."
for i in {1..10}; do
    if curl -f $API_HEALTH_URL > /dev/null 2>&1; then
        echo "Aplicação está saudável!"
        break
    else
        echo "Tentativa $i/10 - Aguardando aplicação ficar pronta..."
        sleep 10
    fi
done

echo
echo "Cliente API iniciada com sucesso!"
echo
echo "Serviços disponíveis:"
echo "   - API Principal: http://localhost:3000"
echo "   - Documentação Swagger: http://localhost:3000/api-docs"
echo "   - MongoDB Express: http://localhost:8081"
echo "   - Redis Commander: http://localhost:8082"
echo "   - RabbitMQ Management: http://localhost:15672"
echo
echo "Comandos úteis:"
echo "   - Ver logs: docker-compose logs -f app"
echo "   - Parar tudo: docker-compose down"
echo "   - Ver status: docker-compose ps"
echo

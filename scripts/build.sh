#!/bin/bash

# Script para build da aplicação Cliente API

set -e

echo "Iniciando build da Cliente API..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Erro: npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

# Verificar se existe package.json
if [ ! -f package.json ]; then
    echo "Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Limpar build anterior
echo "Limpando diretórios de build anteriores..."
rm -rf dist/ build/ coverage/

# Instalar dependências
echo "Instalando dependências..."
npm ci

# Verificar se TypeScript está disponível
if ! command -v npx tsc &> /dev/null; then
    echo "Instalando TypeScript..."
    npm install -g typescript
fi

# Executar linter se estiver configurado
if npm list eslint &> /dev/null; then
    echo "Executando linter..."
    npm run lint || {
        echo "Avisos do linter encontrados, continuando o build..."
    }
fi

# Executar testes
echo "Executando testes unitários..."
npm test || {
    echo "Alguns testes falharam."
    read -p "Deseja continuar o build mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

# Compilar TypeScript
echo "Compilando TypeScript..."
npm run build || {
    echo "Erro na compilação TypeScript!"
    exit 1
}

# Verificar se o diretório dist foi criado
if [ ! -d "dist" ]; then
    echo "Erro: diretório dist não foi criado!"
    exit 1
fi

# Gerar documentação se typedoc estiver presente
if npm list typedoc &> /dev/null; then
    echo "Gerando documentação..."
    npm run docs || true
fi

# Opcional: build da imagem Docker
read -p "Deseja gerar imagem Docker? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v docker &> /dev/null; then
        echo "Gerando imagem Docker..."
        docker build -f docker/Dockerfile -t cliente-api:latest . || {
            echo "Erro ao gerar imagem Docker!"
            exit 1
        }
        echo "Imagem Docker criada: cliente-api:latest"
    else
        echo "Erro: Docker não encontrado!"
    fi
fi

# Verificar tamanho do build
BUILD_SIZE=$(du -sh dist/ | cut -f1)
echo "Tamanho do build: $BUILD_SIZE"

# Verificar arquivos essenciais
echo "Verificando arquivos essenciais..."
ESSENTIAL_FILES=(
    "dist/main/server.js"
    "dist/main/app.js"
    "package.json"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  OK: $file"
    else
        echo "  FALTA: $file"
        exit 1
    fi
done

# Criar build-info.json
echo "Gerando build-info.json..."
cat > dist/build-info.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "buildSize": "$BUILD_SIZE"
}
EOF

# Criar script de healthcheck
echo "Gerando healthcheck.js..."
cat > dist/healthcheck.js << 'EOF'
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
EOF

# Criar script de inicialização
echo "Gerando start.js..."
cat > dist/start.js << 'EOF'
const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando Cliente API...');

const requiredEnvVars = ['MONGODB_URI', 'REDIS_HOST', 'RABBITMQ_URL'];
const missingVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingVars.length > 0) {
  console.error('Variáveis de ambiente obrigatórias ausentes:', missingVars.join(', '));
  process.exit(1);
}

const serverPath = path.join(__dirname, 'main', 'server.js');
const child = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  console.log(`Aplicação finalizada com código: ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  console.log('Finalizando aplicação (SIGTERM)...');
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Finalizando aplicação (SIGINT)...');
  child.kill('SIGINT');
});
EOF

# Final
echo
echo "Build concluído com sucesso."
echo
echo "Resumo do build:"
echo "  - Tamanho: $BUILD_SIZE"
echo "  - Diretório: ./dist/"
echo "  - Arquivo principal: ./dist/main/server.js"
echo "  - Script de início: ./dist/start.js"
echo "  - Healthcheck: ./dist/healthcheck.js"
echo
echo "Comandos úteis:"
echo "  - Desenvolvimento: npm run dev"
echo "  - Produção: node dist/start.js"
echo "  - Docker: docker run cliente-api:latest"
echo

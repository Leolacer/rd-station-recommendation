#!/bin/bash

echo "🚀 Configurando Sistema de Recomendação RD Station..."
echo "=================================================="

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js versão 18.3 ou superior."
    echo "📖 Visite: https://nodejs.org/"
    exit 1
fi

# Verifica a versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.3.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js versão $NODE_VERSION detectada. Versão 18.3 ou superior é necessária."
    echo "📖 Atualize o Node.js em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detectado"

# Verifica se o Yarn está instalado
if ! command -v yarn &> /dev/null; then
    echo "⚠️  Yarn não está instalado. Instalando..."
    npm install -g yarn
fi

echo "✅ Yarn instalado"

# Instala dependências
echo "📦 Instalando dependências..."
yarn install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Cria diretório de testes se não existir
mkdir -p src/__tests__

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo "=================================================="
echo ""
echo "📋 Para executar a aplicação:"
echo "   yarn start          # Frontend + Backend"
echo "   yarn start:frontend # Apenas Frontend"
echo "   yarn start:backend  # Apenas Backend"
echo "   yarn dev            # Modo desenvolvimento"
echo ""
echo "🧪 Para executar os testes:"
echo "   yarn test           # Executa todos os testes"
echo "   yarn test --watch   # Modo watch"
echo "   yarn test --coverage # Com cobertura"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "🚀 Boa sorte no processo seletivo da RD Station!"

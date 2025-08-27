# 🚀 Sistema de Recomendação de Produtos - RD Station

## 📋 Descrição

Este projeto implementa um sistema de recomendação de produtos para a RD Station, desenvolvido como parte do processo seletivo para desenvolvedor front-end. A aplicação permite aos usuários configurar preferências e receber recomendações personalizadas de produtos.

## 🎯 Funcionalidades

- **Formulário de Preferências**: Interface intuitiva para configurar critérios de recomendação
- **Sistema de Pontuação**: Algoritmo inteligente que calcula relevância dos produtos
- **Modos de Recomendação**: Produto único ou múltiplos produtos
- **Filtros Avançados**: Categoria, nível de experiência, orçamento, tags e faixa de preço
- **Estatísticas**: Resumo detalhado das recomendações geradas
- **Interface Responsiva**: Design moderno com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js 18.2.0
- **Estilização**: Tailwind CSS 3.3.0
- **Backend**: json-server (simulação de API REST)
- **Testes**: Jest + React Testing Library
- **Node.js**: Versão 18.3 ou superior

## 📋 Pré-requisitos

- Node.js versão 18.3 ou superior
- Yarn ou npm
- Git

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd entrevista-rd
```

### 2. Instale as dependências
```bash
yarn install
# ou
npm install
```

### 3. Execute a aplicação
```bash
# Inicia frontend e backend simultaneamente
yarn start

# Ou execute separadamente:
e a
yarn dev               # Frontend e backend simultaneamente
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🧪 Executando os Testes

```bash
# Executa todos os testes
yarn test

# Executa testes em modo watch
yarn test --watch

# Executa testes com coverage
yarn test --coverage
```

## 📁 Estrutura do Projeto

```
entrevista-rd/
├── public/
│   └── index.html
├── src/
│   ├── __tests__/
│   │   ├── App.test.js
│   │   ├── Form.test.js
│   │   └── recommendation.service.test.js
│   ├── App.js                 # Componente principal
│   ├── Form.js                # Formulário de preferências
│   ├── recommendation.service.js # Lógica de recomendação
│   ├── App.css
│   ├── index.css
│   └── index.js
├── db.json                    # Banco de dados JSON
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Arquivos Principais

### `App.js`
- Componente principal da aplicação
- Gerencia estado das recomendações
- Integra todos os componentes
- Atualiza lista de recomendações

### `Form.js`
- Formulário para capturar preferências do usuário
- Validação de entrada
- Processamento de dados antes do envio

### `recommendation.service.js`
- Lógica de negócios para recomendação
- Algoritmo de pontuação de produtos
- Filtros e ordenação
- Estatísticas das recomendações

## 🎯 Algoritmo de Recomendação

O sistema utiliza um algoritmo de pontuação baseado em múltiplos critérios:

- **Categoria**: 10 pontos por correspondência exata
- **Tags**: 5 pontos por tag correspondente
- **Faixa de Preço**: 8 pontos por estar na faixa, 4 pontos por estar próximo
- **Nível de Experiência**: 6 pontos por compatibilidade
- **Orçamento**: 3 pontos por estar dentro do limite

### Tratamento de Empates
Em caso de empate na pontuação, o sistema mantém a ordem original dos produtos, retornando o último produto válido conforme especificado nos requisitos.

## 📊 Casos de Uso Implementados

✅ **Modo SingleProduct**: Retorna um produto recomendado  
✅ **Modo MultipleProducts**: Retorna lista de produtos  
✅ **Filtros por categoria**: Marketing, Vendas, Analytics, CRM, SEO, Social, Ads  
✅ **Filtros por nível**: Iniciante, Intermediário, Avançado  
✅ **Filtros por orçamento**: Limite máximo de gasto  
✅ **Filtros por faixa de preço**: Intervalo personalizado  
✅ **Seleção de tags**: Múltiplas tags de interesse  
✅ **Tratamento de empates**: Ordem original mantida  
✅ **Estatísticas**: Resumo das recomendações  
✅ **Validações**: Entrada de dados segura  

## 🎨 Design e UX

- **Interface Responsiva**: Adaptável a diferentes tamanhos de tela
- **Design System**: Cores e componentes consistentes com a marca RD Station
- **Feedback Visual**: Estados de loading, erro e sucesso
- **Acessibilidade**: Navegação por teclado e leitores de tela
- **Animações**: Transições suaves e feedback visual

## 🔍 Testes

O projeto inclui testes unitários abrangentes:

- **RecommendationService**: Testa toda a lógica de negócios
- **Form Component**: Valida comportamento do formulário
- **App Component**: Testa integração e renderização

### Cobertura de Testes
- Lógica de pontuação
- Filtros de produtos
- Validações de formulário
- Estados de loading e erro
- Renderização de componentes

## 🚀 Scripts Disponíveis

```json
{
  "start": "Inicia frontend e backend simultaneamente",
  "start:frontend": "Inicia apenas o frontend (porta 3000)",
  "start:backend": "Inicia apenas o backend (porta 3001)",
  "dev": "Inicia frontend e backend simultaneamente",
  "build": "Build de produção",
  "test": "Executa testes unitários"
}
```

## 🌐 API Endpoints

### GET `/products`
Retorna lista de todos os produtos disponíveis.

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Marketing Digital Básico",
    "category": "marketing",
    "price": 99.00,
    "tags": ["iniciante", "marketing", "digital"],
    "description": "Curso introdutório de marketing digital"
  }
]
```

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente
- `PORT`: Porta do frontend (padrão: 3000)
- `REACT_APP_API_URL`: URL da API (padrão: http://localhost:3001)

### Banco de Dados
O projeto utiliza `db.json` como banco de dados simulado. Os dados incluem:
- 8 produtos de diferentes categorias
- Tags para classificação
- Preços em Real (BRL)
- Descrições detalhadas

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop**: Layout em grid com sidebar
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Layout em coluna única

## 🎯 Melhorias Implementadas

- **Sistema de Pontuação Inteligente**: Algoritmo que considera múltiplos fatores
- **Validações Robustas**: Verificação de entrada de dados
- **Tratamento de Erros**: Mensagens claras para o usuário
- **Performance**: Filtros otimizados e lazy loading
- **Testes Abrangentes**: Cobertura completa da funcionalidade

## 🤝 Contribuição

Este projeto foi desenvolvido como parte do processo seletivo da RD Station. Para contribuições futuras:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para o processo seletivo da RD Station.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para o processo seletivo de **Pessoa Desenvolvedora Júnior/Pleno** na **RD Station**.

---

**RD Station** - Transformando o marketing digital das empresas brasileiras 🚀

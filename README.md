📅 Sistema Completo de Agendamento Online
Sistema completo de agendamento online, desenvolvido com React, TypeScript e Tailwind CSS no frontend, e Node.js com Express no backend.

O projeto conta com integração com MySQL para persistência de dados e oferece uma solução eficiente para agendamento de serviços, como barbearias, salões, consultórios, clínicas e outros.

🚀 Tecnologias Utilizadas
🖥️ Frontend
React 19

TypeScript

Vite – Build e Dev Server ultrarrápido

Tailwind CSS – Estilização moderna e eficiente

React Router DOM – Navegação de rotas

Lucide React – Ícones

React Datepicker – Seleção de datas

Axios – Requisições HTTP

🔗 Backend
Node.js

Express

MySQL2 – Banco de dados relacional

Nodemailer – Envio de e-mails automáticos

Body-parser – Manipulação de requisições

CORS – Permitir requisições externas

🛠️ Ferramentas e Dependências Extras
dotenv – Gerenciamento de variáveis de ambiente

bcrypt / bcryptjs – Criptografia e hash de senhas

Nodemon – Hot reload para desenvolvimento

ESLint + TypeScript ESLint – Padronização e qualidade de código

Simultaneamente – Executar frontend e backend juntos no desenvolvimento

📦 Funcionalidades
✅ Cadastro de clientes

✅ Seleção de datas e horários disponíveis

✅ Painel administrativo para gerenciamento de agendamentos

✅ Envio de confirmação por e-mail

✅ Validação de horários e conflitos

✅ Integração total com banco de dados MySQL

✅ Interface responsiva, rápida e intuitiva

🔧 Como Executar o Projeto
1️⃣ Clone o repositório

bash
Copiar
Editar
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
2️⃣ Instale as dependências

bash
Copiar
Editar
npm install
cd backend
npm install
3️⃣ Configure o Banco de Dados

Crie um banco de dados MySQL

Crie um arquivo .env dentro da pasta /backend com as variáveis:

env
Copiar
Editar
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco

EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
4️⃣ Execute o Projeto

bash
Copiar
Editar
npm run dev
Isso irá iniciar tanto o backend quanto o frontend simultaneamente.

🌐 Acesso
Frontend: http://localhost:5173

Backend: http://localhost:3001

📜 Licença
Este projeto está sob a licença ISC.

React + TypeScript + Vite + ESLint
Este modelo fornece uma configuração mínima para que o React funcione no Vite com HMR e algumas regras ESLint.

Atualmente, dois plugins oficiais estão disponíveis para React no Vite:

@vitejs/plugin-react — usa Babel para atualização rápida

@vitejs/plugin-react-swc — usa SWC para atualização rápida

Expandindo a configuração do ESLint
Se estiver desenvolvendo um aplicativo de produção, recomendamos habilitar regras de lint com reconhecimento de tipo, para maior rigor e qualidade.

Exemplo de configuração usando tseslint.config:

ts
Copiar
Editar
export default tseslint.config({
  extends: [
    // Remova ...tseslint.configs.recommended e substitua por:
    ...tseslint.configs.recommendedTypeChecked,
    // Alternativamente, para regras mais estritas:
    ...tseslint.configs.strictTypeChecked,
    // Opcional: para regras estilísticas:
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
ESLint Plugins específicos para React
Para regras específicas do React, instale e configure os plugins eslint-plugin-react-x e eslint-plugin-react-dom.

Exemplo de configuração (eslint.config.js):

ts
Copiar
Editar
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Adiciona os plugins react-x e react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // Outras regras...
    // Habilita regras recomendadas para TypeScript do react-x
    ...reactX.configs['recommended-typescript'].rules,
    // Habilita regras recomendadas do react-dom
    ...reactDom.configs.recommended.rules,
  },
})

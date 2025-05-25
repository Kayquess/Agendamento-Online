📅 Agendamento Online
Sistema completo de Agendamento Online, desenvolvido com React, TypeScript, Tailwind CSS no frontend e Node.js com Express no backend, além de integração com MySQL para persistência de dados.

Este projeto foi desenvolvido com o objetivo de fornecer uma plataforma eficiente e intuitiva para agendamento de serviços, como barbearias, salões, consultórios, entre outros.

🚀 Tecnologias Utilizadas
🖥️ Frontend
React 19

TypeScript

Vite (Build e Dev Server ultrarrápido)

Tailwind CSS (Estilização)

React Router DOM (Navegação de rotas)

Lucide React (Ícones)

React Datepicker (Seleção de datas)

Axios (Requisições HTTP)

🔗 Backend
Node.js

Express

MySQL2 (Banco de dados relacional)

Nodemailer (Envio de emails)

Body-parser

CORS

🛠️ Ferramentas e Dependências Extras
dotenv (Gerenciamento de variáveis de ambiente)

bcrypt / bcryptjs (Hash de senhas)

Nodemon (Desenvolvimento com hot reload)

ESLint + TypeScript ESLint (Padronização e qualidade de código)

Concurrently (Rodar frontend e backend juntos no modo desenvolvimento)

📦 Funcionalidades
Cadastro de clientes.

Seleção de datas e horários disponíveis.

Painel administrativo para gerenciar agendamentos.

Envio de confirmação por email.

Validação de horários e conflitos.

Integração total com banco de dados MySQL.

Interface responsiva, rápida e intuitiva.

🔧 Como executar o projeto
1. Clone o repositório:
bash
Copiar
Editar
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
2. Instale as dependências:
bash
Copiar
Editar
npm install
cd backend
npm install
3. Configure o banco de dados:
Crie um banco de dados MySQL.

Crie um arquivo .env na pasta /backend com as seguintes variáveis:

env
Copiar
Editar
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
4. Rode o projeto:
bash
Copiar
Editar
npm run dev
Isso irá iniciar tanto o backend quanto o frontend simultaneamente.

🌐 Acesso
Frontend rodando em: http://localhost:5173

Backend rodando em: http://localhost:3001



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

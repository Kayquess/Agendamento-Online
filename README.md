# 📅 Sistema Completo de Agendamento Online

Sistema de agendamento online desenvolvido com **React**, **TypeScript** e **Tailwind CSS** no frontend, e **Node.js** com **Express** no backend. Integrado com **MySQL** para persistência de dados, oferece uma solução eficiente para agendamento de serviços como barbearias, salões, clínicas, consultórios, entre outros.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- React 19
- TypeScript
- Vite (Build e Dev Server ultrarrápido)
- Tailwind CSS (Estilização moderna e eficiente)
- React Router DOM (Navegação de rotas)
- Lucide React (Ícones)
- React Datepicker (Seleção de datas)
- Axios (Requisições HTTP)

### Backend
- Node.js
- Express
- MySQL2 (Banco de dados relacional)
- Nodemailer (Envio de e-mails automáticos)
- Body-parser (Manipulação de requisições)
- CORS (Permitir requisições externas)

### Ferramentas Extras
- dotenv (Gerenciamento de variáveis de ambiente)
- bcrypt / bcryptjs (Criptografia e hash de senhas)
- Nodemon (Hot reload no desenvolvimento)
- ESLint + TypeScript ESLint (Padronização e qualidade de código)
- Simultaneamente (Executar frontend e backend juntos no desenvolvimento)

---

## 📦 Funcionalidades

- Cadastro de clientes
- Seleção de datas e horários disponíveis
- Painel administrativo para gerenciamento de agendamentos
- Envio automático de confirmação por e-mail
- Validação de horários para evitar conflitos
- Integração completa com banco de dados MySQL
- Interface responsiva, rápida e intuitiva

---

## 🔧 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio


2. Instale as dependências
bash
Copiar
Editar
npm install
cd backend
npm install
3. Configure o Banco de Dados
Crie um banco de dados MySQL.

Crie um arquivo .env dentro da pasta /backend com as seguintes variáveis:

ini
Copiar
Editar
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco

EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
4. Execute o Projeto
bash
Copiar
Editar
npm run dev
Isso irá iniciar tanto o backend quanto o frontend simultaneamente.

🌐 Acesso
Frontend: http://localhost:5173

Backend: http://localhost:3001

🧹 Configuração ESLint + React + Vite
Para manter a qualidade do código e integração com React e TypeScript, utilize a configuração:

ts
Copiar
Editar
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
Plugins adicionais para React
ts
Copiar
Editar
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
📜 Licença
Este projeto está licenciado sob a licença ISC.

🤝 Contribuição
Contribuições são bem-vindas!
Abra uma issue ou envie um pull request.


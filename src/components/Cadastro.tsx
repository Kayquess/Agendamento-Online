import React, { useState } from 'react';
import '../styles/agendar.css';

type UserData = {
  name: string;
  email: string;
  password: string;
};

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordToggle = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ name: '', email: '', password: '' });
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (response.status === 409) {
        setErrorMessage(data.error || 'Usuário já cadastrado.');
      } else if (response.status === 400) {
        setErrorMessage(data.error || 'Campos obrigatórios faltando.');
      } else {
        setErrorMessage(data.error || data.message || 'Erro ao cadastrar.');
      }
    } catch (error: any) {
      console.error('Erro ao conectar com o backend:', error);
      setErrorMessage('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isSubmitted ? (
        <div className="alert-success">
          <p>Cadastro realizado com sucesso! Redirecionando para login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-cadastro">
          <h1>Cadastro</h1>

          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={handlePasswordToggle}
            >
              {passwordVisible ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p>
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Cadastro;

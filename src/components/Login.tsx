import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export type User = {
  name: string;
  email: string;
};

type LoginPageProps = {
  onLoginSuccess: (user: User) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:3001/api/login', {  // Adicionei /api aqui também para consistência
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login.');
      } else {
        onLoginSuccess(data.user);
        navigate('/agendar');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Informe seu email para recuperar a senha.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:3001/api/forgot-password', {  // Corrigido aqui: adicionando /api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar email de recuperação.');
      } else {
        setSuccessMessage('Um código de recuperação foi enviado para seu email.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="forgot-password" onClick={handleForgotPassword}>
        Esqueceu a senha?
      </p>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="alert-success">{successMessage}</p>}

      <p className="link-text">
        Não tem conta?{' '}
        <span className="link" onClick={() => navigate('/cadastro')}>
          Cadastre-se
        </span>
      </p>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Token inválido ou expirado.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: password }), // CORREÇÃO AQUI
        }
      );

      const data = (await response.json()) as { message?: string; error?: string };

      if (response.ok) {
        setSuccess("Senha redefinida com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Erro ao redefinir a senha.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Redefinir Senha</h2>
        <form onSubmit={handleSubmit} className="reset-password-form" noValidate>
          <label htmlFor="password">Nova senha</label>
          <input
            id="password"
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            autoComplete="new-password"
          />
          <label htmlFor="confirmPassword">Confirme a nova senha</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            autoComplete="new-password"
          />
          {error && (
            <p className="error-message" aria-live="polite">
              {error}
            </p>
          )}
          {success && (
            <p className="success-message" aria-live="polite">
              {success}
            </p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

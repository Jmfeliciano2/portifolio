import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    setError('');
    if (!supabase) {
      setError('Supabase ainda não configurado.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError('E-mail ou senha inválidos.');
        return;
      }
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Não foi possível acessar o Supabase. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section shell page">
      <h1>Acesso do dono.</h1>
      <form onSubmit={login} className="contact-form">
        <label htmlFor="login-email">
          E-mail
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label htmlFor="login-password">
          Senha
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="button" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <p role="alert">{error}</p>
      </form>
    </main>
  );
}

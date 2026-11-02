import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from './services/github.js';

export default function Dashboard({ supabase }) {
  const [messages, setMessages] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const savingRef = useRef(false);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [messagesResult, featuredResult] = await Promise.all([
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('featured_projects').select('repo_name'),
      ]);
      if (messagesResult.error) throw messagesResult.error;
      if (featuredResult.error) throw featuredResult.error;
      setMessages(messagesResult.data || []);
      setFeatured((featuredResult.data || []).map((item) => item.repo_name));
    } catch {
      setError('Falha ao acessar mensagens ou destaques. Verifique a configuração do Supabase.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let active = true;
    void refresh();
    getProjects()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os projetos do GitHub.');
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  async function reply(message) {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(String(message.id));
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ replied: !message.replied })
        .eq('id', message.id);
      if (updateError) throw updateError;
      await refresh();
    } catch {
      setError('Não foi possível atualizar a mensagem.');
    } finally {
      savingRef.current = false;
      setSaving('');
    }
  }

  async function highlight(name) {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(name);
    setError('');
    const selected = featured.includes(name);
    try {
      const operation = selected
        ? supabase.from('featured_projects').delete().eq('repo_name', name)
        : supabase.from('featured_projects').insert({ repo_name: name });
      const { error: saveError } = await operation;
      if (saveError) throw saveError;
      setFeatured((current) =>
        selected ? current.filter((item) => item !== name) : [...current, name],
      );
    } catch {
      setError('Não foi possível salvar os destaques.');
    } finally {
      savingRef.current = false;
      setSaving('');
    }
  }

  async function logout() {
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      navigate('/login', { replace: true });
    } catch {
      setError('Não foi possível encerrar a sessão. Tente novamente.');
    }
  }

  return (
    <main className="section shell page">
      <h1>Dashboard.</h1>
      <button onClick={logout}>Sair</button>
      <p role="alert">{error}</p>
      <h2>Mensagens</h2>
      {loading ? (
        <p role="status">Carregando mensagens…</p>
      ) : messages.length === 0 ? (
        <p>Nenhuma mensagem recebida.</p>
      ) : (
        messages.map((item) => (
          <article className="project" key={item.id}>
            <p>
              <strong>{item.name}</strong> · <a href={`mailto:${item.email}`}>{item.email}</a>
            </p>
            <p>{item.message}</p>
            <small>{new Date(item.created_at).toLocaleString('pt-BR')}</small>
            <button disabled={Boolean(saving)} onClick={() => reply(item)}>
              {saving === String(item.id)
                ? 'Salvando…'
                : item.replied
                  ? '✓ Respondida (desfazer)'
                  : 'Marcar como respondida'}
            </button>
          </article>
        ))
      )}
      <h2>Projetos em destaque</h2>
      <p>Escolha os repositórios que aparecem na página inicial.</p>
      {projects.length === 0 ? (
        <p>Nenhum projeto encontrado no GitHub.</p>
      ) : (
        projects.map((project) => (
          <label
            key={project.id}
            style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '15px 0' }}
          >
            <input
              type="checkbox"
              disabled={Boolean(saving)}
              checked={featured.includes(project.name)}
              onChange={() => highlight(project.name)}
            />
            {project.name}
          </label>
        ))
      )}
    </main>
  );
}

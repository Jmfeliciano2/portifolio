import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase.js';
import { hasAccess } from '../utils/auth.js';

export default function ProtectedRoute({ children }) {
  const [logged, setLogged] = useState(undefined);

  useEffect(() => {
    if (!supabase) {
      setLogged(false);
      return undefined;
    }

    let active = true;
    let authChanged = false;
    let requestId = 0;

    async function checkSession(session) {
      const currentRequest = ++requestId;
      if (!session?.user?.id) {
        if (active && currentRequest === requestId) setLogged(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        if (active && currentRequest === requestId) {
          setLogged(!error && hasAccess(session, data));
        }
      } catch {
        if (active && currentRequest === requestId) setLogged(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authChanged = true;
      void checkSession(session);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!authChanged) void checkSession(data.session);
      })
      .catch(() => {
        if (active && !authChanged) setLogged(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (logged === undefined)
    return (
      <main className="section shell" role="status">
        Verificando login…
      </main>
    );
  return logged ? children : <Navigate to="/login" replace />;
}

import {useEffect,useState} from 'react';
import {Navigate} from 'react-router-dom';
import {supabase} from '../services/supabase.js';
import {hasAccess} from '../utils/auth.js';

export default function ProtectedRoute({children}){
 const [logged,setLogged]=useState(undefined);
 useEffect(()=>{
  if(!supabase){setLogged(false);return;}
  let active=true;
  async function checkSession(session){
   if(!session?.user?.id){if(active)setLogged(false);return;}
   const {data,error}=await supabase.from('admin_users').select('id').eq('id',session.user.id).maybeSingle();
   if(active)setLogged(!error&&hasAccess(session,data));
  }
  supabase.auth.getSession().then(({data})=>checkSession(data.session)).catch(()=>{if(active)setLogged(false);});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{checkSession(session);});
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 if(logged===undefined)return <main className="section shell">Verificando login…</main>;
 return logged?children:<Navigate to="/login" replace/>;
}

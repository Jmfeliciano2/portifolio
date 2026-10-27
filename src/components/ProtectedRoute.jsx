import {useEffect,useState} from 'react';
import {Navigate} from 'react-router-dom';
import {supabase} from '../services/supabase.js';
import {hasAccess} from '../utils/auth.js';
export default function ProtectedRoute({children}){const [logged,setLogged]=useState(undefined);useEffect(()=>{if(!supabase){setLogged(false);return;}let active=true;supabase.auth.getSession().then(({data})=>{if(active)setLogged(hasAccess(data.session));});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(active)setLogged(hasAccess(session));});return()=>{active=false;subscription.unsubscribe();};},[]);if(logged===undefined)return <main className="section shell">Verificando login…</main>;return logged?children:<Navigate to="/login" replace/>;}

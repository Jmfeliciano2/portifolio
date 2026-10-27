import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../services/supabase.js';
export default function Login(){const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);const navigate=useNavigate();
async function login(event){event.preventDefault();if(!supabase){setError('Supabase ainda não configurado.');return;}setLoading(true);const {error:err}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(err)setError('E-mail ou senha inválidos.');else navigate('/dashboard',{replace:true});}
return <main className="section shell page"><h1>Acesso do dono.</h1><form onSubmit={login} className="contact-form"><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="button" disabled={loading}>{loading?'Entrando…':'Entrar'}</button><p role="alert">{error}</p></form></main>;}

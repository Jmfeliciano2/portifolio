import {lazy,Suspense,useEffect,useState} from 'react';
import {Link,Routes,Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {supabase} from './services/supabase.js';
const Dashboard=lazy(()=>import('./Dashboard.jsx'));
export default function App(){
 const [theme,setTheme]=useState(()=>localStorage.getItem('jm-theme')||'dark');
 const [menu,setMenu]=useState(false);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('jm-theme',theme);},[theme]);
 return <><header className="header"><div className="shell header-row"><Link to="/" className="logo">JM<span>.</span></Link><button className="hamburger" aria-label="Abrir menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>☰</button><nav className={menu?'nav open':'nav'} onClick={()=>setMenu(false)}><Link to="/">Início</Link><Link to="/projetos">Projetos</Link><Link to="/contato">Contato</Link><Link to="/login">Admin</Link></nav><button onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label="Alternar tema">{theme==='dark'?'☀ Claro':'☾ Escuro'}</button></div></header>
 <Routes><Route path="/" element={<Home/>}/><Route path="/projetos" element={<Projects/>}/><Route path="/projetos/:slug" element={<ProjectDetails/>}/><Route path="/contato" element={<Contact/>}/><Route path="/login" element={<Login/>}/><Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<main className="section shell">Carregando painel…</main>}><Dashboard supabase={supabase}/></Suspense></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/></Routes>
 <footer className="footer shell">© {new Date().getFullYear()} João Matheus · React / Vite</footer></>;
}

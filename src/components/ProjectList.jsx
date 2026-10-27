import {useEffect,useState} from 'react';
import useProjects from '../hooks/useProjects.js';
import {getFeatured} from '../services/supabase.js';
import ProjectCard from './ProjectCard.jsx';
export default function ProjectList({limit=100}){const {projects,loading,error,reload}=useProjects();const [featured,setFeatured]=useState([]);useEffect(()=>{getFeatured().then(setFeatured).catch(()=>setFeatured([]));},[]);const filtered=limit===3&&featured.length?projects.filter(p=>featured.includes(p.name)):projects;
if(loading)return <div className="grid" aria-label="Carregando projetos">{[1,2,3].map(i=><div className="skeleton" key={i}/>)}</div>;
if(error)return <div role="alert"><p>{error}</p><button onClick={reload}>Tentar novamente</button></div>;
if(!filtered.length)return <p>Não há projetos para mostrar.</p>;
return <div className="grid">{filtered.slice(0,limit).map(p=><ProjectCard project={p} key={p.id}/>)}</div>;}

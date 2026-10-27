import {useEffect,useState} from 'react';
import {getProjects} from '../services/github.js';
export default function useProjects(){const [projects,setProjects]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [retry,setRetry]=useState(0);
useEffect(()=>{let active=true;getProjects().then(data=>{if(active)setProjects(data);}).catch(err=>{if(active)setError(err.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[retry]);
function reload(){setError('');setLoading(true);setRetry(n=>n+1);}
return{projects,loading,error,reload};}

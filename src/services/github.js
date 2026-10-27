let cache;
export function getProjects(){if(!cache)cache=fetch('https://api.github.com/users/Jmfeliciano2/repos?per_page=100&sort=updated').then(r=>{if(!r.ok)throw new Error('Não foi possível carregar o GitHub (HTTP '+r.status+').');return r.json();}).then(repos=>repos.filter(r=>!r.fork&&!r.archived)).catch(error=>{cache=null;throw error;});return cache;}

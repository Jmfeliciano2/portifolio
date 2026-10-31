let cache;
export function getProjects(force=false){
 if(force)cache=null;
 if(!cache){
  cache=fetch('https://api.github.com/users/Jmfeliciano2/repos?per_page=100&sort=updated')
   .then(response=>{
    if(!response.ok)throw new Error('Não foi possível carregar o GitHub (HTTP '+response.status+').');
    return response.json();
   })
   .then(repos=>repos.filter(repo=>!repo.fork&&!repo.archived))
   .catch(error=>{cache=null;throw error;});
 }
 return cache;
}

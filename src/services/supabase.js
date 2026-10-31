import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase=url&&key?createClient(url,key):null;

// null significa que o Supabase não está configurado.
// [] significa que o dono escolheu não destacar nenhum projeto.
export async function getFeatured(){
 if(!supabase)return null;
 const {data,error}=await supabase.from('featured_projects').select('repo_name');
 if(error)throw error;
 return (data||[]).map(item=>item.repo_name);
}

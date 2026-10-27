import {describe,it,expect} from 'vitest';
function canAccess(session){return Boolean(session?.user?.id);}
describe('proteção de dashboard',()=>{it('nega usuário sem sessão',()=>expect(canAccess(null)).toBe(false));it('aceita usuário autenticado',()=>expect(canAccess({user:{id:'1'}})).toBe(true));});

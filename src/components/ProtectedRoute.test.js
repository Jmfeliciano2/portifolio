import {describe,it,expect} from 'vitest';
import {hasAccess} from '../utils/auth.js';
describe('bloqueio do dashboard',()=>{
 it('nega quem não está autenticado',()=>expect(hasAccess(null,null)).toBe(false));
 it('nega usuário autenticado sem cadastro de administrador',()=>expect(hasAccess({user:{id:'user-1'}},null)).toBe(false));
 it('nega cadastro de administrador de outro usuário',()=>expect(hasAccess({user:{id:'user-1'}},{id:'user-2'})).toBe(false));
 it('aceita somente o usuário autenticado cadastrado como dono',()=>expect(hasAccess({user:{id:'admin-1'}},{id:'admin-1'})).toBe(true));
});

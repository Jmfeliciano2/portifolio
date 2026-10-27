import {describe,it,expect} from 'vitest';
import {hasAccess} from '../utils/auth.js';
describe('bloqueio do dashboard',()=>{it('sem login retorna falso',()=>expect(hasAccess(null)).toBe(false));it('com usuário autenticado retorna verdadeiro',()=>expect(hasAccess({user:{id:'admin'}})).toBe(true));});

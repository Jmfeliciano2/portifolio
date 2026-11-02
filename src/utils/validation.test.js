import { describe, expect, it } from 'vitest';
import { validateContact } from './validation.js';

describe('validação do formulário', () => {
  it('rejeita e-mail inválido', () => {
    expect(
      validateContact({
        name: 'João',
        email: 'abc',
        message: 'Mensagem de teste com mais de vinte caracteres.',
      }).email,
    ).toBeDefined();
  });

  it('rejeita mensagens curtas', () => {
    expect(
      validateContact({ name: 'João', email: 'joao@teste.com', message: 'oi' }).message,
    ).toBeDefined();
  });

  it('aceita um contato válido com espaços externos removidos', () => {
    expect(
      validateContact({
        name: ' Maria ',
        email: 'maria@example.com ',
        message: 'Mensagem válida com mais de vinte caracteres.',
      }),
    ).toEqual({});
  });

  it('rejeita valores acima dos limites de nome, e-mail e mensagem', () => {
    const errors = validateContact({
      name: 'N'.repeat(101),
      email: `${'a'.repeat(246)}@example.com`,
      message: 'M'.repeat(5001),
    });
    expect(errors).toHaveProperty('name');
    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('message');
  });
});

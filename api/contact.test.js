import { describe, expect, it } from 'vitest';
import handler from './contact.js';

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe('API de contato', () => {
  it('recusa métodos diferentes de POST', async () => {
    const res = createResponse();
    await handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
  });

  it('responde 400 para JSON inválido', async () => {
    const res = createResponse();
    await handler({ method: 'POST', body: '{' }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/inválido/i);
  });

  it('valida os campos no servidor antes de depender de credenciais', async () => {
    const res = createResponse();
    await handler({ method: 'POST', body: { name: '', email: 'ruim', message: 'curta' } }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.fields).toHaveProperty('name');
    expect(res.body.fields).toHaveProperty('email');
    expect(res.body.fields).toHaveProperty('message');
  });

  it('limita o tamanho do corpo', async () => {
    const res = createResponse();
    await handler({ method: 'POST', body: 'x'.repeat(10_001) }, res);
    expect(res.statusCode).toBe(413);
  });
});

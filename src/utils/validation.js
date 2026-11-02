export function validateContact(form = {}) {
  const name = typeof form.name === 'string' ? form.name.trim() : '';
  const email = typeof form.email === 'string' ? form.email.trim() : '';
  const message = typeof form.message === 'string' ? form.message.trim() : '';
  const errors = {};

  if (!name) errors.name = 'Informe o nome.';
  else if (name.length > 100) errors.name = 'O nome deve ter até 100 caracteres.';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.email = 'E-mail inválido.';
  }

  if (message.length < 20) errors.message = 'Mensagem com no mínimo 20 caracteres.';
  else if (message.length > 5000) errors.message = 'A mensagem deve ter até 5.000 caracteres.';

  return errors;
}

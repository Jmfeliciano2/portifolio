import { createClient } from '@supabase/supabase-js';
import { validateContact } from '../src/utils/validation.js';

function jsonResponse(res, status, body) {
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonResponse(res, 405, { error: 'Método não permitido.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      if (new TextEncoder().encode(body).length > 10_000) {
        return jsonResponse(res, 413, { error: 'Mensagem muito longa.' });
      }
      try {
        body = JSON.parse(body);
      } catch {
        return jsonResponse(res, 400, { error: 'Corpo da requisição inválido.' });
      }
    }

    const form = {
      name: typeof body?.name === 'string' ? body.name.trim() : '',
      email: typeof body?.email === 'string' ? body.email.trim() : '',
      message: typeof body?.message === 'string' ? body.message.trim() : '',
    };
    if (JSON.stringify(form).length > 10_000) {
      return jsonResponse(res, 413, { error: 'Mensagem muito longa.' });
    }

    const errors = validateContact(form);
    if (Object.keys(errors).length) {
      return jsonResponse(res, 400, { error: Object.values(errors)[0], fields: errors });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse(res, 503, { error: 'Formulário não configurado no servidor.' });
    }

    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await db.from('messages').insert(form);
    if (error) throw error;

    let emailSent = false;
    if (
      process.env.RESEND_API_KEY &&
      process.env.CONTACT_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL
    ) {
      try {
        const result = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL,
            to: [process.env.CONTACT_TO_EMAIL],
            subject: 'Novo contato do portfólio',
            text: `Nome: ${form.name}\nE-mail: ${form.email}\nMensagem:\n${form.message}`,
          }),
        });
        emailSent = result.ok;
      } catch {
        emailSent = false;
      }
    }

    return jsonResponse(res, 201, { message: 'Mensagem salva.', emailSent });
  } catch {
    return jsonResponse(res, 500, { error: 'Não foi possível enviar a mensagem.' });
  }
}

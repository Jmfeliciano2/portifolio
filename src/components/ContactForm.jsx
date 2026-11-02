import { useRef, useState } from 'react';
import { validateContact } from '../utils/validation.js';

const fields = [
  { name: 'name', label: 'Nome', type: 'text', maxLength: 100 },
  { name: 'email', label: 'E-mail', type: 'email', maxLength: 254 },
  { name: 'message', label: 'Mensagem', type: 'textarea', maxLength: 5000 },
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const sendingRef = useRef(false);

  async function send(event) {
    event.preventDefault();
    if (sendingRef.current) return;
    const invalid = validateContact(form);
    setErrors(invalid);
    setStatus('');
    if (Object.keys(invalid).length) return;

    sendingRef.current = true;
    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar a mensagem.');
      setStatus(
        result.emailSent
          ? 'Mensagem salva e enviada por e-mail.'
          : 'Mensagem salva; não foi possível confirmar o envio do e-mail.',
      );
      setForm({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      setStatus(error.message || 'Falha ao enviar. Tente novamente.');
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <form onSubmit={send} noValidate className="contact-form">
      {fields.map(({ name, label, type, maxLength }) => {
        const errorId = `${name}-error`;
        const commonProps = {
          id: name,
          name,
          maxLength,
          value: form[name],
          onChange: (event) => updateField(name, event.target.value),
          'aria-invalid': Boolean(errors[name]),
          'aria-describedby': errors[name] ? errorId : undefined,
        };
        return (
          <label key={name} htmlFor={name}>
            {label}
            {type === 'textarea' ? (
              <textarea {...commonProps} rows="6" />
            ) : (
              <input {...commonProps} type={type} />
            )}
            <small id={errorId} role="alert">
              {errors[name]}
            </small>
          </label>
        );
      })}
      <button className="button" type="submit" disabled={sending}>
        {sending ? 'Enviando…' : 'Enviar mensagem ↗'}
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

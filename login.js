const form = document.getElementById('form-login');
const mensagem = document.getElementById('mensagem-login');
const btnEntrar = form.querySelector('button[type="submit"]');
const btnMostrarSenha = document.getElementById('btn-mostrar-senha');
const inputSenha = document.getElementById('senha');

// Botão para mostrar / ocultar senha
if (btnMostrarSenha && inputSenha) {
    btnMostrarSenha.addEventListener('click', () => {
        const tipoAtual = inputSenha.getAttribute('type');
        if (tipoAtual === 'password') {
            inputSenha.setAttribute('type', 'text');
            btnMostrarSenha.textContent = 'Ocultar';
        } else {
            inputSenha.setAttribute('type', 'password');
            btnMostrarSenha.textContent = 'Mostrar';
        }
    });
}

// Verifica se foi redirecionado por sessão expirada ou inválida
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('sessao') === 'expirada' || urlParams.get('expirado') === '1') {
    mensagem.textContent = 'Sua sessão expirou ou é inválida. Por favor, faça login novamente.';
    mensagem.className = 'mensagem-aviso';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Ajuda didática: se o usuário colou o hash bcrypt no campo de senha em vez da senha original
    if (senha.startsWith('$2a$') || senha.startsWith('$2b$') || senha.startsWith('$2y$')) {
        mensagem.textContent = 'Atenção: Você colou o hash criptografado no campo de senha! Digite sua senha normal em texto puro (a mesma palavra usada ao gerar o hash, ex: vai123).';
        mensagem.className = 'mensagem-aviso';
        return;
    }

    try {
        mensagem.textContent = 'Entrando...';
        mensagem.className = '';
        btnEntrar.disabled = true;

        const resposta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.error || 'Não foi possível autenticar.'
            );
        }

        // Armazena o JWT em sessionStorage (sessão dura até o encerramento da aba/navegador)
        sessionStorage.setItem('adminToken', resultado.token);

        mensagem.textContent = 'Autenticado com sucesso! Redirecionando...';
        mensagem.className = 'mensagem-sucesso';

        window.location.href = '/admin.html';

    } catch (error) {
        if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
            mensagem.textContent = 'Não foi possível conectar ao servidor. Inicie o backend com "npm start" no terminal e acesse http://localhost:3000/login.html';
        } else {
            mensagem.textContent = error.message;
        }
        mensagem.className = 'mensagem-erro';
    } finally {
        btnEntrar.disabled = false;
    }
});
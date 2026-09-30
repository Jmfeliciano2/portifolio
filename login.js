const form =
    document.getElementById('form-login');

const mensagem =
    document.getElementById('mensagem-login');


form.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();

        const email =
            document
                .getElementById('email')
                .value
                .trim();

        const senha =
            document
                .getElementById('senha')
                .value;


        try {

            mensagem.textContent =
                'Entrando...';


            const resposta =
                await fetch(
                    '/api/auth/login',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({
                            email,
                            senha
                        })
                    }
                );


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    resultado.error ||
                    'Não foi possível entrar.'
                );

            }


            // Guarda o JWT no navegador.
            // Para este projeto didático, usamos sessionStorage:
            // o token some quando a sessão/aba é encerrada.

            sessionStorage.setItem(
                'adminToken',
                resultado.token
            );


            window.location.href =
                '/admin.html';


        } catch (error) {

            mensagem.textContent =
                error.message;

        }

    }
);
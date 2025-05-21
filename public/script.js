document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const userPanel = document.getElementById('user-panel');
    const adminPanel = document.getElementById('admin-panel');
    const userName = document.getElementById('user-name');
    const message = document.getElementById('message');
    const logoutBtn = document.getElementById('logout-btn');
    const blindSqlBtn = document.getElementById('blind-sql-btn');

    // Check if user is already logged in
    checkLoginStatus();

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                showMessage('Login successful!', true);
                setTimeout(() => {
                    checkLoginStatus();
                }, 1000);
            } else {
                showMessage(data.message || 'Login failed', false);
            }
        } catch (err) {
            showMessage('An error occurred during login.', false);
            console.error('Login error:', err);
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                userPanel.style.display = 'none';
                loginContainer.style.display = 'block';
                showMessage('Logged out successfully!', true);
                setTimeout(() => {
                    message.textContent = '';
                    message.className = '';
                }, 2000);
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    });

    // Blind SQL Injection button
    blindSqlBtn.addEventListener('click', async function() {
        if (!window.confirm('Deseja realmente executar a demonstração de Blind SQL Injection?')) return;
        console.clear();
        console.log('%cIniciando ataque Blind SQL Injection para extrair a senha do admin...','color:orange;font-weight:bold');
        try {
            const response = await fetch('/api/blind-sql-injection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.body) {
                console.error('Streaming não suportado.');
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let buffer = '';
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    let lines = buffer.split('\n');
                    buffer = lines.pop();
                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                const msg = JSON.parse(line);
                                if (msg.type === 'progress') {
                                    console.log(`%c[Posição ${msg.position}] Testando caractere: '${msg.char}'...`, 'color:gray');
                                } else if (msg.type === 'found') {
                                    console.log(`%c✔ Caractere encontrado na posição ${msg.position}: '${msg.char}'`, 'color:green');
                                    console.log(`%cSenha parcial: ${msg.partial}`, 'color:cyan');
                                } else if (msg.type === 'done') {
                                    if (msg.password) {
                                        console.log(`%cSenha extraída para admin: ${msg.password}`, 'background:green;color:white');
                                    } else {
                                        console.log('%cExtração finalizada. Não foi possível extrair a senha.', 'background:red;color:white');
                                    }
                                }
                            } catch {}
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao executar Blind SQL Injection:', err);
        }
    });

    // Check if user is logged in
    async function checkLoginStatus() {
        try {
            const response = await fetch('/api/user');

            if (response.ok) {
                const data = await response.json();

                if (data.success) {
                    loginContainer.style.display = 'none';
                    userPanel.style.display = 'block';
                    userName.textContent = data.user.username;

                    // Show admin panel if user is admin
                    if (data.user.is_admin) {
                        adminPanel.style.display = 'block';
                    } else {
                        adminPanel.style.display = 'none';
                    }

                    return;
                }
            }

            // If not logged in or error
            loginContainer.style.display = 'block';
            userPanel.style.display = 'none';

        } catch (err) {
            console.error('Error checking login status:', err);
        }
    }

    // Show message function
    function showMessage(text, isSuccess) {
        message.textContent = text;
        message.className = isSuccess ? 'success' : 'error';
    }
});

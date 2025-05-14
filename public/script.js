document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const userPanel = document.getElementById('user-panel');
    const adminPanel = document.getElementById('admin-panel');
    const userName = document.getElementById('user-name');
    const message = document.getElementById('message');
    const logoutBtn = document.getElementById('logout-btn');

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

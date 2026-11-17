const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // Tampilkan pesan pengguna
    appendMessage(message, 'user-message');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Tampilkan indikator mengetik sementara
    const loadingDiv = appendMessage('Sedang mengetik...', 'bot-message');

    try {
        // Sesuaikan endpoint '/chat' atau '/api/chat' dengan route di index.js kamu
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Gagal mendapatkan respons dari server');
        }

        // Menyesuaikan properti balasan umum dari backend (reply / response / message)
        loadingDiv.textContent = data.reply || data.response || data.message || 'Tidak ada balasan.';
    } catch (error) {
        loadingDiv.textContent = 'Maaf, terjadi kesalahan saat menghubungi server.';
        console.error('Error:', error);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});
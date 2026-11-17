const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');

// Riwayat percakapan, supaya AI ingat konteks
const history = [];

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

    appendMessage(message, 'user-message');
    history.push({ role: 'user', content: message });

    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    const botDiv = appendMessage('Sedang mengetik...', 'bot-message');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // PERBAIKAN: kirim "messages" berupa array
            body: JSON.stringify({ messages: history })
        });

        // Error sebelum streaming dimulai (400, 401, 404, 500, dst.)
        if (!response.ok) {
            let errMsg = 'Gagal mendapatkan respons dari server';
            try {
                const errData = await response.json();
                errMsg = errData.error || errMsg;
            } catch (_) {}
            throw new Error(errMsg);
        }

        // PERBAIKAN: baca streaming SSE, bukan response.json()
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullReply = '';
        botDiv.textContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // sisakan baris yang belum lengkap

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;

                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);

                    // Error di tengah streaming dari backend
                    if (parsed && typeof parsed === 'object' && parsed.error) {
                        throw new Error(parsed.error);
                    }

                    fullReply += parsed;
                    botDiv.textContent = fullReply;
                    chatBox.scrollTop = chatBox.scrollHeight;
                } catch (err) {
                    if (err.message && !(err instanceof SyntaxError)) throw err;
                }
            }
        }

        if (!fullReply) {
            botDiv.textContent = 'Tidak ada balasan.';
        } else {
            history.push({ role: 'assistant', content: fullReply });
        }
    } catch (error) {
        botDiv.textContent = 'Maaf, terjadi kesalahan saat menghubungi server.';
        console.error('Error:', error);
        history.pop(); // buang pesan user terakhir agar riwayat tetap konsisten
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});
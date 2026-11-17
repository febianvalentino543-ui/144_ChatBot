Aplikasi **Chatbot AI** berbasis **Express.js** dengan tampilan web, dibuat untuk praktikum Pengembangan Web Service (Pertemuan 10). Chatbot terhubung ke **OpenRouter API** dan menampilkan balasan secara **streaming** (muncul bertahap, seperti mengetik).
  
## Bukti Running di Vercel
 
Tampilan web chatbot yang sudah berjalan di Vercel (URL terlihat pada address bar):
 
<img width="3000" height="1800" alt="image" src="https://github.com/user-attachments/assets/3ad8d9ab-b3d4-4847-80a9-012596a4b100" />


## Fitur
 
- Antarmuka chat sederhana (HTML, CSS, JavaScript).
- Backend REST API dengan Express.js (`POST /api/chat`).
- Balasan AI ditampilkan secara streaming menggunakan Server-Sent Events (SSE).
- Riwayat percakapan dikirim ke API, sehingga chatbot mengingat konteks obrolan.
- API key disimpan di environment variable (`.env`), tidak ditulis di kode.
## Teknologi
 
- **Node.js** dan **Express.js** sebagai server
- **dotenv** untuk membaca environment variable
- **OpenRouter API** dengan model `inclusionai/ling-3.2-flash:free`
- **HTML, CSS, JavaScript** (vanilla) untuk frontend
- **Vercel** untuk deployment
## Struktur Project
 
```
Pertemuan 10/
├── public/
│   ├── index.html      # halaman chat
│   ├── script.js       # logika frontend (kirim pesan, baca streaming)
│   └── style.css       # tampilan
├── images/             # screenshot untuk README
├── .env                # API key (tidak di-upload ke GitHub)
├── .gitignore
├── index.js            # server Express dan endpoint /api/chat
├── package.json
└── package-lock.json
```
 
## Deploy ke Vercel
 
1. Push project ke GitHub.
2. Buka https://vercel.com, lalu **Add New → Project** dan import repository `144_ChatBot`.
3. Pada **Environment Variables**, tambahkan:
   - Name: `OPENROUTER_API_KEY`
   - Value: API key OpenRouter
4. Klik **Deploy**.
5. Setelah selesai, buka URL dari Vercel dan tambahkan `/index.html`.
---
 

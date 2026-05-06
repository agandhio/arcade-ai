
# 👾 ArcadeAI (For Bule :D) --- Big Shoutout to HACKTIV8 coaches that enables me to utilize Gemini AI SDK for this project

**Play the classics. Chat with the machine. Learn the code.**

ArcadeAI is a split-screen Next.js playground that mashes up classic 8-bit web games with an integrated AI terminal. The goal is simple: play the games on the right, and t$

> **💡 Background:** This project is my personal approach to implementing the concepts learned in the **Hacktiv8 AI class**. It serves as a hands-on experiment in integrat$ 
## 🚀 Features
* **5 Playable Classics:** Pong, Snake, Tetris, Space Invaders, and Tic-Tac-Toe.
* **Split-Screen UI:** Retro terminal styling for the code/chat, and a dedicated arcade cabinet view for the games.
* **Responsive Controls:** Play using your keyboard (WASD/Arrows) or the mobile-friendly on-screen D-Pad.
* **AI Code Mentor:** A secure, serverless LLM integration that acts as an in-game sysadmin, explaining the code of whatever game you're currently playing.

## 🛠️ Tech Stack
* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Frontend:** React, Vanilla CSS Modules, HTML5 Canvas
* **AI Integration:** Gemini Model via Google Gen AI SDK
* **Backend:** Next.js Serverless Routes for secure API calls

## 🛠️ Local Setup Guide

Follow these step-by-step instructions to get **ArcadeAI** running on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** (Version 18.0 or higher)
*   **Package Manager:** npm (included with Node), [Yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/).

---

## 1️⃣ Step 1: Clone the Repository

Clone the project from GitHub to your local machine:
```bash
git clone [https://github.com/agandhio/arcade-ai.git](https://github.com/agandhio/arcade-ai.git)
cd arcade-ai
```

---

## 2️⃣ Step 2: Install Dependencies

Install the required packages using your preferred manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

---

## 3️⃣ Step 3: Set Up Environment Variables

ArcadeAI uses the **Google Gemini API** via the **Google Gen AI SDK**. You will need an API key to enable the AI Code Mentor.

1.  Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root directory of the project, create a file named `.env.local`.
3.  Add your key to the file using the following variable name:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

> **Note:** `.env.local` is listed in your `.gitignore` to ensure your secret keys are never pushed to GitHub.

---

## 4️⃣ Step 4: Run the Development Server

Start the application in development mode:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

---

## 5️⃣ Step 5: Access the Arcade

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

You should now see the terminal and arcade interface. 

### 💡 Troubleshooting
*   **AI not responding?** Ensure your API key in `.env.local` is correct and that you have restarted the server after saving the file.
*   **Port already in use?** If port 3000 is occupied, Next.js will automatically try 3001. Check your terminal output for the correct URL.

---

# 🇮🇩 ArcadeAI (Untuk WIR Tercinta) --- Thanks berat untuk mas-mbak coach HACKTIV8 yang sudah bantu saya memahami Gemini AI SDK agar bisa diimplementasikan di proyek ini :D

**Mainkan game klasiknya. Ngobrol sama AI-nya. Pelajari kodenya.**

ArcadeAI adalah sebuah *playground* Next.js *split-screen* yang menggabungkan game web 8-bit klasik dengan terminal AI terintegrasi. Tujuannya sederhana: mainkan game di s$

> **💡 Latar Belakang:** Project ini adalah hasil eksperimen dan pendekatan personal saya dalam mengimplementasikan materi dari **kelas AI Hacktiv8**. Project ini berfungs$ 
## 🚀 Fitur Utama
* **5 Game Klasik:** Pong, Snake, Tetris, Space Invaders, dan Tic-Tac-Toe.
* **UI Split-Screen:** Gaya terminal retro untuk kode/obrolan, dan tampilan *arcade* khusus untuk bermain game.
* **Kontrol Responsif:** Bermain menggunakan keyboard (WASD/Panah) atau D-Pad di layar yang *mobile-friendly*.
* **AI Code Mentor:** Integrasi LLM *serverless* yang aman, bertindak sebagai *sysadmin* di dalam game yang siap menjelaskan kode dari game apa pun yang sedang Anda mainka$

## 🛠️ Tech Stack
* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Frontend:** React, Vanilla CSS Modules, HTML5 Canvas
* **AI Integration:** Gemini Model via Google Gen AI SDK
* **Backend:** Next.js Serverless Routes untuk API call yang aman

## 💻 Cara Install & Menjalankan di Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan **ArcadeAI** di komputer lokal kamu.

---

## 📋 Prasyarat

Sebelum memulai, pastikan kamu sudah menginstal hal-hal berikut:
*   **Node.js** (Versi 18.0 atau lebih tinggi).
*   **Package Manager:** npm (bawaan Node.js), [Yarn](https://yarnpkg.com/), atau [pnpm](https://pnpm.io/).

---

## 1️⃣ Langkah 1: Clone Repository

Clone project ini dari GitHub ke komputer lokal kamu:
```bash
git clone [https://github.com/agandhio/arcade-ai.git](https://github.com/agandhio/arcade-ai.git)
cd arcade-ai
```

---

## 2️⃣ Langkah 2: Install Dependencies

Install semua package yang dibutuhkan menggunakan package manager pilihan kamu:

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

---

## 3️⃣ Langkah 3: Konfigurasi Environment Variables

ArcadeAI menggunakan **Google Gemini API** melalui **Google Gen AI SDK**. Kamu butuh API key agar fitur AI Code Mentor bisa berfungsi.

1.  Dapatkan API key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Di root directory project, buat file baru bernama `.env.local`.
3.  Tambahkan API key kamu ke dalam file tersebut dengan format berikut:
```env
NEXT_PUBLIC_GEMINI_API_KEY=isi_api_key_kamu_di_sini
```

> **Catatan:** File `.env.local` sudah otomatis masuk dalam `.gitignore` untuk memastikan API key kamu tidak ter-push ke GitHub.

---

## 4️⃣ Langkah 4: Jalankan Development Server

Jalankan aplikasi dalam mode pengembangan:
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

---

## 5️⃣ Langkah 5: Buka Arcade

Buka browser kamu dan akses:
**[http://localhost:3000](http://localhost:3000)**

Sekarang kamu sudah bisa melihat tampilan terminal dan interface arcade.

### 💡 Troubleshooting
*   **AI tidak merespon?** Pastikan API key di `.env.local` sudah benar dan pastikan kamu sudah melakukan *restart* server (matikan lalu jalankan kembali `npm run dev`) setelah menyimpan file `.env.local`.
*   **Port 3000 sudah terpakai?** Jika port 3000 sedang digunakan aplikasi lain, Next.js otomatis akan mencoba port 3001. Cek keterangan URL yang muncul di terminal kamu.

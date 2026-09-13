# 🌟 TESTDII — SBTI Personality Discovery Platform

> **Nền tảng Trắc nghiệm Tính cách SBTI 15 Chiều Không Gian & 27 Linh Thú Độc Bản**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-TESTDII%20Platform-emerald?style=for-the-badge&logo=vercel)](https://testdii-platform.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

🔗 **Trải nghiệm ngay sản phẩm trực tuyến tại:** [https://testdii-platform.vercel.app/](https://testdii-platform.vercel.app/)

---

TESTDII là ứng dụng trắc nghiệm tính cách hiện đại được thiết kế theo phương pháp luận **SBTI (15-Dimension Vector Analysis)**. Ứng dụng cung cấp góc nhìn tâm lý chân thật, sinh động bằng cách phân tích 15 chỉ số độc lập và mã hóa kết quả thành **27 Linh thú độc bản** cùng thẻ sưu tầm cá nhân hóa đa theme cực kỳ ấn tượng.

![TESTDII Platform Banner](https://raw.githubusercontent.com/m1t156/TESTDII-PLATFORM/main/Testdi_Frontend/public/characters/BOSS.png)

---

## ✨ Tính Năng Nổi Bật (Key Features)

- 🌐 **Live Online Demo:** Truy cập trực tiếp tại [testdii-platform.vercel.app](https://testdii-platform.vercel.app/) để làm bài test trên điện thoại & máy tính.
- 🧠 **Thuật toán Phân tích 15 Chiều Không Gian (15-Dimension Vector Engine):** Đo lường chi tiết 5 nhóm mô hình tính cách (*Bản Thân, Cảm Xúc, Thái Độ, Hành Động, Xã Hội*) cùng 15 chỉ số thành phần (S1-S3, E1-E3, A1-A3, AC1-AC3, SO1-SO3).
- 🐾 **27 Linh Thú Tính Cách Độc Bản (27 Archetype Spirits):** Bộ sưu tập 27 nhân vật linh thú đại diện cho từng ma trận tính cách, kèm phân tích siêu năng lực, huyệt điểm, câu nói cửa miệng và tình huống thực tế.
- 🎨 **Thẻ Tính Cách Cá Nhân Hóa (Personalized Social Share Cards):** Xuất thẻ kết quả 5 Theme nghệ thuật (*Obsidian Gold, Neon Cyberpunk, Minimal Cream, Crimson Fire, Emerald Mint*).
- 📱 **Tối Ưu Xuất Ảnh & Chia Sẻ Đa Nền Tảng (Cross-Platform Mobile Export):**
  - **Base64 Pre-loading Engine:** Đảm bảo 100% hình ảnh linh thú hiển thị sắc nét khi xuất PNG (khắc phục dứt điểm lỗi mất hình trên mobile).
  - **Apple & Android Native Share Sheet:** Hỗ trợ lưu 1-touch trực tiếp vào **Bộ sưu tập / Photos / Gallery** trên iPhone và Android, hoặc chia sẻ thẳng sang Instagram Story, Facebook, Zalo.
  - **Mobile Lightbox Preview Modal:** Hỗ trợ xem trước HD và nhấn giữ 1 giây lưu ảnh trên các trình duyệt ứng dụng (Zalo, Facebook Messenger, TikTok WebView).
- 📊 **Bảng Xếp Hạng Phổ Biến (Popular Scoreboard):** Cập nhật thời gian thực tỷ lệ % và số lượng người dùng khai phá từng loại hình tính cách từ MongoDB.
- 🔍 **Bộ Khám Phá Accordion Chi Tiết (Interactive Dimension Explorer):** Tra cứu chuyên sâu ý nghĩa chỉ số High/Low và các linh thú tương thích.
- 🔊 **Âm Thanh Tương Tác (Web Audio Sound Effects):** Hiệu ứng âm thanh sinh động khi tương tác chọn câu hỏi và xem kết quả.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** Next.js 16 (React 19, App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4, Vanilla CSS, Lucide Icons
- **Image Generation & Share:** `html-to-image`, Native Web Share API, Canvas Engine
- **Animation & Effects:** Canvas Confetti, Web Audio API

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM (Hỗ trợ tự động fallback MongoMemoryServer khi không có MongoDB local)
- **Architecture:** RESTful APIs, MVC Controller Pattern, Automatic Database Seeder

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Quick Start)

### Yêu cầu hệ thống:
- **Node.js**: `v18.0.0` trở lên
- **npm** / **yarn** / **pnpm**
- **MongoDB**: Chạy MongoDB local trên cổng `27017` hoặc ứng dụng sẽ tự động khởi chạy In-Memory MongoDB.

---

### 1. Khởi chạy Backend (Express.js API)

```bash
cd Testdi_Backend
npm install
npm run dev
```
> Backend API server sẽ khởi chạy tại: `http://localhost:5000`

---

### 2. Khởi chạy Frontend (Next.js App)

```bash
cd Testdi_Frontend
npm install
npm run dev
```
> Frontend web app sẽ khởi chạy tại: `http://localhost:3000`

---

## 📝 Cấu Trúc Thư Mục (Project Architecture)

```text
TESTDII-PLATFORM/
├── Testdi_Backend/           # Express Server & Database Models
│   ├── config/               # MongoDB Connection Configuration
│   ├── controllers/          # Scoring Engine, Test & Character Controllers
│   ├── models/               # Mongoose Schemas (Question, Character, SBTIResult)
│   ├── routes/               # API Routes (/api/tests, /api/personalities, /api/characters)
│   └── seeders/              # Database Seeder Data (27 Personalities & 31 Questions)
│
└── Testdi_Frontend/          # Next.js App Router Frontend
    ├── public/               # Static Character Artworks & Assets
    └── src/
        ├── api/              # API Client (Fetch Client & Test Services)
        ├── app/              # Next.js App Router Pages
        │   ├── about/        # Giới thiệu & Triết lý TESTDII
        │   ├── personality/  # Chi tiết 27 Linh thú
        │   ├── result/       # Kết quả theo Result ID
        │   └── test/         # Luồng làm bài test SBTI
        ├── components/       # Reusable React Components
        │   ├── common/       # Button, Loading, ErrorState, ProgressBar
        │   ├── layout/       # Navbar & Footer
        │   ├── personality/  # DimensionExplorer, PopularScoreboard, Gallery
        │   ├── quiz/         # QuizInterface
        │   ├── result/       # PersonalizedShareCard, DimensionBreakdown, TopMatches
        │   └── test/         # QuestionCard, TestIntroCard
        └── lib/              # Dimension Data Dictionary & Witty Descriptions
```

---

## 🌐 Biến Môi Trường (Environment Variables)

### Backend (`Testdi_Backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/testdii
NODE_ENV=development
```

### Frontend (`Testdi_Frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📜 License & Copyright

Dự án được phát triển cho mục đích trải nghiệm & khám phá bản ngã. Tất cả bản quyền giao diện và tài nguyên thuộc về **TESTDII Platform**.

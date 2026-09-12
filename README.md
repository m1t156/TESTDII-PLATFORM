# 🌟 TESTDII — SBTI Personality Exploration Platform

> **Nền tảng Trắc nghiệm Tính cách SBTI 15 Chiều Không Gian & 27 Linh Thú Độc Bản**

TESTDII là ứng dụng trắc nghiệm tính cách hiện đại được thiết kế theo phương pháp luận **SBTI (15-Dimension Vector Analysis)**. Ứng dụng cung cấp góc nhìn tâm lý chân thật, sinh động bằng cách phân tích 15 chỉ số độc lập và mã hóa kết quả thành **27 Linh thú độc bản** cùng thẻ sưu tầm 3D tương tác.

---

## ✨ Tính Năng Nổi Bật (Key Features)

- 🧠 **Thuật toán Phân tích 15 Chiều Không Gian (15-Dimension Vector Engine):** Đo lường chi tiết 5 nhóm mô hình tính cách (*Bản Thân, Cảm Xúc, Thái Độ, Hành Động, Xã Hội*) cùng 15 chỉ số phụ (S1-S3, E1-E3, A1-A3, AC1-AC3, SO1-SO3).
- 🎴 **Thẻ Bài Sưu Tầm 3D Tương Tác (Interactive 3D Collectible Card):** Trải nghiệm lật thẻ 3D khám phá **DNA Tattoo String 15 cấp độ** (L/M/H) kèm hiệu ứng âm thanh sống động.
- 📊 **Bảng Xếp Hạng Phổ Biến (Popular Scoreboard):** Cập nhật thời gian thực tỷ lệ % và số lượng người dùng khai phá từng loại hình tính cách từ MongoDB database.
- 📖 **Bộ Khám Phá Accordion Chi Tiết (Interactive Dimension Explorer):** Tra cứu chuyên sâu ý nghĩa chỉ số High/Low và các linh thú tương thích.
- 📱 **Giao Diện Editorial Chuẩn Mobile-First:** Phong cách thiết kế Editorial hiện đại, responsive 100% trên điện thoại và máy tính.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** Next.js 16 (React 19, App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Vanilla CSS, Lucide Icons
- **Animation & Effects:** Three.js / React Three Fiber, Canvas Confetti, Web Audio API

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM (Hỗ trợ tự động fallback MongoMemoryServer)
- **Architecture:** RESTful APIs, MVC Controller Pattern, Automatic Database Seeder

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Quick Start)

### Yêu cầu hệ thống:
- **Node.js**: `v18.0.0` trở lên
- **MongoDB**: Chạy MongoDB local trên cổng `27017` hoặc ứng dụng sẽ tự động khởi chạy In-Memory MongoDB.

### 1. Khởi chạy Backend (Node.js/Express)
```bash
cd Testdi_Backend
npm install
npm run dev
# Server sẽ khởi chạy tại http://localhost:5000
```

### 2. Khởi chạy Frontend (Next.js)
```bash
cd Testdi_Frontend
npm install
npm run dev
# Frontend sẽ khởi chạy tại http://localhost:3000
```

---

## 📝 Cấu Trúc Thư Mục (Project Architecture)

```text
TESTDII/
├── Testdi_Backend/           # Express Server & Database Models
│   ├── config/               # MongoDB Connection
│   ├── controllers/          # Business Logic & Scoring Algorithm
│   ├── models/               # Mongoose Schemas (Question, Character, TestResult)
│   ├── routes/               # API Endpoints (/api/tests, /api/personalities)
│   └── seeders/              # Automatic DB Seeding Data
│
└── Testdi_Frontend/          # Next.js App Router
    ├── src/
    │   ├── api/              # API Client (Axios / Fetch)
    │   ├── app/              # Next.js Pages (/, /test, /about, /personality/[id])
    │   ├── components/       # Reusable UI Components
    │   │   ├── 3d/           # 3D Bear Card Components
    │   │   ├── personality/  # Dimension Explorer, Scoreboard & Cards
    │   │   └── result/       # SBTI Result Dashboard & Flip Card
    │   └── lib/              # Dimension Dictionary & Witty Descriptions
```

---

## 📜 License
Dự án được phát triển cho mục đích học tập & hiển thị Portfolio. Tất cả bản quyền giao diện thuộc về **TESTDII**.

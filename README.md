# BABÉ 26 — The Running Babes

Landing page cho sự kiện chạy bộ đầu tiên của BABÉ Laboratorios tại Việt Nam. 6 km Thủ Thiêm · 10.05.2026. Break the loop.

---

## Truy cập Production

| Mục | Giá trị |
|---|---|
| **Landing page** | https://34.27.241.13.nip.io |
| **Admin dashboard** | https://34.27.241.13.nip.io/admin |
| **Admin username** | `admin` |
| **Admin password** | `g8CnybNdm0pN8cls7aKdsmck` |

## Hạ tầng GCP

| Resource | Chi tiết |
|---|---|
| **GCP Project** | `deploy-app-web-494904` |
| **VM** | `landing-vm` — e2-small, zone `us-central1-a` |
| **VM External IP** | `34.27.241.13` (static) |
| **Cloud SQL** | `landing-db` — MySQL 8.0, db-f1-micro, region `us-central1` |
| **Cloud SQL IP** | `34.30.22.222` |
| **DB name / user** | `landing_db` / `app_user` |
| **Chi phí ước tính** | ~$23/tháng (VM $13 + Cloud SQL $10) |

### Kiến trúc production

```
Internet → Caddy (HTTPS/TLS auto)
               ├── /api/*  →  Spring Boot API (:8080)
               └── /*      →  Nginx + React   (:80)
                                    │
                               Cloud SQL MySQL
```

### Deploy / Cập nhật

```bash
bash deploy.sh   # ~4-5 phút, upload ~330KB
```

### SSH vào VM

```bash
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904
# Xem logs trên VM:
cd ~/app && docker compose -f docker-compose.prod.yml logs -f api
```

### Kết nối Cloud SQL

```bash
gcloud sql connect landing-db --user=app_user --database=landing_db --project=deploy-app-web-494904
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3.2 + Java 17 + Maven |
| Database | MySQL 8.0 + Spring Data JPA |
| DevOps | Docker + docker-compose |

## Features

- Landing page đầy đủ các section: Navbar, Marquee, Hero, Live Counter, Journey (3 steps), UGC Challenge, Marathon, Trade-in, Why BABÉ, FAQ, Footer CTA
- Inner pages: Về BABÉ, Liên hệ, Chính sách bảo mật, Điều khoản sử dụng
- Đăng ký UGC Challenge — submissions saved to MySQL
- Đặt slot soi da miễn phí tại finish line
- Đăng ký nhận newsletter
- Countdown timer đếm ngược đến ngày chạy 10/05/2026
- Leaflet route map với animation player
- FAQ accordion với toggle animation
- Scroll fade-up animations
- Responsive design

## Quick Start

### Option A: Docker (recommended)

```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

### Option B: Local Development

**Database**
```bash
docker run --name landing_db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=landing_db \
  -p 3306:3306 -d mysql:8.0
```

**Backend**
```bash
cd backend
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Gửi liên hệ |
| POST | `/api/newsletter/subscribe` | Đăng ký newsletter |
| DELETE | `/api/newsletter/unsubscribe/{email}` | Hủy đăng ký newsletter |
| POST | `/api/ugc/register` | Đăng ký UGC Challenge |
| POST | `/api/slot/book` | Đặt slot soi da |

### Example: Submit Contact Form

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Thị Lan",
    "email": "lan@example.com",
    "subject": "Hỏi về UGC Challenge",
    "message": "Tôi muốn biết thêm chi tiết về cách tham gia."
  }'
```

### Example: UGC Registration

```bash
curl -X POST http://localhost:8080/api/ugc/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Thị Lan",
    "phone": "0901234567",
    "handle": "@lan_runner"
  }'
```

### Example: Slot Booking

```bash
curl -X POST http://localhost:8080/api/slot/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Thị Lan",
    "phone": "0901234567"
  }'
```

## Project Structure

```
landing-page/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/app/
│       ├── LandingPageApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/
│       │   ├── ContactController.java
│       │   ├── NewsletterController.java
│       │   ├── UGCRegistrationController.java
│       │   └── SlotBookingController.java
│       ├── dto/
│       ├── entity/
│       ├── exception/GlobalExceptionHandler.java
│       ├── repository/
│       └── service/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── MarqueeBar.tsx
│       │   ├── Hero.tsx
│       │   ├── LiveCounter.tsx
│       │   ├── Journey.tsx
│       │   ├── UGCChallenge.tsx
│       │   ├── Marathon.tsx
│       │   ├── TradeIn.tsx
│       │   ├── WhyBabe.tsx
│       │   ├── FAQ.tsx
│       │   ├── FooterCTA.tsx
│       │   ├── RouteMapModal.tsx
│       │   ├── SuccessModal.tsx
│       │   └── SlotModal.tsx
│       ├── pages/
│       │   ├── AboutPage.tsx
│       │   ├── ContactPage.tsx
│       │   ├── PolicyPage.tsx
│       │   └── TermsPage.tsx
│       ├── services/api.ts
│       └── types/index.ts
├── docker-compose.yml
└── README.md
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--g700` | #6FA234 | Primary green |
| `--g641` | #74A641 | Hover green |
| `--g83` | #9ABA83 | Text accent |
| `--ink` | #1A1A1A | Dark text/background |
| `--paper` | #FBFAF6 | Light section background |
| `--cream` | #F4F1EA | Trade-in section |

## License

© 2026 Laboratorios BABÉ. All rights reserved.

---

## Quy trình chỉnh sửa và deploy

```
1. Sửa code (frontend hoặc backend)
        ↓
2. Test local
        ↓
3. bash deploy.sh
```

### Chi tiết từng bước

**Bước 1 — Sửa code**
- Frontend (giao diện): sửa file trong `frontend/src/`
- Backend (API/logic): sửa file trong `backend/src/`

**Bước 2 — Test local**
```bash
docker compose up --build
# Kiểm tra tại http://localhost:3000
```

**Bước 3 — Deploy lên production**
```bash
bash deploy.sh
# Tự động: upload → build Docker trên VM → restart containers
# Thời gian: ~4-5 phút
# URL sau deploy: https://34.27.241.13.nip.io
```

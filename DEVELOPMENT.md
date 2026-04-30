# Hướng Dẫn Sửa Source Code

> Đọc file này mỗi khi muốn sửa giao diện, thêm tính năng, hoặc thay đổi logic. Làm đúng thứ tự: **sửa → test local → deploy**.

---

## Mục lục

1. [Cấu trúc project](#1-cấu-trúc-project)
2. [Chạy môi trường local](#2-chạy-môi-trường-local)
3. [Sửa Frontend (giao diện)](#3-sửa-frontend-giao-diện)
4. [Sửa Backend (API)](#4-sửa-backend-api)
5. [Quy trình test và deploy](#5-quy-trình-test-và-deploy)
6. [Các thay đổi phổ biến](#6-các-thay-đổi-phổ-biến)

---

## 1. Cấu trúc project

```
landing-page/
│
├── frontend/                         ← React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/               ← Các section của landing page
│       │   ├── Navbar.tsx
│       │   ├── Hero.tsx              ← Banner đầu trang
│       │   ├── Journey.tsx           ← Section "Hành trình"
│       │   ├── UGCChallenge.tsx      ← Section đăng ký UGC
│       │   ├── Marathon.tsx          ← Section thông tin marathon
│       │   ├── TradeIn.tsx           ← Section Trade-in
│       │   ├── WhyBabe.tsx           ← Section "Tại sao BABÉ"
│       │   ├── FAQ.tsx               ← Câu hỏi thường gặp
│       │   ├── FooterCTA.tsx         ← Footer + CTA
│       │   ├── RouteMapModal.tsx     ← Bản đồ lộ trình
│       │   └── ProtectedRoute.tsx    ← Guard route admin
│       │
│       ├── pages/                    ← Các trang riêng biệt
│       │   ├── AdminPage.tsx         ← Trang quản trị
│       │   ├── AdminLoginPage.tsx    ← Trang đăng nhập admin
│       │   ├── AboutPage.tsx
│       │   ├── ContactPage.tsx
│       │   ├── PolicyPage.tsx
│       │   └── TermsPage.tsx
│       │
│       ├── services/
│       │   ├── api.ts                ← Tất cả API calls (axios)
│       │   └── auth.ts               ← Quản lý JWT token
│       │
│       ├── types/index.ts            ← TypeScript interfaces
│       ├── App.tsx                   ← Routing chính
│       └── index.css                 ← Global styles + animations
│
├── backend/                          ← Spring Boot + Java 17
│   └── src/main/java/com/app/
│       ├── controller/               ← REST endpoints
│       │   ├── AdminController.java
│       │   ├── AuthController.java
│       │   ├── ContactController.java
│       │   ├── NewsletterController.java
│       │   ├── UGCRegistrationController.java
│       │   ├── SlotBookingController.java
│       │   └── PageViewController.java
│       │
│       ├── service/                  ← Business logic
│       ├── entity/                   ← Database models (JPA)
│       ├── dto/                      ← Request/Response objects
│       ├── repository/               ← Database queries
│       ├── config/                   ← CORS, Security config
│       └── security/                 ← JWT filter & service
│
├── docker-compose.yml                ← Local dev (có DB)
├── docker-compose.prod.yml           ← Production (không có DB)
├── deploy.sh                         ← Script deploy lên GCP
└── .env.prod                         ← Secrets production (KHÔNG commit)
```

---

## 2. Chạy môi trường local

### Yêu cầu cài sẵn
- Docker Desktop đang chạy
- Node.js 20+ (`node --version`)
- Java 17+ (`java --version`)
- Maven (`mvn --version`)

### Cách 1: Docker Compose (đơn giản nhất)

```bash
cd /home/phuong/Documents/test/landing-page

# Lần đầu hoặc sau khi sửa code
docker compose up --build

# Lần sau (không cần build lại nếu không sửa)
docker compose up
```

Mở browser:
- **Landing page:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (username: `admin`, password: `changeme`)
- **API:** http://localhost:8080

Dừng lại:
```bash
docker compose down
```

---

### Cách 2: Chạy riêng từng phần (nhanh hơn khi dev)

Cách này giúp thấy thay đổi ngay lập tức mà không cần rebuild Docker.

**Terminal 1 — Chạy Database:**
```bash
cd /home/phuong/Documents/test/landing-page
docker compose up db
# Đợi thấy "ready for connections" rồi để terminal này chạy
```

**Terminal 2 — Chạy Backend:**
```bash
cd /home/phuong/Documents/test/landing-page/backend
mvn spring-boot:run
# Đợi thấy "Started LandingPageApplication"
# API chạy ở http://localhost:8080
```

**Terminal 3 — Chạy Frontend:**
```bash
cd /home/phuong/Documents/test/landing-page/frontend
npm install        # chỉ cần lần đầu
npm run dev
# Frontend chạy ở http://localhost:5173
# Tự reload khi sửa file — KHÔNG cần restart
```

> **Mẹo:** Khi dùng Cách 2, sửa file `.tsx` sẽ thấy thay đổi ngay trong trình duyệt (Hot Module Replacement). Không cần refresh tay.

---

## 3. Sửa Frontend (giao diện)

### Công cụ cần biết
- **Tailwind CSS** — class-based styling. Xem docs: https://tailwindcss.com/docs
- **TypeScript** — có type checking, IDE sẽ gợi ý
- **React** — component-based UI

### 3.1 Sửa text, màu sắc, hình ảnh

Mỗi section là một file `.tsx` trong `frontend/src/components/`. Mở file tương ứng và sửa trực tiếp.

Ví dụ — sửa tiêu đề Hero:
```bash
# Mở file
code frontend/src/components/Hero.tsx
# Hoặc
nano frontend/src/components/Hero.tsx
```

Tìm đoạn text cần sửa và thay. Nếu đang chạy `npm run dev`, browser tự cập nhật ngay.

**Màu sắc thường dùng trong project:**
| Tên | Mã màu | Dùng cho |
|---|---|---|
| Pink chính | `pink-600` / `#db2777` | Button, highlight |
| Nền sáng | `gray-50` / `gray-100` | Background section |
| Text tối | `gray-900` / `gray-800` | Tiêu đề |
| Text phụ | `gray-500` / `gray-600` | Mô tả |

### 3.2 Thêm section mới vào landing page

**Bước 1:** Tạo file component mới:
```bash
# Tạo file
touch frontend/src/components/TenSection.tsx
```

**Bước 2:** Viết component (dùng file có sẵn làm mẫu):
```tsx
// frontend/src/components/TenSection.tsx
export default function TenSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900">Tiêu đề</h2>
        <p className="mt-4 text-gray-600">Nội dung...</p>
      </div>
    </section>
  )
}
```

**Bước 3:** Thêm vào `App.tsx`:
```tsx
// frontend/src/App.tsx
import TenSection from './components/TenSection'

// Trong function HomePage(), thêm vào vị trí muốn hiển thị:
<TenSection />
```

### 3.3 Sửa form (thêm/bớt trường)

Ví dụ thêm trường "Số điện thoại" vào form Contact:

**Frontend** — `frontend/src/components/FooterCTA.tsx` (hoặc `ContactPage.tsx`):
```tsx
// Thêm state
const [phone, setPhone] = useState('')

// Thêm input trong JSX
<input
  type="tel"
  placeholder="Số điện thoại"
  value={phone}
  onChange={e => setPhone(e.target.value)}
  className="w-full border rounded px-3 py-2"
/>

// Thêm vào object gửi đi
await contactApi.submit({ name, email, phone, message })
```

**Types** — `frontend/src/types/index.ts`:
```ts
export interface ContactRequest {
  name: string
  email: string
  phone?: string   // thêm dòng này (? = không bắt buộc)
  message: string
}
```

**Backend** — `backend/src/main/java/com/app/dto/ContactRequest.java`:
```java
private String phone;  // thêm field này
```

### 3.4 Sửa trang Admin

File: `frontend/src/pages/AdminPage.tsx`

- Thêm cột mới vào bảng: tìm `<th>` và `<td>` trong phần render của tab tương ứng
- Thêm tab mới: thêm vào mảng `tabs` và thêm case trong phần render
- Sửa stat cards: tìm `<StatCard>` components

### 3.5 Sửa màu chủ đề toàn bộ

File: `frontend/src/index.css` — chứa CSS variables và animations

File `tailwind.config.js` nếu muốn thêm màu custom.

---

## 4. Sửa Backend (API)

### 4.1 Thêm endpoint mới

**Bước 1:** Thêm method vào Controller:
```java
// backend/src/main/java/com/app/controller/AdminController.java
@GetMapping("/export/contacts")
public ResponseEntity<ApiResponse<List<AdminContact>>> exportContacts() {
    return ResponseEntity.ok(ApiResponse.success("OK", adminService.getAllContacts()));
}
```

**Bước 2:** Thêm logic vào Service nếu cần (trong `service/` folder)

**Bước 3:** Thêm API call ở frontend:
```ts
// frontend/src/services/api.ts
exportContacts: () =>
  api.get<ApiResponse<AdminContact[]>>('/api/admin/export/contacts').then(r => r.data),
```

### 4.2 Thêm cột mới vào database

**Bước 1:** Thêm field vào Entity:
```java
// backend/src/main/java/com/app/entity/Contact.java
@Column
private String phone;
```

> JPA với `ddl-auto=update` sẽ tự thêm cột vào DB khi restart. Không cần viết SQL migration.

**Bước 2:** Thêm vào DTO tương ứng (trong `dto/` folder)

**Bước 3:** Cập nhật Service để map field mới

### 4.3 Sửa validation

```java
// Trong DTO, dùng annotation Jakarta Validation:
@NotBlank(message = "Tên không được để trống")
private String name;

@Email(message = "Email không hợp lệ")
@NotBlank
private String email;

@Size(min = 10, max = 500, message = "Tin nhắn từ 10-500 ký tự")
private String message;
```

### 4.4 Test API nhanh bằng curl

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"changeme"}'

# Lấy token rồi test admin endpoint
TOKEN="paste_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/dashboard

# Test form public
curl -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","message":"Hello"}'
```

---

## 5. Quy trình test và deploy

### Bước 1: Test local

```bash
# Đảm bảo không có lỗi TypeScript
cd frontend && npm run build

# Đảm bảo backend compile được
cd backend && mvn clean package -DskipTests
```

Nếu cả 2 lệnh trên không báo lỗi → an toàn để deploy.

### Bước 2: Test thủ công trên browser

Dùng `docker compose up --build` rồi kiểm tra:
- [ ] Landing page hiển thị đúng ở http://localhost:3000
- [ ] Các section hiển thị đúng, không vỡ layout
- [ ] Form submit được (thử submit 1 form bất kỳ)
- [ ] Admin login hoạt động ở http://localhost:3000/admin
- [ ] Data trong admin dashboard hiển thị đúng

### Bước 3: Commit code

```bash
cd /home/phuong/Documents/test/landing-page

# Xem những gì đã thay đổi
git diff --stat

# Stage và commit
git add -A
git commit -m "mô tả thay đổi ngắn gọn"
```

### Bước 4: Deploy lên production

```bash
cd /home/phuong/Documents/test/landing-page
bash deploy.sh
```

Đợi ~4-5 phút. Sau đó kiểm tra https://34.27.241.13.nip.io

---

## 6. Các thay đổi phổ biến

### Đổi ngày sự kiện (countdown timer)

File: `frontend/src/components/Hero.tsx` hoặc `LiveCounter.tsx`

Tìm dòng có `new Date('2026-05-10')` và thay ngày mới.

### Đổi thông tin liên lạc / địa chỉ

Tìm trong các file components với từ khóa email/phone/address. Thường nằm trong `FooterCTA.tsx`, `AboutPage.tsx`, `ContactPage.tsx`.

### Thêm hình ảnh mới

**Bước 1:** Copy ảnh vào `frontend/src/assets/`

**Bước 2:** Import và dùng trong component:
```tsx
import myImage from '../assets/my-image.jpg'

// Trong JSX:
<img src={myImage} alt="mô tả" className="w-full rounded-lg" />
```

### Sửa FAQ

File: `frontend/src/components/FAQ.tsx`

Tìm mảng chứa các câu hỏi (thường là `const faqs = [...]`) và sửa trực tiếp.

### Thêm trang mới

**Bước 1:** Tạo file page:
```bash
touch frontend/src/pages/NewPage.tsx
```

**Bước 2:** Viết component page

**Bước 3:** Thêm route vào `frontend/src/App.tsx`:
```tsx
import NewPage from './pages/NewPage'

// Trong TrackedRoutes:
<Route path="/new-page" element={<NewPage />} />
```

### Đổi tiêu đề tab trình duyệt

File: `frontend/index.html` — sửa thẻ `<title>` và `<meta name="description">`

### Đổi màu nút bấm toàn bộ

Dùng Find & Replace trong editor, tìm `bg-pink-600` thay bằng màu mới (ví dụ `bg-blue-600`).

---

## Ghi chú quan trọng

- **Không sửa trực tiếp trên VM production** — luôn sửa local rồi `bash deploy.sh`
- **Không commit `.env.prod`** — file này chứa passwords, đã được `.gitignore`
- **Luôn test `npm run build` trước khi deploy** — tránh đưa lỗi TypeScript lên production
- **Backup DB trước khi thay đổi cấu trúc database** — xem `MANAGEMENT.md` mục 4.2

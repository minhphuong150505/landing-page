# Implementation Guide: Admin Auth + GCP Deploy

> Tài liệu này dành cho model/agent thực thi. Đọc kỹ rồi làm tuần tự **Phần A → Phần B**. Mỗi bước có file path tuyệt đối, code mẫu, và lệnh verify. KHÔNG bỏ qua bước verify.

## Bối cảnh dự án

Project là full-stack 3-tier: React (Vite + TS + Tailwind) + Spring Boot (Java 17 + Maven) + MySQL.
- Working dir: `/home/phuong/Documents/test/landing-page`
- Trang admin `/admin` (`frontend/src/pages/AdminPage.tsx`) hiện **public**, có TODO banner ở dòng 126.
- Backend admin endpoints (`backend/src/main/java/com/app/controller/AdminController.java`) **không có Spring Security**.
- `pom.xml` chưa có `spring-boot-starter-security` hay JWT lib.
- CORS hardcode `localhost` trong `backend/src/main/java/com/app/config/CorsConfig.java`.

GCP target:
- Project ID: `deploy-app-web-494904`
- Region: `us-central1`, Zone: `us-central1-a`
- Phương án: **Compute Engine VM (e2-small) + Cloud SQL MySQL (db-f1-micro)** + Caddy reverse proxy với HTTPS qua domain nip.io.

---

# Phần A — Thêm JWT Admin Authentication

**Mô hình**: 1 admin account duy nhất, username/password lưu trong env var (không cần users table). JWT HS256, 24h expiry. Frontend lưu token trong `localStorage`, gắn `Authorization: Bearer <token>` qua axios interceptor.

## A1. Backend dependencies

### File: `backend/pom.xml`
Thêm vào `<dependencies>`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
```

## A2. Backend properties

### File: `backend/src/main/resources/application.properties`
Thêm vào cuối file:
```properties
app.admin.username=${ADMIN_USERNAME:admin}
app.admin.password=${ADMIN_PASSWORD:changeme}
app.jwt.secret=${JWT_SECRET:dev-secret-please-override-at-least-32-characters-long}
app.jwt.expiration-ms=86400000
app.cors.origins=${APP_CORS_ORIGINS:http://localhost:3000,http://localhost:5173,http://localhost:80}
```

### File: `backend/src/main/resources/application-docker.properties`
Thêm cùng 5 dòng `app.*` như trên.

## A3. Backend code

### File mới: `backend/src/main/java/com/app/dto/LoginRequest.java`
```java
package com.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank private String username;
    @NotBlank private String password;
}
```

### File mới: `backend/src/main/java/com/app/dto/LoginResponse.java`
```java
package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private long expiresAt;
    private String username;
}
```

### File mới: `backend/src/main/java/com/app/security/JwtService.java`
```java
package com.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration-ms}") private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(username)
                .claim("role", "ADMIN")
                .issuedAt(now)
                .expiration(exp)
                .signWith(key())
                .compact();
    }

    public long expiresAt() { return System.currentTimeMillis() + expirationMs; }

    public String parseUsername(String token) {
        Claims claims = Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }
}
```

### File mới: `backend/src/main/java/com/app/security/JwtAuthFilter.java`
```java
package com.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String username = jwtService.parseUsername(header.substring(7));
                var auth = new UsernamePasswordAuthenticationToken(
                        username, null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ignored) { /* invalid token => unauth */ }
        }
        chain.doFilter(req, res);
    }
}
```

### File mới: `backend/src/main/java/com/app/config/SecurityConfig.java`
```java
package com.app.config;

import com.app.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(c -> {})
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/contact/**", "/api/newsletter/**",
                                 "/api/ugc/**", "/api/slot/**", "/api/tracking/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

### File mới: `backend/src/main/java/com/app/controller/AuthController.java`
```java
package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.LoginRequest;
import com.app.dto.LoginResponse;
import com.app.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.password}") private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        if (!adminUsername.equals(req.getUsername()) || !adminPassword.equals(req.getPassword())) {
            return ResponseEntity.status(401).body(ApiResponse.error("Sai tên đăng nhập hoặc mật khẩu"));
        }
        String token = jwtService.generate(adminUsername);
        return ResponseEntity.ok(ApiResponse.ok(
                new LoginResponse(token, jwtService.expiresAt(), adminUsername),
                "Đăng nhập thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, String>>> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("username", auth.getName(), "role", "ADMIN"), "OK"));
    }
}
```

> **CHÚ Ý**: kiểm tra `com.app.dto.ApiResponse` đã có 2 static method `ok(data, message)` và `error(message)`. Nếu khác signature, đọc file `backend/src/main/java/com/app/dto/ApiResponse.java` và điều chỉnh cho khớp.

### Sửa: `backend/src/main/java/com/app/config/CorsConfig.java`
Thay danh sách hardcode bằng đọc từ property `app.cors.origins`. Đọc file hiện tại trước rồi sửa: thay `setAllowedOrigins(List.of("http://localhost:3000", ...))` → đọc `@Value("${app.cors.origins}") String origins` rồi `setAllowedOrigins(Arrays.asList(origins.split(",")))`. Đảm bảo `setAllowedHeaders(List.of("*"))` hoặc thêm `"Authorization"`.

## A4. Frontend code

### File: `frontend/src/types/index.ts`
Thêm vào cuối:
```ts
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  expiresAt: number;
  username: string;
}
```

### File mới: `frontend/src/services/auth.ts`
```ts
const TOKEN_KEY = 'admin_token';
const EXPIRES_KEY = 'admin_token_exp';

export const auth = {
  setToken(token: string, expiresAt: number) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, String(expiresAt));
  },
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0);
    if (!token || Date.now() >= exp) {
      this.clear();
      return null;
    }
    return token;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  },
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};
```

### Sửa: `frontend/src/services/api.ts`
- Đọc file hiện tại để giữ nguyên `baseURL` và các API namespace.
- Thêm sau khi tạo axios instance:
```ts
import { auth } from './auth';

apiClient.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      auth.clear();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);
```
- Thêm `authApi` namespace:
```ts
export const authApi = {
  login: (req: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', req).then(r => r.data),
  me: () => apiClient.get<ApiResponse<{username: string; role: string}>>('/api/auth/me').then(r => r.data),
};
```
(Import `LoginRequest`, `LoginResponse`, `ApiResponse` từ `../types`.)

### File mới: `frontend/src/components/ProtectedRoute.tsx`
```tsx
import { Navigate } from 'react-router-dom';
import { auth } from '../services/auth';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  return auth.isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
}
```

### File mới: `frontend/src/pages/AdminLoginPage.tsx`
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { auth } from '../services/auth';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      if (res.success && res.data) {
        auth.setToken(res.data.token, res.data.expiresAt);
        nav('/admin', { replace: true });
      } else {
        setErr(res.message || 'Đăng nhập thất bại');
      }
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Username"
               value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password"
               value={password} onChange={e => setPassword(e.target.value)} required />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button type="submit" disabled={loading}
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
```

### Sửa: `frontend/src/App.tsx`
- Import `AdminLoginPage` và `ProtectedRoute`.
- Thêm route `<Route path="/admin/login" element={<AdminLoginPage />} />`
- Bọc route admin: `<Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />`

### Sửa: `frontend/src/pages/AdminPage.tsx`
- **Xóa banner TODO** ở dòng ~126 (block `<div className="...yellow..."> cần xác thực... </div>`).
- Thêm nút logout góc trên phải (cạnh tiêu đề dashboard):
```tsx
import { auth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
// ...trong component:
const nav = useNavigate();
const logout = () => { auth.clear(); nav('/admin/login'); };
// nút:
<button onClick={logout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
```

## A5. Verify Phần A (LOCAL — bắt buộc trước khi sang Phần B)

```bash
cd /home/phuong/Documents/test/landing-page/backend
ADMIN_USERNAME=admin ADMIN_PASSWORD=test123 \
  JWT_SECRET=$(openssl rand -hex 32) \
  mvn spring-boot:run
```

Trong terminal khác:
```bash
# 1. Endpoint admin chưa login → 401/403
curl -i http://localhost:8080/api/admin/dashboard
# 2. Login lấy token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"test123"}' | jq -r .data.token)
echo $TOKEN
# 3. Gọi admin với token → 200
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/dashboard
# 4. Form public vẫn hoạt động
curl -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"a@b.c","message":"hi"}'
```

Frontend:
```bash
cd /home/phuong/Documents/test/landing-page/frontend && npm run dev
```
- Mở `http://localhost:5173/admin` → tự redirect `/admin/login`
- Login `admin/test123` → vào dashboard, data load được
- F12 → Application → localStorage có `admin_token`
- Bấm "Đăng xuất" → quay về login, token bị xóa

Nếu mọi check pass → commit toàn bộ thay đổi Phần A trước khi sang Phần B.

---

# Phần B — Deploy lên GCP

> Tất cả lệnh `gcloud` chạy từ máy local. Lệnh trên VM được đánh dấu **[ON VM]**.

## B1. Generate secrets (lưu lại — sẽ dùng nhiều lần)
```bash
DB_ROOT_PW=$(openssl rand -base64 24)
DB_APP_PW=$(openssl rand -base64 24)
JWT_SECRET=$(openssl rand -hex 32)
ADMIN_PW=$(openssl rand -base64 18)
echo "DB_ROOT_PW=$DB_ROOT_PW"
echo "DB_APP_PW=$DB_APP_PW"
echo "JWT_SECRET=$JWT_SECRET"
echo "ADMIN_PW=$ADMIN_PW"
# CHÉP RA NƠI AN TOÀN — sẽ cần lại
```

## B2. Provision GCP

```bash
gcloud config set project deploy-app-web-494904
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

gcloud services enable compute.googleapis.com sqladmin.googleapis.com
```

### Cloud SQL
```bash
gcloud sql instances create landing-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password="$DB_ROOT_PW" \
  --storage-size=10GB \
  --storage-type=HDD \
  --backup-start-time=03:00

gcloud sql databases create landing_db --instance=landing-db
gcloud sql users create app_user --instance=landing-db --password="$DB_APP_PW"
```

### Static IP + VM
```bash
gcloud compute addresses create landing-ip --region=us-central1
STATIC_IP=$(gcloud compute addresses describe landing-ip --region=us-central1 --format='value(address)')
echo "STATIC_IP=$STATIC_IP"

gcloud compute instances create landing-vm \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=http-server,https-server \
  --boot-disk-size=20GB \
  --address=$STATIC_IP

gcloud compute firewall-rules create allow-http-https \
  --allow=tcp:80,tcp:443 \
  --target-tags=http-server,https-server \
  --source-ranges=0.0.0.0/0
```

### Allow VM IP vào Cloud SQL
```bash
gcloud sql instances patch landing-db --authorized-networks=$STATIC_IP
DB_HOST=$(gcloud sql instances describe landing-db --format='value(ipAddresses[0].ipAddress)')
echo "DB_HOST=$DB_HOST"
```

## B3. Bootstrap VM
```bash
gcloud compute ssh landing-vm --zone=us-central1-a --command='
  sudo apt-get update -y && \
  sudo apt-get install -y docker.io docker-compose-plugin git && \
  sudo systemctl enable --now docker && \
  sudo usermod -aG docker $USER
'
```

## B4. Tạo file deploy ở local repo

### File mới: `Caddyfile`
```
{$DOMAIN} {
    encode gzip
    handle /api/* {
        reverse_proxy api:8080
    }
    handle {
        reverse_proxy web:80
    }
}
```

### File mới: `docker-compose.prod.yml`
```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:mysql://${DB_HOST}:3306/landing_db?useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: app_user
      SPRING_DATASOURCE_PASSWORD: ${DB_APP_PW}
      ADMIN_USERNAME: ${ADMIN_USERNAME}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      APP_CORS_ORIGINS: https://${DOMAIN}
    restart: unless-stopped

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://${DOMAIN}
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    environment:
      DOMAIN: ${DOMAIN}
    depends_on: [api, web]
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:
```

> **Cần chỉnh `application-docker.properties`** để đọc `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` (Spring Boot tự đọc env này nếu file properties dùng property tương ứng — kiểm tra `spring.datasource.url=${SPRING_DATASOURCE_URL:...}`. Nếu file đang hardcode `jdbc:mysql://db:3306/...`, sửa thành `${SPRING_DATASOURCE_URL:jdbc:mysql://db:3306/landing_db}` v.v.).

> **Frontend Dockerfile** phải dùng `ARG VITE_API_URL` rồi truyền vào `RUN npm run build`. Đọc `frontend/Dockerfile` hiện tại; nếu chưa có thì thêm:
> ```Dockerfile
> ARG VITE_API_URL
> ENV VITE_API_URL=$VITE_API_URL
> RUN npm run build
> ```
> trước stage nginx.

### File mới: `.env.prod.example`
```
DOMAIN=REPLACE_WITH_VM_IP.nip.io
DB_HOST=REPLACE_WITH_CLOUD_SQL_IP
DB_APP_PW=REPLACE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=REPLACE
JWT_SECRET=REPLACE
```

### File mới: `deploy.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
ZONE=us-central1-a
VM=landing-vm

echo "[1/3] Sync source to VM..."
gcloud compute ssh $VM --zone=$ZONE --command='mkdir -p ~/app'
gcloud compute scp --zone=$ZONE --recurse \
  backend frontend Caddyfile docker-compose.prod.yml .env.prod \
  $VM:~/app/

echo "[2/3] Build & restart..."
gcloud compute ssh $VM --zone=$ZONE --command='
  cd ~/app && \
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
'

echo "[3/3] Status..."
gcloud compute ssh $VM --zone=$ZONE --command='docker ps'
```
```bash
chmod +x deploy.sh
```

### Sửa `.gitignore` — đảm bảo có:
```
.env.prod
```

## B5. First deploy

```bash
# Tạo .env.prod local từ template, fill các giá trị từ B1+B2
cp .env.prod.example .env.prod
# DOMAIN=<STATIC_IP>.nip.io  (vd: 34.123.45.67.nip.io)
# DB_HOST=<từ output B2>
# Điền các secret từ B1
nano .env.prod

./deploy.sh
```

**Đợi 1-2 phút** để Caddy xin Let's Encrypt cert.

## B6. Verify production

```bash
# 1. HTTPS hoạt động + cert hợp lệ
curl -I https://<STATIC_IP>.nip.io

# 2. Health endpoint backend
curl https://<STATIC_IP>.nip.io/actuator/health

# 3. Admin endpoint chưa login → 401/403
curl -i https://<STATIC_IP>.nip.io/api/admin/dashboard

# 4. Login OK
curl -X POST https://<STATIC_IP>.nip.io/api/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"username\":\"admin\",\"password\":\"$ADMIN_PW\"}"
```

Mở browser:
- `https://<STATIC_IP>.nip.io` → landing page hiển thị, ổ khóa HTTPS xanh
- Submit form contact → check DB:
  ```bash
  gcloud sql connect landing-db --user=app_user --database=landing_db
  # nhập password DB_APP_PW
  > SELECT id, name, email FROM contacts ORDER BY id DESC LIMIT 5;
  ```
- `https://<STATIC_IP>.nip.io/admin` → login form → đăng nhập → dashboard load data ✅

## B7. Troubleshooting

```bash
# Logs container
gcloud compute ssh landing-vm --zone=us-central1-a \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml logs -f api'

# Caddy logs (nếu HTTPS không lên)
gcloud compute ssh landing-vm --zone=us-central1-a \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml logs caddy'

# Restart 1 service
gcloud compute ssh landing-vm --zone=us-central1-a \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml restart api'
```

Vấn đề phổ biến:
- **Caddy không xin được cert**: kiểm tra firewall port 80 mở (Let's Encrypt cần HTTP-01 challenge), domain nip.io trỏ đúng IP.
- **Backend không kết nối Cloud SQL**: kiểm tra `gcloud sql instances describe landing-db --format='value(settings.ipConfiguration.authorizedNetworks)'` có IP VM, và `SPRING_DATASOURCE_URL` đúng host.
- **CORS lỗi**: `APP_CORS_ORIGINS` phải khớp domain frontend (`https://...nip.io`, không có trailing slash).
- **Frontend gọi `localhost:8080`**: nghĩa là `VITE_API_URL` không được inject lúc build → kiểm tra `frontend/Dockerfile` có ARG/ENV đúng và rebuild với `--no-cache`.

---

## Chi phí ước tính
- VM e2-small: ~$13/tháng
- Cloud SQL db-f1-micro 10GB: ~$10/tháng
- Static IP đang gán VM: free
- **Total ~$23-25/tháng**

## Ghi chú bảo mật cuối
- KHÔNG commit `.env.prod`.
- Đổi `ADMIN_PASSWORD` định kỳ.
- Sau khi ổn định, có thể migrate secrets sang **Secret Manager** + cấp service account cho VM (phase 2).
- Cloud SQL hiện dùng public IP + IP allowlist; nâng cấp bảo mật sau bằng Private IP + VPC peering nếu cần.

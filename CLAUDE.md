# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Docker (local full stack)
```bash
docker-compose up --build        # Start all services (db :3308, API :8080, web :3000)
```

### Backend (Spring Boot + Java 17 + Maven)
```bash
cd backend
mvn spring-boot:run              # Dev server on :8080 (requires local MySQL on :3306)
mvn test                         # Run all tests
mvn test -Dtest=ClassName        # Run a single test class
mvn clean package -DskipTests    # Build JAR
```

### Frontend (React 18 + Vite + TypeScript + Tailwind)
```bash
cd frontend
npm install
npm run dev                      # Dev server on :5173 (proxies /api → :8080)
npm run build                    # TypeScript check + production build
npm run lint                     # ESLint on src/**/*.{ts,tsx}
```

### Deploy to production (GCP VM)
```bash
bash deploy.sh                   # Requires gcloud CLI authenticated, .env.prod present
```
`deploy.sh` tars the source (excluding `target/`, `node_modules/`, `dist/`, `.git`), uploads to the GCP VM (`landing-vm`, zone `us-central1-a`, project `deploy-app-web-494904`), then runs `docker compose -f docker-compose.prod.yml up -d --build`.

## Architecture

### Full-stack layout
3-tier Dockerized app: React SPA → Spring Boot REST API → MySQL 8.0.

- **Local** (`docker-compose.yml`): db + api + web (Nginx), no TLS. Frontend at :3000, API at :8080.
- **Production** (`docker-compose.prod.yml`): api + web (Nginx) + Caddy (reverse proxy). Caddy handles TLS automatically via Let's Encrypt, routes `/api/*` → `api:8080`, everything else → `web:80`. Domain is set via `DOMAIN` env var in `.env.prod`.

### Environment / secrets
`.env.prod` (not committed) provides: `DOMAIN`, `DB_HOST`, `DB_APP_PW`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

Local defaults in `application.properties`: `root:root` MySQL, `admin:changeme` admin credentials, a placeholder JWT secret. Override via env vars.

### Backend
- **Layered architecture**: `controller` → `service` → `repository` → `entity`. All controllers use `@RestController` + `@RequiredArgsConstructor`.
- **Response envelope**: All endpoints return `ApiResponse<T>` with `success`, `message`, `data` fields. `GlobalExceptionHandler` (@RestControllerAdvice) maps validation errors, `IllegalArgumentException`, and uncaught exceptions into this envelope.
- **Security**: Spring Security + stateless JWT (`JwtAuthFilter`). Public routes: `/api/auth/**`, `/api/contact/**`, `/api/newsletter/**`, `/api/ugc/**`, `/api/slot/**`, `/api/tracking/**`. Admin routes (`/api/admin/**`) require `ROLE_ADMIN`. Admin credentials are hardcoded via `app.admin.username` / `app.admin.password` env vars (no user table).
- **Email**: `EmailService` sends transactional email via the [Resend](https://resend.com) API (REST call via `RestTemplate`). Template at `src/main/resources/templates/ugc-confirmation.html`. Sending is `@Async` (configured in `AsyncConfig`). Set `resend.api-key` to enable; omitting it silently skips sending.
- **Database**: JPA `ddl-auto=update`. Local profile: `localhost:3306/landing_db`. Docker profile (`application-docker.properties`): `db:3306/landing_db` with `app_user`.

### Frontend
- **Routing**: `App.tsx` — homepage (`/`) is a single long-scrolling page of section components. Separate pages: `/about`, `/contact`, `/policy`, `/terms`, `/admin/login`, `/admin`.
- **API layer**: `src/services/api.ts` — single Axios instance with JWT interceptor (attaches Bearer token, redirects to `/admin/login` on 401). Exports: `contactApi`, `newsletterApi`, `ugcApi`, `slotApi`, `trackingApi`, `adminApi`, `authApi`.
- **Auth**: `src/services/auth.ts` manages JWT in localStorage. Admin token is set on login, cleared on 401.
- **Types**: All shared request/response interfaces in `src/types/index.ts`.
- **Styling**: Tailwind CSS + PostCSS. Custom animation utilities in `index.css`. Email templates use table-based inline styles (no CSS classes — Gmail strips `<style>` blocks on long emails).

### Email template constraint
`ugc-confirmation.html` must stay **under 102KB** — Gmail clips emails above this threshold, which strips the `<style>` block and breaks rendering. The template uses only inline styles and table-based layout (no flexbox, no CSS variables, no pseudo-elements).

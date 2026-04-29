# NexaTech Landing Page

A production-ready fullstack landing page with contact form and newsletter subscription.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3.2 + Java 17 + Maven |
| Database | MySQL 8.0 + Spring Data JPA |
| DevOps | Docker + docker-compose |

## Features

- Responsive landing page with Navbar, Hero, Features, About, Testimonials sections
- Contact form with validation — submissions saved to MySQL
- Newsletter subscription with duplicate-email protection
- REST API with global error handling and proper HTTP status codes
- Docker multi-stage builds for minimal image sizes

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
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| DELETE | `/api/newsletter/unsubscribe/{email}` | Unsubscribe |

### Example: Submit Contact Form

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "Hello, I would like to discuss a project."
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
│       ├── controller/ContactController.java
│       ├── controller/NewsletterController.java
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
│       ├── services/api.ts
│       └── types/index.ts
├── docker-compose.yml
└── README.md
```

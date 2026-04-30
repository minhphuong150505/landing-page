# Sổ Tay Quản Lý — BABÉ 26 Landing Page

> Tài liệu này hướng dẫn toàn bộ việc vận hành, theo dõi, và quản lý chi phí cho hệ thống đang chạy trên Google Cloud.

---

## Mục lục

1. [Thông tin truy cập nhanh](#1-thông-tin-truy-cập-nhanh)
2. [Quản lý Website](#2-quản-lý-website)
3. [Quản lý Server (VM)](#3-quản-lý-server-vm)
4. [Quản lý Database (Cloud SQL)](#4-quản-lý-database-cloud-sql)
5. [Quản lý Chi phí GCP](#5-quản-lý-chi-phí-gcp)
6. [Deploy & Cập nhật Code](#6-deploy--cập-nhật-code)
7. [Xử lý sự cố](#7-xử-lý-sự-cố)
8. [Bảo mật & Bảo trì định kỳ](#8-bảo-mật--bảo-trì-định-kỳ)

---

## 1. Thông tin truy cập nhanh

### Website
| | |
|---|---|
| **Landing page** | https://34.27.241.13.nip.io |
| **Admin dashboard** | https://34.27.241.13.nip.io/admin |
| **Admin username** | `admin` |
| **Admin password** | `g8CnybNdm0pN8cls7aKdsmck` |

### Google Cloud Console
| | |
|---|---|
| **GCP Console** | https://console.cloud.google.com/home/dashboard?project=deploy-app-web-494904 |
| **GCP Project ID** | `deploy-app-web-494904` |
| **GCP Account** | `nhuycuty11@gmail.com` |
| **Billing** | https://console.cloud.google.com/billing?project=deploy-app-web-494904 |

### Hạ tầng
| Resource | Tên | Zone/Region | IP |
|---|---|---|---|
| VM | `landing-vm` | `us-central1-a` | `34.27.241.13` (static) |
| Cloud SQL | `landing-db` | `us-central1` | `34.30.22.222` |

---

## 2. Quản lý Website

### 2.1 Xem dữ liệu người dùng từ Admin Dashboard

Truy cập **https://34.27.241.13.nip.io/admin** → đăng nhập → xem:

| Tab | Nội dung |
|---|---|
| **Contacts** | Form liên hệ từ khách — có thể cập nhật status (new/read/replied) |
| **Newsletter** | Danh sách email đăng ký nhận tin |
| **Slot Bookings** | Đặt slot soi da miễn phí — cập nhật status (pending/confirmed/cancelled) |
| **UGC** | Đăng ký tham gia UGC Challenge |
| **Stats cards** | Tổng số contacts, subscribers, bookings, UGC, lượt xem, unique visitors |
| **Biểu đồ** | Lượt truy cập 14 ngày gần nhất + top pages |

### 2.2 Xuất dữ liệu ra CSV (qua SQL)

```bash
# Kết nối Cloud SQL
gcloud sql connect landing-db --user=app_user --database=landing_db \
  --project=deploy-app-web-494904

# Sau khi kết nối, chạy các lệnh SQL sau:
```

```sql
-- Xem tất cả contacts
SELECT id, name, email, subject, status, created_at
FROM contacts ORDER BY created_at DESC;

-- Xem subscribers đang active
SELECT email, subscribed_at FROM newsletters WHERE active = true;

-- Xem slot bookings
SELECT id, name, phone, status, created_at
FROM slot_bookings ORDER BY created_at DESC;

-- Xem UGC registrations
SELECT id, name, email, platform, status, created_at
FROM ugc_registrations ORDER BY created_at DESC;

-- Thống kê tổng quan
SELECT
  (SELECT COUNT(*) FROM contacts) AS total_contacts,
  (SELECT COUNT(*) FROM newsletters WHERE active=true) AS active_subscribers,
  (SELECT COUNT(*) FROM slot_bookings) AS total_slots,
  (SELECT COUNT(*) FROM ugc_registrations) AS total_ugc;
```

### 2.3 Theo dõi lượt truy cập

Admin dashboard → tab **Visitor Stats** hiển thị:
- Lượt xem theo ngày (14 ngày gần nhất)
- Top trang được xem nhiều nhất

Xem trực tiếp qua SQL:
```sql
SELECT path, COUNT(*) AS views
FROM page_views
GROUP BY path
ORDER BY views DESC
LIMIT 20;

-- Lượt xem theo ngày
SELECT DATE(viewed_at) AS date, COUNT(*) AS views
FROM page_views
GROUP BY DATE(viewed_at)
ORDER BY date DESC
LIMIT 30;
```

---

## 3. Quản lý Server (VM)

### 3.1 SSH vào VM

```bash
gcloud compute ssh landing-vm \
  --zone=us-central1-a \
  --project=deploy-app-web-494904
```

### 3.2 Xem trạng thái containers

```bash
# SSH vào VM trước, sau đó:
cd ~/app
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Kết quả bình thường:
```
NAMES         STATUS                    PORTS
app-caddy-1   Up X hours                0.0.0.0:80->80, 0.0.0.0:443->443
app-web-1     Up X hours (healthy)      80/tcp
app-api-1     Up X hours (healthy)      8080/tcp
```

### 3.3 Xem logs

```bash
# API logs (xem lỗi backend)
docker compose -f docker-compose.prod.yml logs -f api

# Web logs (nginx)
docker compose -f docker-compose.prod.yml logs -f web

# Caddy logs (HTTPS/cert issues)
docker compose -f docker-compose.prod.yml logs -f caddy

# Xem 100 dòng gần nhất không follow
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### 3.4 Restart containers

```bash
# Restart tất cả
docker compose -f docker-compose.prod.yml restart

# Restart riêng API (khi API bị lỗi)
docker compose -f docker-compose.prod.yml restart api

# Restart riêng Caddy (khi HTTPS có vấn đề)
docker compose -f docker-compose.prod.yml restart caddy
```

### 3.5 Bật/tắt VM (tiết kiệm chi phí khi không dùng)

```bash
# Tắt VM (dừng tính phí VM, VẪN tính phí static IP ~$0.01/h và Cloud SQL)
gcloud compute instances stop landing-vm \
  --zone=us-central1-a --project=deploy-app-web-494904

# Bật lại VM
gcloud compute instances start landing-vm \
  --zone=us-central1-a --project=deploy-app-web-494904

# Xem trạng thái VM
gcloud compute instances describe landing-vm \
  --zone=us-central1-a --project=deploy-app-web-494904 \
  --format='value(status)'
```

> ⚠️ Sau khi bật lại VM, chạy `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d` trong `~/app` để khởi động lại containers (containers có `restart: unless-stopped` nên tự khởi động, nhưng nếu không thì chạy thủ công).

### 3.6 Xem tài nguyên VM

```bash
# CPU + RAM đang dùng
docker stats --no-stream

# Dung lượng disk
df -h /

# Xem disk các Docker images
docker system df
```

---

## 4. Quản lý Database (Cloud SQL)

### 4.1 Kết nối Cloud SQL

```bash
gcloud sql connect landing-db \
  --user=app_user \
  --database=landing_db \
  --project=deploy-app-web-494904
# Nhập password: fI3yI1rjfS8NpBpm3+JqAfuw05rClGax
```

### 4.2 Backup thủ công

```bash
# Tạo backup ngay lập tức
gcloud sql backups create \
  --instance=landing-db \
  --project=deploy-app-web-494904

# Xem danh sách backups
gcloud sql backups list \
  --instance=landing-db \
  --project=deploy-app-web-494904
```

> Cloud SQL tự backup hàng ngày lúc 03:00 UTC (đã cấu hình lúc tạo). Giữ 7 bản backup gần nhất.

### 4.3 Restore từ backup

```bash
# Xem ID backup cần restore
gcloud sql backups list --instance=landing-db --project=deploy-app-web-494904

# Restore (thay BACKUP_ID)
gcloud sql backups restore BACKUP_ID \
  --restore-instance=landing-db \
  --project=deploy-app-web-494904
```

> ⚠️ Restore sẽ **ghi đè toàn bộ dữ liệu hiện tại**. Tạo backup mới trước khi restore.

### 4.4 Xem dung lượng và trạng thái

```bash
gcloud sql instances describe landing-db \
  --project=deploy-app-web-494904 \
  --format='table(name,state,settings.dataDiskSizeGb,settings.tier)'
```

### 4.5 Tăng dung lượng disk (khi cần)

```bash
# Tăng lên 20GB (không thể giảm)
gcloud sql instances patch landing-db \
  --storage-size=20GB \
  --project=deploy-app-web-494904
```

---

## 5. Quản lý Chi phí GCP

### 5.1 Chi phí ước tính hàng tháng

| Resource | Loại | Chi phí/tháng |
|---|---|---|
| VM `landing-vm` | e2-small, us-central1 | ~$13 |
| Cloud SQL `landing-db` | db-f1-micro + 10GB HDD | ~$10 |
| Static IP `landing-ip` | Đang gán cho VM | Free |
| Network egress | ~1GB/tháng | <$1 |
| **Tổng** | | **~$23-25/tháng** |

### 5.2 Xem chi phí thực tế

Truy cập: https://console.cloud.google.com/billing?project=deploy-app-web-494904

Hoặc qua CLI:
```bash
# Xem billing summary (cần Billing Viewer role)
gcloud billing accounts list
```

### 5.3 Đặt cảnh báo chi phí (Budget Alert)

Truy cập **Billing → Budgets & Alerts → Create Budget**:
- Budget name: `landing-page-monthly`
- Amount: `$30` (buffer trên mức thực tế)
- Alert thresholds: 50%, 90%, 100%
- Gửi email cảnh báo đến `nhuycuty11@gmail.com`

### 5.4 Tối ưu chi phí

**Tắt VM khi không cần** (tiết kiệm ~$13/tháng khi tắt):
```bash
# Tắt
gcloud compute instances stop landing-vm --zone=us-central1-a --project=deploy-app-web-494904

# Bật
gcloud compute instances start landing-vm --zone=us-central1-a --project=deploy-app-web-494904
```

**Tắt Cloud SQL khi không cần** (tiết kiệm ~$7/tháng khi tắt, vẫn tính phí storage):
```bash
# Tắt
gcloud sql instances patch landing-db --activation-policy=NEVER --project=deploy-app-web-494904

# Bật
gcloud sql instances patch landing-db --activation-policy=ALWAYS --project=deploy-app-web-494904
```

**Xóa toàn bộ khi không dùng nữa** (dừng mọi chi phí):
```bash
# XÓA VM
gcloud compute instances delete landing-vm --zone=us-central1-a --project=deploy-app-web-494904

# XÓA Cloud SQL
gcloud sql instances delete landing-db --project=deploy-app-web-494904

# XÓA Static IP
gcloud compute addresses delete landing-ip --region=us-central1 --project=deploy-app-web-494904
```

> ⚠️ Xóa là **không thể khôi phục**. Backup data trước khi xóa.

### 5.5 Xem tất cả resources đang tính phí

```bash
# Liệt kê VMs
gcloud compute instances list --project=deploy-app-web-494904

# Liệt kê Cloud SQL
gcloud sql instances list --project=deploy-app-web-494904

# Liệt kê Static IPs
gcloud compute addresses list --project=deploy-app-web-494904
```

---

## 6. Deploy & Cập nhật Code

### 6.1 Quy trình cập nhật thông thường

```bash
# 1. Sửa code trên máy local
# 2. Test local
docker compose up --build
# http://localhost:3000

# 3. Deploy lên production
cd /home/phuong/Documents/test/landing-page
bash deploy.sh
```

Thời gian deploy: **~4-5 phút** (upload 330KB → build Docker trên VM → restart).

### 6.2 Cập nhật Admin password

**Bước 1:** Sửa `.env.prod` trên máy local:
```bash
nano /home/phuong/Documents/test/landing-page/.env.prod
# Sửa dòng ADMIN_PASSWORD=...
```

**Bước 2:** Upload và restart API:
```bash
gcloud compute scp --zone=us-central1-a --project=deploy-app-web-494904 \
  /home/phuong/Documents/test/landing-page/.env.prod \
  landing-vm:~/app/.env.prod

gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml --env-file .env.prod up -d api'
```

### 6.3 Rollback về phiên bản trước

```bash
# Xem lịch sử commit
git log --oneline -10

# Rollback code về commit cũ (thay COMMIT_HASH)
git checkout COMMIT_HASH -- backend/ frontend/

# Deploy lại
bash deploy.sh
```

### 6.4 Xem phiên bản đang chạy trên VM

```bash
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}"'
```

---

## 7. Xử lý sự cố

### Website không truy cập được

```bash
# 1. Kiểm tra VM có đang chạy không
gcloud compute instances describe landing-vm \
  --zone=us-central1-a --project=deploy-app-web-494904 \
  --format='value(status)'
# Kết quả phải là: RUNNING

# 2. SSH vào VM, kiểm tra containers
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker ps'

# 3. Nếu container nào Down → restart
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml --env-file .env.prod up -d'
```

### HTTPS/SSL lỗi ("Certificate not trusted")

```bash
# Xem Caddy logs để hiểu lý do cert thất bại
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml logs caddy'

# Thường gặp: Let's Encrypt rate limit (5 lần/giờ)
# Giải pháp: đợi 1 giờ rồi restart Caddy
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml restart caddy'
```

### API trả lỗi 500 hoặc không load data

```bash
# Xem API logs
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='cd ~/app && docker compose -f docker-compose.prod.yml logs --tail=50 api'

# Kiểm tra kết nối Cloud SQL
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='docker exec app-api-1 curl -sf http://localhost:8080/actuator/health'
```

### Database connection failed

```bash
# 1. Kiểm tra Cloud SQL đang chạy
gcloud sql instances describe landing-db \
  --project=deploy-app-web-494904 --format='value(state)'
# Phải là: RUNNABLE

# 2. Kiểm tra IP VM có trong authorized networks
gcloud sql instances describe landing-db \
  --project=deploy-app-web-494904 \
  --format='value(settings.ipConfiguration.authorizedNetworks)'
# Phải có: 34.27.241.13

# 3. Nếu IP thay đổi (VM restart có thể đổi IP nếu không dùng static)
# Static IP đã được đặt → không cần lo vấn đề này
```

### Disk VM đầy

```bash
gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
  --command='
# Xem disk usage
df -h /
# Dọn Docker images cũ
docker system prune -af --volumes
# Xem lại
df -h /
'
```

### Quên admin password

Sửa `.env.prod` trên máy local rồi upload lại (xem mục 6.2).

---

## 8. Bảo mật & Bảo trì định kỳ

### Hàng tuần
- [ ] Vào admin dashboard xem data mới, cập nhật status contacts/bookings
- [ ] Kiểm tra https://34.27.241.13.nip.io truy cập bình thường

### Hàng tháng
- [ ] Xem chi phí GCP: https://console.cloud.google.com/billing?project=deploy-app-web-494904
- [ ] Kiểm tra disk VM không đầy: `gcloud compute ssh landing-vm ... --command='df -h /'`
- [ ] Backup thủ công Cloud SQL (ngoài auto backup):
  ```bash
  gcloud sql backups create --instance=landing-db --project=deploy-app-web-494904
  ```
- [ ] Kiểm tra có Docker image cũ cần dọn không:
  ```bash
  gcloud compute ssh landing-vm --zone=us-central1-a --project=deploy-app-web-494904 \
    --command='docker system df'
  ```

### Đổi password định kỳ (3-6 tháng/lần)
Tạo password mới:
```bash
openssl rand -base64 18
```
Cập nhật theo hướng dẫn mục 6.2.

### Không làm những điều này
- ❌ Commit `.env.prod` lên git
- ❌ Chia sẻ admin password qua chat/email không mã hóa
- ❌ Xóa static IP `landing-ip` khi VM đang chạy
- ❌ Giảm dung lượng Cloud SQL disk (Cloud SQL không hỗ trợ)
- ❌ Thêm authorized networks mở rộng `0.0.0.0/0` vào Cloud SQL (chỉ cho IP VM)

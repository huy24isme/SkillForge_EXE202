# Hướng dẫn Test Toàn bộ UI Web (Frontend + Admin)

> **Frontend BSC:** http://localhost:5173 — đăng nhập `ceo` / `123456`  
> **Admin Panel:** http://localhost:5174 — đăng nhập `admin` / `admin123`  
> **Backend:** http://localhost:8080 (phải chạy trước)

---

## Thứ tự chạy bắt buộc

```
1. Khởi động Docker (PostgreSQL)
2. Khởi động Backend:  cd bsc-backend && .\mvnw.cmd spring-boot:run
3. Khởi động Frontend: cd frontend    && npm run dev   → http://localhost:5173
4. Khởi động Admin:    cd admin       && npm run dev   → http://localhost:5174
5. Đăng nhập BSC Frontend TRƯỚC (tạo Company + Strategy trong DB)
6. Sau đó mới dùng Admin Panel
```

---

## PHẦN 1 — BSC FRONTEND (http://localhost:5173)

### BƯỚC 0 — Đăng nhập BSC

| | Thao tác | Kết quả mong đợi |
|--|----------|------------------|
| 1 | Mở http://localhost:5173 | Trang login |
| 2 | `ceo` / `123456` → Đăng nhập | Chuyển đến Dashboard, sidebar hiện B1→B5 |
| 3 | F5 (reload) | Vẫn đăng nhập, sidebar vẫn hiện ✅ |

---

### B1 — Đánh giá (Assessment)

**URL:** `/assessment`  
**Cơ chế:** Khi mount, gọi `GET /bsc-strategies/{id}/assessment` → load từ DB.  
**Lưu:** Mỗi thao tác (thêm/sửa/xóa mục) gọi API ngay lập tức.

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Vào trang B1 | `GET /assessment` | Dữ liệu từ DB hiện ra (nếu đã có) |
| 2 | Thêm dữ liệu tài chính (doanh thu, lợi nhuận) | `PUT /assessment/financials` | 200 OK, lưu ngay |
| 3 | Thêm thị phần hiện tại + tương lai | `PUT /assessment/market-shares` | 200 OK, lưu ngay |
| 4 | Điền Điểm mạnh công ty (thêm 2–3 mục) | `PUT /assessment/text-items` | 200 OK, lưu ngay |
| 5 | Điền các ô còn lại | Tương tự | 200 OK |
| 6 | Click **"Hoàn thành B1"** | `POST /assessment/complete` | 200 OK, chuyển sang B2 |
| 7 | F5 → quay lại B1 | `GET /assessment` | Tất cả dữ liệu vẫn còn ✅ |

---

### B2.1 — Mô hình 7S

**URL:** `/strategy-build` (tab 7S)  
**Cơ chế:** Mount gọi `GET /strategy-building` → load tất cả B2 từ DB.

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào B2 | Trang load từ DB (các tab 7S / 5 Forces / PESTEL / SWOT) |
| 2 | Chọn yếu tố **Strategy** → nhập nội dung → **Thêm** | Mục xuất hiện, sync DB ngay — 200 OK |
| 3 | Thêm ít nhất 1 mục mỗi yếu tố (7 yếu tố: Strategy, Structure, Systems, Shared Values, Skills, Style, Staff) | |
| 4 | F5 | Tất cả mục 7S vẫn còn ✅ |

---

### B2.2 — Mô hình 5 Áp lực

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Click tab **B2.2 Mô hình 5 Áp lực** | Hiện 5 nhóm |
| 2 | Thêm mục cho mỗi áp lực: Cạnh tranh, Nhà cung cấp, Khách hàng, Sản phẩm thay thế, Đối thủ mới | 200 OK mỗi lần |
| 3 | F5 | Dữ liệu vẫn còn ✅ |

---

### B2.3 — PESTEL

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Click tab **B2.3 PESTEL** | Hiện 6 nhóm |
| 2 | Thêm mục cho: Chính trị, Kinh tế, Xã hội, Công nghệ, Môi trường, Pháp lý | 200 OK mỗi lần |
| 3 | F5 | Dữ liệu vẫn còn ✅ |

---

### B2.4 — Phân tích SWOT

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Click tab **B2.4 Phân tích SWOT** | Hiện 4 cột S / W / O / T |
| 2 | **Cột S (Strengths):** check ≥1 mục từ 7S | Tick xanh, gọi `POST /swot-items` — 200 OK |
| 3 | **Cột W (Weaknesses):** check ≥1 mục từ 7S (khác mục S) | |
| 4 | **Cột O (Opportunities):** check ≥1 mục từ 5 Forces hoặc PESTEL | |
| 5 | **Cột T (Threats):** check ≥1 mục từ 5 Forces hoặc PESTEL (khác O) | |
| 6 | F5 | Các tick vẫn còn ✅ |

> **Lưu ý:** Một mục chỉ được check ở S hoặc W (không cả 2). Tương tự O và T.

---

### B2.5 — Xây dựng Chiến lược SO/ST/WO/WT (Formulation)

**URL:** `/strategy-build/formulation`

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào trang Formulation | Load từ DB, hiện chiến lược đã tạo |
| 2 | Click **"+ Thêm chiến lược"** → chọn loại **SO** | Modal xuất hiện |
| 3 | Nhập tên, mô tả, chọn mục S và O liên quan → **Lưu** | 200 OK, xuất hiện trong tab SO |
| 4 | Tạo thêm chiến lược loại ST, WO, WT | |
| 5 | Click ✏️ sửa một chiến lược → **Lưu thay đổi** | `PUT /candidate-strategies/{id}` — 200 OK |
| 6 | Click 🗑️ xóa một chiến lược | `DELETE /candidate-strategies/{id}` — 200 OK |
| 7 | Click **"Hoàn thành B2"** | `POST /strategy-building/complete` — 200 OK, chuyển B3 |
| 8 | F5 → quay lại | Chiến lược vẫn còn ✅ |

---

### B3 — Chọn chiến lược (Selection)

**URL:** `/strategy-results/selection`

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào B3 | Load từ DB (danh sách chiến lược từ B2, trạng thái đã chọn nếu có) |
| 2 | Click checkbox chọn 1 hoặc 2 chiến lược | `PUT /selected-strategies` — 200 OK |
| 3 | Click **"Hoàn thành B3"** | `POST /strategy-result/complete` — 200 OK, chuyển B4 |
| 4 | F5 → quay lại | Chiến lược đã chọn vẫn được đánh dấu ✅ |

---

### B3 — Kết quả (Outcomes)

**URL:** `/strategy-results/outcomes`

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào trang này | Hiện danh sách chiến lược đã chọn với đủ thông tin |
| 2 | F5 | Vẫn đúng dữ liệu ✅ |

---

### B4 — Bản đồ chiến lược (Strategy Map)

**URL:** `/strategy-map/perspectives`

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào B4 | Load từ DB: B2+B3 data, sau đó load bản đồ. Nếu B4 chưa bắt đầu → tự tạo strategy map mới |
| 2 | Click **"+ Thêm mục tiêu"** trong cột Tài chính | Modal xuất hiện |
| 3 | Nhập tên, chọn góc độ → **Lưu** | `POST /objectives` — 200 OK, mục tiêu xuất hiện trên bản đồ |
| 4 | Thêm ≥1 mục tiêu cho MỖI 4 góc độ (Tài chính, Khách hàng, Quy trình nội bộ, Học hỏi) | Bắt buộc đủ 4 góc độ để hoàn thành B4 |
| 5 | Chuyển sang **Chế độ Liên kết** → chọn nguồn và đích → **Thêm liên kết** | `POST /objective-links` — 200 OK |
| 6 | Click **"Hoàn thành B4"** | `POST /strategy-map/complete` — 200 OK |
| 7 | F5 → quay lại | Toàn bộ bản đồ vẫn còn ✅ |

---

### B5 — Fishbone / KPI phòng ban

**URL:** `/fishbone`

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào B5 | Load phòng ban + bản đồ + KPI từ DB |
| 2 | Chọn **"Toàn công ty"** → hiện ma trận Phòng ban × Mục tiêu | |
| 3 | Click ô giao của Phòng ban + Mục tiêu để **toggle tham gia** | `POST /department-participations` hoặc `DELETE` — 200 OK |
| 4 | Chuyển sang **"Theo phòng ban"** → chọn phòng ban | |
| 5 | Dưới mục tiêu đang tham gia → click **"+ Thêm KPI"** | Form nhập xuất hiện |
| 6 | Nhập tên KPI → **Lưu** | `POST /department-kpis` — 200 OK |
| 7 | Đảm bảo mỗi mục tiêu có ≥1 phòng ban và ≥1 KPI | |
| 8 | Click **"Hoàn thành B5"** | `POST /fishbone/complete` — 200 OK |
| 9 | F5 → quay lại | Tham gia và KPI vẫn còn ✅ |

---

### ✅ Kiểm tra Dashboard sau khi hoàn thành B1–B5

Sau khi bấm "Hoàn thành" từng bước, vào Dashboard:

| Kiểm tra | Mong đợi |
|----------|----------| 
| Thanh tiến độ BSC | Hiển thị đúng số bước đã hoàn thành (5/8) |
| Các step B1–B5 trên timeline | Màu xanh lá (completed) ✅ |
| Stat cards | Số liệu mục tiêu, KPI, phòng ban đúng |
| F5 Dashboard | Fetch lại steps từ DB — vẫn đúng ✅ |

**Khi hoàn thành tất cả B1–B8:**
| Kiểm tra | Mong đợi |
|----------|----------| 
| Banner "🎉 Chúc mừng!" | Hiện ở đầu Dashboard |
| Timeline | Tất cả 8 bước màu xanh ✅ |

---

### Kiểm tra Reload tổng thể (Frontend)

| Trang | Thao tác | Mong đợi |
|-------|----------|----------|
| B1 `/assessment` | F5 | Dữ liệu đánh giá còn đầy đủ ✅ |
| B2 `/strategy-build` | F5 | 7S, 5F, PESTEL, SWOT tick, Chiến lược đều còn ✅ |
| B3 `/strategy-results/selection` | F5 | Chiến lược đã chọn vẫn được đánh dấu ✅ |
| B4 `/strategy-map/perspectives` | F5 | Bản đồ mục tiêu + liên kết còn đủ ✅ |
| B5 `/fishbone` | F5 | Tham gia phòng ban + KPI còn đủ ✅ |

---

## PHẦN 1B — CÀI ĐẶT NGƯỜI DÙNG (http://localhost:5173/settings)

> **URL:** `/settings` — Truy cập qua Sidebar (mục "Tài khoản") hoặc click avatar ở Header → "Cài đặt tài khoản"

### Tab Hồ sơ cá nhân

| # | Thao tác | Element ID | Kết quả mong đợi |
|---|----------|------------|------------------|
| 1 | Vào `/settings` | — | Trang "Cài đặt tài khoản" với 2 tab |
| 2 | Click tab **Hồ sơ cá nhân** | `settings-tab-profile` | Tab active, form hiện họ tên + email + chức danh |
| 3 | Hover vào avatar | — | Icon camera xuất hiện |
| 4 | Click vào avatar → chọn ảnh | — | Ảnh mới hiện, lưu vào localStorage |
| 5 | F5 → vào lại Settings | — | Ảnh avatar vẫn còn ✅ |
| 6 | Kiểm tra Header | — | Avatar mới cũng hiện ở header ✅ |
| 7 | Sửa **Họ và tên** | `settings-fullname` | Nhập tên mới |
| 8 | Sửa **Chức danh** | `settings-title` | Nhập chức danh mới |
| 9 | Click **"Lưu thay đổi"** | `settings-save-profile` | `PUT /auth/profile` — 200 OK, banner xanh "Đã cập nhật hồ sơ thành công!" |
| 10 | F5 | — | Tên mới hiện trong header ✅ |
| 11 | Thử lưu với họ tên trống | — | Alert đỏ "Họ và tên không được để trống" |

### Tab Bảo mật (Đổi mật khẩu)

| # | Thao tác | Element ID | Kết quả mong đợi |
|---|----------|------------|------------------|
| 1 | Click tab **Bảo mật** | `settings-tab-security` | Form 3 ô mật khẩu + chỉ báo độ mạnh |
| 2 | Nhập mật khẩu hiện tại SAI | `settings-current-password` | — |
| 3 | Nhập mật khẩu mới (≥6 ký tự) | `settings-new-password` | Thanh độ mạnh cập nhật realtime |
| 4 | Nhập xác nhận đúng | `settings-confirm-password` | — |
| 5 | Click **"Đổi mật khẩu"** | `settings-change-password` | `PUT /auth/change-password` → 400 "Mật khẩu hiện tại không đúng" ✅ |
| 6 | Nhập đúng mật khẩu hiện tại (`123456`) | `settings-current-password` | — |
| 7 | Click **"Đổi mật khẩu"** | `settings-change-password` | 200 OK, banner xanh "Đã đổi mật khẩu thành công!" |
| 8 | Đăng xuất → đăng nhập lại với mật khẩu MỚI | — | Đăng nhập thành công ✅ |
| 9 | Thử confirm mật khẩu không khớp | — | Alert đỏ "Xác nhận mật khẩu không khớp" (frontend validation) |
| 10 | Thử mật khẩu mới < 6 ký tự | — | Alert đỏ "Mật khẩu mới phải có ít nhất 6 ký tự" |

### Truy cập từ Sidebar

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Nhìn sidebar | Section "Tài khoản" (thay "Công cụ"), icon Settings |
| 2 | Click **"Cài đặt tài khoản"** | Điều hướng đến `/settings` ✅ |
| 3 | Thu gọn sidebar (click icon thu gọn) | Icon Settings vẫn hiện ở sidebar thu gọn |

### Truy cập từ Header (Avatar Menu)

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Click avatar ở góc trên phải | Dropdown menu mở |
| 2 | Thấy nút **"Cài đặt tài khoản"** | Trên nút Đăng xuất ✅ |
| 3 | Click "Cài đặt tài khoản" | Điều hướng đến `/settings` |

---

## PHẦN 2 — ADMIN PANEL (http://localhost:5174)

> **Điều kiện:** Phải đăng nhập BSC Frontend trước để tạo Company trong DB.

### BƯỚC 0 — Đăng nhập Admin

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Mở http://localhost:5174 | Trang đăng nhập admin (nền tối) |
| 2 | `admin` / `admin123` → Đăng nhập | Chuyển đến Tổng quan, tên công ty hiện ở header |
| 3 | F5 | Vẫn đăng nhập ✅ |

---

### Tổng quan (Overview)

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Xem 4 stat cards (Phòng ban / Người dùng / Kỳ BSC / Ngưỡng) | Số liệu từ DB ✅ |
| 2 | Click card **Phòng ban** | Chuyển sang trang Phòng ban |
| 3 | Kiểm tra banner đen: tên công ty, lĩnh vực, năm tài chính | Đúng thông tin từ DB |
| 4 | F5 | Tổng quan vẫn đúng ✅ |

---

### Cấu hình Công ty

**URL:** `/company-setup`

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Vào trang | Load từ DB tự động | Form điền sẵn tên, mã số thuế, lĩnh vực |
| 2 | Sửa **Tên công ty** | — | |
| 3 | Sửa **Mã số thuế** | — | |
| 4 | Chọn **Lĩnh vực** | — | |
| 5 | Click **"Lưu cấu hình"** | `PUT /companies/{id}` | Nút → "Đã lưu thành công!" |
| 6 | F5 | `GET /companies/{id}` | Tên, mã số thuế, lĩnh vực vẫn đúng ✅ |

> **Lưu ý:** Địa chỉ, SĐT, Email, Website, Năm tài chính → chỉ lưu localStorage (không có API backend).

---

### Quản lý Phòng ban

**URL:** `/departments`

#### Thêm phòng ban

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Vào trang | `GET /companies/{id}/departments` | Load từ DB |
| 2 | Click **"+ Thêm phòng ban"** | — | Modal xuất hiện |
| 3 | Tên: `Phòng Kinh doanh`, Mã: `KD`, chọn màu | — | |
| 4 | Click **"Thêm phòng ban"** | `POST /companies/{id}/departments` | Card mới xuất hiện |
| 5 | Thêm thêm 2–3 phòng: `IT`, `HR`, `FIN` | | |
| 6 | F5 | `GET /companies/{id}/departments` | Danh sách phòng ban vẫn đầy đủ ✅ |

#### Sửa phòng ban

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Click ✏️ trên card | — | Modal sửa với thông tin hiện tại |
| 2 | Đổi tên → **"Lưu thay đổi"** | `PUT /departments/{id}` | Tên cập nhật ngay |
| 3 | F5 | — | Tên mới vẫn còn ✅ |

#### Xóa phòng ban

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Click 🗑️ trên phòng ban TRỐNG (không có thành viên) | — | Confirm dialog |
| 2 | Xác nhận | `DELETE /departments/{id}` | Biến khỏi danh sách |
| 3 | F5 | — | Không xuất hiện lại ✅ (soft delete) |
| 4 | Xóa phòng ban CÓ người | — | Alert ngăn lại, không xóa ✅ |

---

### Quản lý Người dùng (Nhân viên)

**URL:** `/users`

#### Thêm người dùng

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Vào trang | `GET /companies/{id}/employees` | Load nhân viên từ DB |
| 2 | Click **"+ Thêm người dùng"** | — | Modal xuất hiện |
| 3 | Họ tên: `Nguyễn Văn A`, Email: `a@company.vn`, Chức danh: `GĐ KD` | — | |
| 4 | Chọn Phòng ban (phải đã tạo ở trên), Vai trò: Quản lý | — | |
| 5 | Click **"Thêm người dùng"** | `POST /companies/{id}/employees` | Xuất hiện trong bảng |
| 6 | Thêm 2–3 người nữa với vai trò khác nhau | | |
| 7 | F5 | `GET /companies/{id}/employees` | Danh sách vẫn đầy đủ ✅ |

#### Sửa người dùng

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Click ✏️ trên dòng người dùng | — | Modal với thông tin hiện tại |
| 2 | Sửa chức danh, phòng ban → **"Lưu thay đổi"** | `PUT /employees/{id}` | Cập nhật ngay |
| 3 | F5 | — | Thay đổi vẫn còn ✅ |

#### Xóa người dùng

| # | Thao tác | API gọi | Kết quả |
|---|----------|---------|---------| 
| 1 | Click 🗑️ → Xác nhận | `DELETE /employees/{id}` | Biến khỏi danh sách |
| 2 | F5 | — | Không xuất hiện lại ✅ (soft delete) |

#### Tìm kiếm / Lọc

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Nhập tên vào ô tìm kiếm | Lọc ngay theo tên/email/chức danh |
| 2 | Chọn "Vai trò: Quản lý" | Chỉ hiện Quản lý |
| 3 | Chọn phòng ban cụ thể | Lọc theo phòng ban |

---

### Quản lý Kỳ BSC (local only)

**URL:** `/periods`

> Kỳ BSC lưu localStorage — không có backend API. Tồn tại qua F5.

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào trang | Hiện Q1/2024–Q1/2025 mặc định, Q4/2024 active |
| 2 | Click **"Kích hoạt"** trên Q1/2025 | Q1/2025 active, Q4/2024 deactivated |
| 3 | Click **"+ Thêm kỳ"** → nhập thông tin → Thêm | Kỳ mới xuất hiện |
| 4 | F5 | Cấu hình kỳ vẫn còn ✅ (localStorage) |

---

### Cấu hình Hệ thống (local only)

**URL:** `/system-config`

> Ngưỡng xếp loại lưu localStorage — không có backend API.

| # | Thao tác | Kết quả |
|---|----------|---------| 
| 1 | Vào trang | Xuất sắc ≥110%, Tốt ≥90%, Trung bình ≥70% |
| 2 | Đổi ngưỡng Xuất sắc → `120` → Lưu | Cập nhật |
| 3 | F5 | Ngưỡng mới vẫn còn ✅ (localStorage) |

---

### Kiểm tra Reload tổng thể (Admin)

| Trang | F5 | Mong đợi |
|-------|-----|----------|
| `/overview` | F5 | Số liệu đúng, tên công ty đúng ✅ |
| `/company-setup` | F5 | Form điền sẵn từ DB ✅ |
| `/departments` | F5 | Phòng ban từ DB ✅ |
| `/users` | F5 | Nhân viên từ DB ✅ |
| `/periods` | F5 | Kỳ BSC từ localStorage ✅ |
| `/system-config` | F5 | Ngưỡng từ localStorage ✅ |

---

## Kiểm tra liên thông Admin ↔ Frontend

| # | Thao tác | Mong đợi |
|---|----------|----------|
| 1 | Admin tạo phòng ban **"CNTT"** | DB có phòng ban CNTT |
| 2 | Frontend B5 → F5 | Phòng ban CNTT xuất hiện trong danh sách ma trận ✅ |
| 3 | Admin thêm nhân viên **"Trần B"** vào CNTT | DB có nhân viên Trần B |
| 4 | Frontend B5 → F5 | Nhân viên liên thông với phòng CNTT ✅ |

---

## API Endpoints mới (v2)

### Đổi mật khẩu

```http
PUT /api/v1/auth/change-password
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```
**Response 200:** `{ "success": true, "data": null }`  
**Response 400:** `{ "success": false, "message": "Mật khẩu hiện tại không đúng" }`

### Cập nhật hồ sơ

```http
PUT /api/v1/auth/profile
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "fullName": "Nguyễn CEO Mới",
  "title": "Giám đốc điều hành"
}
```
**Response 200:** `{ "success": true, "data": null }`

---

## Lỗi thường gặp & Cách xử lý

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| Admin không load được dữ liệu | Chưa đăng nhập BSC Frontend → companyId null | Vào http://localhost:5173, đăng nhập `ceo`/`123456` trước |
| "Backend không phản hồi" | Spring Boot chưa chạy | `cd bsc-backend && .\mvnw.cmd spring-boot:run` |
| B4 mở ra nhưng không thêm được mục tiêu | Xảy ra nếu `b3Selected` chưa load xong | Đợi loading xong (có spinner), sau đó mới thêm |
| Mã phòng ban bị lỗi 500 | Mã trùng với phòng ban khác | Đổi sang mã khác (mỗi mã là unique trong công ty) |
| Email nhân viên không hợp lệ | Sai định dạng email | Nhập đúng: `xxx@domain.com` |
| Xóa phòng ban bị chặn | Còn nhân viên trong phòng | Xóa nhân viên trước, hoặc chuyển sang phòng khác |
| Trang trắng sau reload | Lỗi JS runtime | Mở DevTools (F12) → Console → xem lỗi |
| CORS error | Frontend gọi sai URL | Kiểm tra `VITE_API_BASE_URL` trong `.env` hoặc dùng mặc định `localhost:8080` |
| Đổi mật khẩu 401 | Token hết hạn | Đăng nhập lại |
| Avatar không hiện sau F5 | localStorage bị xóa | Thử upload lại ảnh tại `/settings` |
| Timezone error (backend log) | `Asia/Saigon` không hợp lệ | Đảm bảo `application.yml` có `?TimeZone=Asia/Ho_Chi_Minh` và `pom.xml` có `-Duser.timezone=Asia/Ho_Chi_Minh` |

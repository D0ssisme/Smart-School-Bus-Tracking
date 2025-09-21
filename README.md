# 🚌 Smart School Bus Tracking System (SSB 1.0)

## 📖 Giới thiệu
Quản lý và giám sát xe đưa đón học sinh là một thách thức đối với nhiều trường học và phụ huynh tại các thành phố lớn.  
Việc trễ giờ, lạc đường hoặc thiếu thông tin về vị trí xe có thể ảnh hưởng nghiêm trọng đến sự an toàn của học sinh.  

**Smart School Bus Tracking System (SSB 1.0)** được phát triển nhằm giải quyết các vấn đề này, giúp quản lý minh bạch hơn và giảm áp lực cho **nhà trường, tài xế và phụ huynh**.  

---

## 🎯 Mục tiêu
- Quản lý tập trung xe buýt, tài xế, học sinh và tuyến đường.  
- Cung cấp lịch trình và vị trí xe buýt theo thời gian thực.  
- Cải thiện trải nghiệm và sự yên tâm cho phụ huynh.  
- Giúp tài xế vận hành hiệu quả và báo cáo nhanh chóng.  

---

## 👥 Các bên liên quan
1. **Nhà trường (Quản lý xe buýt)**  
   - Phân công tài xế, xe buýt và tuyến đường.  
   - Theo dõi lịch trình và vị trí xe.  
   - Gửi thông báo đến tài xế và phụ huynh.  

2. **Tài xế**  
   - Xem lịch trình hằng ngày.  
   - Quản lý danh sách học sinh, điểm đón/trả.  
   - Báo cáo tình trạng và gửi cảnh báo khi cần.  

3. **Phụ huynh học sinh**  
   - Theo dõi vị trí xe theo thời gian thực.  
   - Nhận thông báo khi xe đến gần.  
   - Nhận cảnh báo nếu xe bị trễ hoặc có sự cố.  

---

## ⚙️ Chức năng chính

### 📌 Quản lý xe buýt
- Xem tổng quan danh sách **học sinh, tài xế, xe buýt và tuyến đường**.  
- Tạo và cập nhật lịch trình xe (tuần/tháng).  
- Phân công tài xế và xe buýt cho từng tuyến.  
- Cập nhật vị trí xe buýt theo **thời gian thực (delay tối đa 3s)**.  
- Gửi tin nhắn cho tài xế hoặc phụ huynh.  

### 📌 Tài xế
- Xem lịch làm việc hằng ngày.  
- Xem danh sách học sinh cần đón và điểm đón.  
- Báo cáo tình trạng **đã đón/trả học sinh**.  
- Gửi cảnh báo nếu có sự cố.  

### 📌 Phụ huynh
- Theo dõi **vị trí xe buýt của con** theo thời gian thực.  
- Nhận thông báo khi xe sắp đến điểm đón.  
- Nhận cảnh báo khi xe bị trễ hoặc gặp sự cố.


smart-school-bus-tracking/
│
├── frontend/                      # Next.js (UI cho phụ huynh & quản lý)
│   ├── public/                    # Static assets (logo, icons, ảnh bus)
│   ├── src/
│   │   ├── app/                   # Next.js App Router (v13+)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Trang home/dashboard
│   │   │   ├── parents/           # Module cho phụ huynh
│   │   │   │   └── page.tsx
│   │   │   ├── drivers/           # Module cho tài xế
│   │   │   │   └── page.tsx
│   │   │   ├── admin/             # Module cho quản lý nhà trường
│   │   │   │   └── page.tsx
│   │   ├── components/            # UI components tái sử dụng (Navbar, Button)
│   │   ├── features/              # Chia theo tính năng
│   │   │   ├── auth/              # Đăng nhập/đăng ký
│   │   │   ├── bus-tracking/      # Realtime map tracking
│   │   │   ├── schedule/          # Quản lý lịch trình
│   │   │   └── notifications/     # Thông báo phụ huynh
│   │   ├── services/              # API client (axios/fetch đến backend)
│   │   ├── hooks/                 # Custom hooks (useAuth, useBusTracking)
│   │   ├── styles/                # Tailwind/CSS modules
│   │   └── utils/                 # Helper nhỏ
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # Express.js API server
│   ├── src/
│   │   ├── config/                # Config DB, env, logger
│   │   │   └── db.js
│   │   ├── models/                # Mô hình dữ liệu (Student, Driver, Bus, Schedule)
│   │   │   ├── student.model.js
│   │   │   ├── driver.model.js
│   │   │   ├── bus.model.js
│   │   │   └── schedule.model.js
│   │   ├── routes/                # Routes API
│   │   │   ├── student.routes.js
│   │   │   ├── driver.routes.js
│   │   │   ├── bus.routes.js
│   │   │   └── schedule.routes.js
│   │   ├── controllers/           # Controller nhận request, trả response
│   │   ├── services/              # Business logic (gọi DB, xử lý chính)
│   │   ├── middlewares/           # Auth, error handler, validate
│   │   ├── utils/                 # Tiện ích (jwtHelper, sendNotification)
│   │   ├── app.js                 # Khởi tạo Express app
│   │   └── server.js              # Điểm vào (start server)
│   ├── package.json
│   └── .env.example
│
├── docs/                          # Tài liệu hệ thống
│   ├── architecture-diagram.png   # Sơ đồ kiến trúc
│   ├── use-case.md
│   └── api-docs.md                # Tài liệu API (Swagger/Postman)
│
├── docker-compose.yml             # Nếu muốn chạy cả FE + BE + DB bằng docker
├── .gitignore
├── .env.example                   # Env chung cho dự án
└── README.md


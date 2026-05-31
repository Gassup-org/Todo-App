# Initial Prompt — Agent Team Build Todo App

Bạn là **Team Lead** của một agent team chuyên xây dựng phần mềm full-stack. Hãy điều phối team để thiết kế, triển khai, kiểm thử và bàn giao một **Todo App cá nhân hóa, scalable, maintainable, clean code** với tech stack chính:

- Frontend: **ReactJS**
- Backend: **NodeJS + ExpressJS**
- Database: chọn giải pháp phù hợp cho production-ready app, ưu tiên PostgreSQL nếu chưa có ràng buộc khác
- Auth: OAuth Google + RBAC
- Design support: kết nối và dùng **MCP Stitch AI** để hỗ trợ thiết kế UI/UX nếu MCP đã được cấu hình; nếu chưa có, hãy yêu cầu user cung cấp/thêm MCP cần thiết trước khi triển khai phần design chi tiết

## 1. Team setup

Tạo và điều phối agent team theo vai trò sau:

### Team Lead

- Model: **gpt-5.5**
- Trách nhiệm:
  - Phân tích yêu cầu, chia task, kiểm soát kiến trúc tổng thể
  - Đảm bảo codebase scalable, maintainable, clean code
  - Review các quyết định kỹ thuật quan trọng
  - Điều phối fullstack dev, QA, QC, tester
  - Tổng hợp tiến độ, rủi ro, quyết định, câu hỏi còn mở

### Fullstack Developers

- Model: **gpt-5.3** để tối ưu chi phí
- Số lượng đề xuất: 2-3 agents
- Trách nhiệm:
  - Implement frontend ReactJS
  - Implement backend NodeJS/ExpressJS
  - Thiết kế database schema, API, service layer
  - Viết unit/integration tests cho phần mình phụ trách
  - Tuân thủ clean code, module boundaries rõ ràng, file naming dễ hiểu

### QA Engineer

- Model: **gpt-5.3**
- Trách nhiệm:
  - Kiểm tra requirement coverage
  - Viết test plan
  - Kiểm tra edge cases, role permissions, auth flows, todo flows, notification flows
  - Xác nhận acceptance criteria trước khi bàn giao

### QC Engineer

- Model: **gpt-5.3**
- Trách nhiệm:
  - Kiểm tra code quality, maintainability, consistency
  - Kiểm tra architecture có scalable không
  - Kiểm tra naming, folder structure, duplication, error handling, security basics
  - Đề xuất refactor nếu cần

### Tester

- Model: **gpt-5.3**
- Trách nhiệm:
  - Chạy app, test manual các luồng chính
  - Chạy automated tests
  - Báo lỗi theo format: steps, expected, actual, severity, suggested fix

## 2. Product goal

Xây dựng một Todo App hiện đại cho cá nhân, có phân quyền người dùng, dashboard thống kê, lịch xem todo theo ngày, notification email nhắc lịch và giao diện tech/modern.

App cần đủ đơn giản để phát triển nhanh nhưng kiến trúc phải đủ tốt để mở rộng sau này.

## 3. Core requirements

### 3.1 Authentication + RBAC

Triển khai hệ thống xác thực và phân quyền gồm:

- Guest
- User
- Admin

Yêu cầu:

- Guest chỉ được xem landing/login/register, không được dùng todo cá nhân
- User phải đăng nhập mới dùng được todo app cá nhân
- Admin có dashboard thống kê tổng quan và quản lý user
- OAuth với Google
- Có cơ chế session/token an toàn
- Backend phải bảo vệ API bằng middleware auth + role guard
- Frontend phải bảo vệ route theo role

Các luồng cần có:

- Đăng nhập bằng Google
- Đăng xuất
- Lấy thông tin current user
- Phân quyền frontend/backend đồng nhất
- Admin xem danh sách user
- Admin xem thống kê cơ bản toàn hệ thống

### 3.2 Calendar-based Todo

User cần có calendar để chọn ngày và xem todo list của ngày đó.

Yêu cầu:

- Có UI calendar/date picker
- Khi chọn ngày, frontend load todo list tương ứng
- Todo được gắn với ngày cụ thể
- Có trạng thái loading/error/empty state rõ ràng
- Timezone cần xử lý nhất quán, tránh lệch ngày

### 3.3 User CRUD Todo List

Sau khi chọn ngày, user có thể CRUD todo cho ngày đó.

Todo entity tối thiểu gồm:

- id
- userId
- title
- description optional
- dueDate hoặc scheduledDate
- dueTime optional
- priority optional: low | medium | high
- status: pending | completed | archived/cancelled nếu cần
- reminderEmailEnabled boolean
- reminderAt optional
- createdAt
- updatedAt

Chức năng:

- Create todo
- Read todo list theo ngày
- Update todo
- Toggle completed
- Delete todo
- Validate input frontend + backend
- Không cho user truy cập todo của user khác

### 3.4 Todo Views

Todo list có 2 kiểu hiển thị:

#### View 1: Vertical List

- Dạng danh sách truyền thống
- Dễ đọc, nhanh thao tác
- Có filter/sort đơn giản nếu phù hợp

#### View 2: Playing Card View

- Dạng card nhìn như **bộ bài tây** để tạo điểm nhấn
- Mỗi todo là một lá bài
- Design dark tech, neon nhẹ
- Có visual hierarchy theo priority/status
- Completed todo có trạng thái visually distinct
- Card phải đẹp nhưng không làm giảm readability
- Responsive trên desktop/tablet/mobile

### 3.5 User Dashboard

User có dashboard thống kê todo cá nhân đơn giản.

Gợi ý metrics:

- Tổng todo trong ngày/tuần/tháng
- Số todo completed vs pending
- Completion rate
- Todo theo priority
- Upcoming reminders
- Streak hoặc productivity summary nếu dễ triển khai

Dashboard cần trực quan, nhẹ, không over-engineer.

### 3.6 Admin Dashboard

Admin có dashboard quản lý và thống kê.

Yêu cầu tối thiểu:

- Tổng số users
- Tổng số todos
- Active users gần đây nếu có dữ liệu
- Todo completion overview
- User management table
- Xem, khóa/mở hoặc đổi role user nếu phù hợp với scope

### 3.7 Email Notification Reminder

Có notification gửi email nhắc lịch todo.

Yêu cầu:

- User bật/tắt reminder cho từng todo
- User chọn thời điểm nhắc
- Backend có job/scheduler xử lý reminder
- Gửi email trước/đúng thời điểm reminderAt
- Tránh gửi trùng email
- Có trạng thái tracking reminder sent
- Nếu chưa có email provider, implement abstraction email service và dùng provider cấu hình qua env
- Không hardcode secrets

Gợi ý:

- Dùng Nodemailer hoặc provider tương đương
- Tách email service để dễ thay provider
- Có fallback/dev mode log email ra console nếu chưa cấu hình SMTP

## 4. UI/UX direction

Phong cách thiết kế:

- Tech
- Modern
- Dark background
- Neon nhẹ, không quá chói
- Clean, premium, focused
- Responsive
- Accessible ở mức cơ bản

Design guidance:

- Background tối với gradient nhẹ
- Neon accent màu cyan/violet/blue/green vừa phải
- Typography rõ ràng
- Components có spacing nhất quán
- Cards có border/glow subtle
- Dashboard charts/tokens tối giản
- Todo playing-card view nên có cảm giác như bộ bài tây: corner markers, rank-like priority indicator, suit-like icon/category marker, rounded card, subtle shine/glow

Hãy dùng **MCP Stitch AI** để hỗ trợ tạo/định hướng design nếu available. Nếu chưa available, dừng phần design generation và hỏi user thêm MCP config cần thiết.

## 5. Architecture requirements

Project phải maintainable và scalable.

Backend nên có cấu trúc rõ:

- config
- routes
- controllers
- services
- repositories/data access
- middlewares
- models/entities/schemas
- jobs/schedulers
- utils
- tests

Frontend nên có cấu trúc rõ:

- components
- pages/routes
- features hoặc modules theo domain
- hooks
- services/api clients
- stores/context nếu cần
- styles/theme
- utils
- tests

Nguyên tắc:

- Không để file quá lớn; nếu file code vượt khoảng 200 lines thì cân nhắc tách module
- Tách business logic khỏi UI/controller
- API response/error format nhất quán
- Validate data ở cả client và server
- Không duplicate logic nếu có thể tái sử dụng
- Naming rõ nghĩa, ưu tiên self-documenting
- Config qua environment variables
- Không commit secrets
- Có README hướng dẫn setup/run/test

## 6. Security baseline

Bắt buộc kiểm tra các điểm sau:

- Auth middleware cho protected APIs
- Role guard cho admin APIs
- User chỉ được CRUD todo của chính mình
- Validate/sanitize input
- Secure cookie/token handling phù hợp với auth strategy
- Rate limit cơ bản cho auth-sensitive endpoints nếu phù hợp
- CORS cấu hình rõ ràng
- Secrets qua env
- Không log token/password/secrets

## 7. Testing requirements

Team phải đảm bảo chất lượng bằng test.

Tối thiểu cần có:

- Backend unit tests cho services quan trọng
- Backend integration tests cho auth/todo APIs nếu feasible
- Frontend component tests cho todo/calendar/view switch/dashboard nếu feasible
- Manual test checklist
- QA test plan

Test cases quan trọng:

- Guest không truy cập được todo/dashboard user
- User login Google thành công
- User CRUD todo theo ngày
- User không truy cập được todo của user khác
- Admin truy cập admin dashboard được
- User thường không truy cập admin dashboard được
- Calendar chọn ngày load đúng todo
- Toggle giữa vertical list và playing-card view hoạt động
- Reminder email không gửi trùng
- Empty/error/loading states hiển thị đúng

## 8. Delivery workflow

Làm việc theo các phase:

### Phase 1: Discovery & Plan

- Đọc README và cấu trúc repo hiện tại
- Xác định app hiện có hay cần tạo mới
- Xác định package manager, scripts, framework setup
- Kiểm tra MCP Stitch AI đã available chưa
- Lập architecture plan
- Chia task cho agents
- Nêu rõ assumptions và unresolved questions

### Phase 2: Design & Architecture

- Thiết kế database schema
- Thiết kế API contract
- Thiết kế frontend route/component structure
- Định nghĩa RBAC model
- Định nghĩa notification flow
- Tạo UI direction bằng MCP Stitch AI nếu available

### Phase 3: Implementation

- Implement backend auth/RBAC/todo/dashboard/notification
- Implement frontend auth routes/calendar/todo CRUD/views/dashboard/admin
- Giữ code modular, clean, testable
- Commit nhỏ theo logical unit nếu được yêu cầu

### Phase 4: QA/QC/Test

- QA kiểm requirement coverage
- QC review code quality + architecture
- Tester chạy test/manual flows
- Fullstack dev fix bugs
- Team Lead final review

### Phase 5: Handoff

Bàn giao gồm:

- Summary tính năng đã làm
- Cách setup env
- Cách run dev
- Cách run tests
- Known limitations
- Unresolved questions nếu có
- Next steps đề xuất

## 9. Expected output format from team

Khi bắt đầu, Team Lead phải trả lời theo format:

```md
## Understanding
<summary ngắn yêu cầu>

## Proposed Team
<agents, models, responsibilities>

## Architecture Plan
<frontend/backend/database/auth/notification/design>

## Implementation Phases
<phase list>

## QA/QC/Test Plan
<test strategy>

## MCP Requirements
<MCP Stitch AI status; nếu thiếu thì yêu cầu user thêm>

## Assumptions
<assumptions>

## Unresolved Questions
<câu hỏi còn mở nếu có>
```

Trong quá trình làm, mọi agent phải báo cáo ngắn gọn, rõ, ưu tiên concision hơn grammar hoàn hảo.

## 10. Important constraints

- Không over-engineer vì đây là todo app, nhưng architecture phải đủ sạch để scale
- Không hardcode secrets
- Không bỏ qua security/RBAC
- Không bỏ qua tests/QA/QC
- Không dùng model đắt cho mọi agent: chỉ Team Lead dùng gpt-5.5, còn lại dùng gpt-5.3
- Nếu cần MCP để setup/design, hãy yêu cầu user thêm thay vì tự giả định đã có
- Nếu gặp thiếu requirement, ghi rõ assumption và unresolved question, nhưng vẫn đề xuất default hợp lý để tiến hành

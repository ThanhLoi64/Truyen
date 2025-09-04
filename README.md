📚 Web Đọc Truyện Online

Ứng dụng web cho phép người dùng đọc truyện tranh/truyện chữ trực tuyến.
Frontend được xây dựng bằng ReactJS, backend quản lý API và dữ liệu bằng ASP.NET MVC C#.

🚀 Công nghệ sử dụng

Frontend:

⚛️ ReactJS

🎨 TailwindCSS / Bootstrap

🔄 Axios để gọi API

Backend:

💻 ASP.NET MVC (C#)

🗄️ Entity Framework (EF Core) để kết nối database

🔑 Identity để quản lý tài khoản người dùng

Database: SQL Server

⚡ Tính năng chính

👤 Đăng ký / đăng nhập tài khoản

📖 Danh sách truyện phân loại theo thể loại

🔎 Tìm kiếm truyện theo tên, tác giả, tag

⭐ Lưu truyện yêu thích (bookmark)

📂 Quản trị viên có thể:

Thêm / sửa / xóa truyện

Quản lý chương truyện

Theo dõi người dùng

📂 Cấu trúc dự án
Frontend (ReactJS)
src/
 ├── components/    # Các component giao diện (Header, Footer, Card, Reader...)
 ├── pages/         # Các trang (Home, Login, Register, StoryDetail, Reader...)
 ├── services/      # Hàm gọi API (Axios)
 ├── utils/         # Tiện ích (auth, format, ... )
 └── App.js

Backend (ASP.NET MVC C#)
Controllers/
 ├── AccountController.cs   # Đăng nhập, đăng ký
 ├── StoryController.cs     # API quản lý truyện
 ├── ChapterController.cs   # API quản lý chương
Models/
 ├── User.cs
 ├── Story.cs
 ├── Chapter.cs
Views/
 ├── Shared/ 
 ├── Story/
 └── Account/

🛠️ Cài đặt & chạy dự án
Backend (C# MVC)
# Chạy migration database
Update-Database

# Chạy server
dotnet run


API sẽ chạy ở:
👉 http://localhost:5000/api

Frontend (ReactJS)
npm install
npm start


App chạy ở:
👉 http://localhost:3000

🔗 Learn More

ReactJS Documentation

ASP.NET MVC

Entity Framework Core

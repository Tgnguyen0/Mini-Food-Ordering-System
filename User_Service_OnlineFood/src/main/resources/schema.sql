-- Tạo database nếu chưa có (MariaDB syntax)
CREATE DATABASE IF NOT EXISTS food_user_db;
USE food_user_db;

-- Tạo bảng users với cơ chế tự động tăng ID và ràng buộc duy nhất cho username
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo index để tối ưu hóa việc tìm kiếm người dùng khi đăng nhập
CREATE INDEX idx_username ON users(username);
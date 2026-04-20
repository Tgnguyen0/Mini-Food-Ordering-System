CREATE DATABASE service_demo;
USE service_demo;

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255),
    quantity INT,
    status VARCHAR(50)
);

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    amount DOUBLE,
    status VARCHAR(50)
);

CREATE TABLE shippings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    address VARCHAR(255),
    status VARCHAR(50)
);
package org.example.orderservice;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;  // Tên sản phẩm
    private Integer quantity;    // Số lượng của sản phẩm này
    private Double unitPrice;    // Giá 1 đơn vị
    private Double subtotal;     // = quantity * unitPrice

    // Nhiều OrderItem thuộc về 1 Order
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;
}


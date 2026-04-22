package org.example.orderservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    // POST /api/orders — Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Đơn hàng phải có ít nhất 1 sản phẩm.");
        }

        double total = 0;
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
            if (item.getSubtotal() == null) {
                item.setSubtotal(item.getUnitPrice() * item.getQuantity());
            }
            total += item.getSubtotal();
        }

        order.setTotalPrice(total);
        order.setStatus("PENDING"); // PENDING = chờ thanh toán

        Order saved = repo.save(order);
        return ResponseEntity.ok(saved);
    }

    // GET /api/orders — Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAll() {
        return repo.findAll();
    }

    // GET /api/orders/{id} — Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/orders/{id} — Cập nhật trạng thái thanh toán
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(
            @PathVariable Long id,
            @RequestBody PaymentRequest request) {

        return repo.findById(id).map(order -> {
            order.setStatus(request.getStatus());
            order.setPaymentMethod(request.getPaymentMethod());
            return ResponseEntity.ok(repo.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }
}
package org.example.orderservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setStatus("CREATED");
        return repo.save(order);
    }

    @GetMapping
    public List<Order> getAll() {
        return repo.findAll();
    }
}

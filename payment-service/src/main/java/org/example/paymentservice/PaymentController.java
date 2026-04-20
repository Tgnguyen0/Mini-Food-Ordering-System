package org.example.paymentservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository repo;

    @PostMapping
    public Payment pay(@RequestBody Payment p) {
        p.setStatus("PAID");
        return repo.save(p);
    }

    @GetMapping
    public List<Payment> getAll() {
        return repo.findAll();
    }
}

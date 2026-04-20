package org.example.shippingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/shippings")
public class ShippingController {

    @Autowired
    private ShippingRepository repo;

    @PostMapping
    public Shipping ship(@RequestBody Shipping s) {
        s.setStatus("SHIPPING");
        return repo.save(s);
    }

    @GetMapping
    public List<Shipping> getAll() {
        return repo.findAll();
    }
}

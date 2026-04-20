package com.food.food_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.food.food_service.entity.Food;
import com.food.food_service.service.FoodService;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
//@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService service;

    @GetMapping
    public List<Food> getAllFoods() {
        return service.getAllFoods();
    }

    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return service.createFood(food);
    }

    @PutMapping("/{id}")
    public Food updateFood(@PathVariable Long id, @RequestBody Food food) {
        return service.updateFood(id, food);
    }

    @DeleteMapping("/{id}")
    public void deleteFood(@PathVariable Long id) {
        service.deleteFood(id);
    }
}
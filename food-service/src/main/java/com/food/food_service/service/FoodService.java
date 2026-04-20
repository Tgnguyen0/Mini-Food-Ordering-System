package com.food.food_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.food.food_service.entity.Food;
import com.food.food_service.repository.FoodRepository;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository repo;

    public List<Food> getAllFoods() {
        return repo.findAll();
    }

    public Food createFood(Food food) {
        return repo.save(food);
    }

    public Food updateFood(Long id, Food newFood) {
        Food food = repo.findById(id).orElseThrow();
        food.setName(newFood.getName());
        food.setPrice(newFood.getPrice());
        food.setDescription(newFood.getDescription());
        return repo.save(food);
    }

    public void deleteFood(Long id) {
        repo.deleteById(id);
    }
}
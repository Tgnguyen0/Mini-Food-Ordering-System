package com.food.food_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.food.food_service.entity.Food;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
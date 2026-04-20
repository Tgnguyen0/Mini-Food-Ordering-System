package com.food.food_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.food.food_service.entity.Food;
import com.food.food_service.repository.FoodRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(FoodRepository repo) {
        return args -> {
            repo.save(new Food(null, "Trà sữa", 30000, "Ngon ngọt"));
            repo.save(new Food(null, "Hamburger", 50000, "Nhanh gọn"));
            repo.save(new Food(null, "Pizza", 120000, "Phô mai"));
        };
    }
}
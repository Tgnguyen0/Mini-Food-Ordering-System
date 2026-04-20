package iuh.fit.se.user_service_onlinefood.repo;

import iuh.fit.se.user_service_onlinefood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}

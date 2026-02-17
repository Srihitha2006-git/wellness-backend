package com.wellness.backend.config;

import com.wellness.backend.model.User;
import com.wellness.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds initial data (like admin user) on application startup
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUserIfNotExists();
    }

    private void createAdminUserIfNotExists() {
        // Check if admin user already exists
        if (userRepository.existsByEmail("admin@wellness.com")) {
            System.out.println("Admin user already exists");
            return;
        }

        // Create admin user
        User adminUser = new User();
        adminUser.setName("Admin");
        adminUser.setEmail("admin@wellness.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole(User.Role.ADMIN);
        adminUser.setBio("System Administrator");

        userRepository.save(adminUser);
        System.out.println("Admin user created successfully!");
        System.out.println("Email: admin@wellness.com");
        System.out.println("Password: admin123");
    }
}

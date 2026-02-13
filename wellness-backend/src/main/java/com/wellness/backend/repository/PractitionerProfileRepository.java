package com.wellness.backend.repository;

import com.wellness.backend.model.PractitionerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PractitionerProfileRepository extends JpaRepository<PractitionerProfile, Integer> {

    // Find profile by linked User ID
    Optional<PractitionerProfile> findByUser_Id(Integer userId);

    // Check if practitioner profile already exists for a user
    boolean existsByUser_Id(Integer userId);

    // Get all verified practitioners
    List<PractitionerProfile> findByVerifiedTrue();

    // Search practitioners by specialization (case-insensitive)
    List<PractitionerProfile> findBySpecializationContainingIgnoreCase(String specialization);
}

package com.wellness.backend.service;

import com.wellness.backend.dto.PractitionerProfileDTO;
import com.wellness.backend.dto.PractitionerCreateDTO;
import com.wellness.backend.dto.PractitionerUpdateDTO;
import com.wellness.backend.dto.OnboardingStatusDTO;
import com.wellness.backend.model.PractitionerProfile;
import com.wellness.backend.model.User;
import com.wellness.backend.repository.PractitionerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PractitionerService {

    private final PractitionerProfileRepository practitionerRepository;
    private final UserService userService;

    @Autowired
    public PractitionerService(PractitionerProfileRepository practitionerRepository, UserService userService) {
        this.practitionerRepository = practitionerRepository;
        this.userService = userService;
    }

    // ================= GET ALL PRACTITIONERS =================
    @Transactional(readOnly = true)
    public List<PractitionerProfileDTO> getAllPractitioners() {
        return practitionerRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET VERIFIED PRACTITIONERS =================
    @Transactional(readOnly = true)
    public List<PractitionerProfileDTO> getAllVerifiedPractitioners() {
        return practitionerRepository.findByVerifiedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET BY PROFILE ID =================
    @Transactional(readOnly = true)
    public PractitionerProfileDTO getPractitionerById(Integer id) {
        PractitionerProfile practitioner = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found with id: " + id));

        return mapToDTO(practitioner);
    }

    // ================= GET BY USER ID =================
    @Transactional(readOnly = true)
    public PractitionerProfileDTO getPractitionerByUserId(Integer userId) {
        PractitionerProfile practitioner = practitionerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Practitioner profile not found for user: " + userId));

        return mapToDTO(practitioner);
    }

    // ================= CREATE PRACTITIONER PROFILE (PRACTITIONER ONLY) =================
    @Transactional
    public PractitionerProfileDTO createPractitionerProfile(PractitionerCreateDTO createDTO) {
        User currentUser = userService.getCurrentAuthenticatedUser();

        // Check if user is a practitioner
        if (currentUser.getRole() != User.Role.PRACTITIONER) {
            throw new AccessDeniedException("Only practitioners can create a practitioner profile");
        }

        // Check if profile already exists
        if (practitionerRepository.existsByUser_Id(currentUser.getId())) {
            throw new RuntimeException("Practitioner profile already exists for this user");
        }

        PractitionerProfile profile = new PractitionerProfile();
        profile.setUser(currentUser);
        profile.setSpecialization(createDTO.getSpecialization());
        profile.setQualifications(createDTO.getQualifications());
        profile.setExperience(createDTO.getExperience());
        profile.setVerified(false); // Default to unverified
        profile.setRating(0.0f);

        return mapToDTO(practitionerRepository.save(profile));
    }

    // ================= UPDATE PRACTITIONER PROFILE =================
    @Transactional
    public PractitionerProfileDTO updatePractitionerProfile(
            Integer id,
            PractitionerUpdateDTO updateDTO) {

        User currentUser = userService.getCurrentAuthenticatedUser();

        PractitionerProfile profile = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found with id: " + id));

        // Allow owner OR ADMIN
        if (!profile.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You are not allowed to update this practitioner profile");
        }

        if (updateDTO.getSpecialization() != null) {
            profile.setSpecialization(updateDTO.getSpecialization());
        }

        if (updateDTO.getQualifications() != null) {
            profile.setQualifications(updateDTO.getQualifications());
        }

        if (updateDTO.getExperience() != null) {
            profile.setExperience(updateDTO.getExperience());
        }

        return mapToDTO(practitionerRepository.save(profile));
    }

    // ================= VERIFY PRACTITIONER (ADMIN ONLY) =================
    @Transactional
    public PractitionerProfileDTO verifyPractitioner(Integer id, Boolean verified) {

        User currentUser = userService.getCurrentAuthenticatedUser();

        // ADMIN only
        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can verify practitioners");
        }

        PractitionerProfile profile = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found with id: " + id));

        profile.setVerified(verified);

        return mapToDTO(practitionerRepository.save(profile));
    }

    // ================= DELETE PRACTITIONER PROFILE =================
    @Transactional
    public void deletePractitionerProfile(Integer id) {

        User currentUser = userService.getCurrentAuthenticatedUser();

        PractitionerProfile profile = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found with id: " + id));

        // Allow owner OR ADMIN
        if (!profile.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You are not allowed to delete this practitioner profile");
        }

        practitionerRepository.delete(profile);
    }

    // ================= SEARCH BY SPECIALIZATION =================
    @Transactional(readOnly = true)
    public List<PractitionerProfileDTO> searchBySpecialization(String specialization) {
        return practitionerRepository
                .findBySpecializationContainingIgnoreCase(specialization)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET ONBOARDING STATUS =================
    @Transactional(readOnly = true)
    public OnboardingStatusDTO getOnboardingStatus() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        
        Optional<PractitionerProfile> profile = practitionerRepository.findByUser_Id(currentUser.getId());
        
        if (profile.isEmpty()) {
            return new OnboardingStatusDTO(false, false); // No profile exists
        }
        
        PractitionerProfile practitionerProfile = profile.get();
        return new OnboardingStatusDTO(true, practitionerProfile.getVerified()); // Profile exists and verification status
    }

    // ================= ENTITY → DTO =================
    private PractitionerProfileDTO mapToDTO(PractitionerProfile profile) {

        PractitionerProfileDTO dto = new PractitionerProfileDTO();

        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setUserName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setSpecialization(profile.getSpecialization());
        dto.setVerified(profile.getVerified());
        dto.setRating(profile.getRating());
        dto.setBio(profile.getUser().getBio());
        dto.setQualifications(profile.getQualifications());
        dto.setExperience(profile.getExperience());
        dto.setCreatedAt(profile.getCreatedAt());

        return dto;
    }
}

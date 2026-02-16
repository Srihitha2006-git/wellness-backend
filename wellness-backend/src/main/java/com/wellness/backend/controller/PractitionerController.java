package com.wellness.backend.controller;

import com.wellness.backend.dto.PractitionerProfileDTO;
import com.wellness.backend.dto.PractitionerUpdateDTO;
import com.wellness.backend.service.PractitionerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practitioners")
public class PractitionerController {

    private final PractitionerService practitionerService;

    @Autowired
    public PractitionerController(PractitionerService practitionerService) {
        this.practitionerService = practitionerService;
    }

    // ================= GET ALL (PUBLIC) =================
    @GetMapping
    public ResponseEntity<List<PractitionerProfileDTO>> getAllPractitioners() {
        return ResponseEntity.ok(practitionerService.getAllPractitioners());
    }

    // ================= GET VERIFIED (PUBLIC) =================
    @GetMapping("/verified")
    public ResponseEntity<List<PractitionerProfileDTO>> getVerifiedPractitioners() {
        return ResponseEntity.ok(practitionerService.getAllVerifiedPractitioners());
    }

    // ================= GET BY ID (PUBLIC) =================
    @GetMapping("/{id}")
    public ResponseEntity<PractitionerProfileDTO> getPractitionerById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(practitionerService.getPractitionerById(id));
    }

    // ================= GET BY USER ID (PRACTITIONER / ADMIN) =================
    @PreAuthorize("hasAnyRole('PRACTITIONER','ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<PractitionerProfileDTO> getPractitionerByUserId(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(practitionerService.getPractitionerByUserId(userId));
    }

    // ================= UPDATE PROFILE (PRACTITIONER ONLY) =================
    @PreAuthorize("hasRole('PRACTITIONER')")
    @PutMapping("/{id}")
    public ResponseEntity<PractitionerProfileDTO> updatePractitionerProfile(
            @PathVariable Integer id,
            @Valid @RequestBody PractitionerUpdateDTO updateDTO) {

        return ResponseEntity.ok(
                practitionerService.updatePractitionerProfile(id, updateDTO));
    }

    // ================= VERIFY PROFILE (ADMIN ONLY) =================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/verify")
    public ResponseEntity<PractitionerProfileDTO> verifyPractitioner(
            @PathVariable Integer id,
            @RequestParam Boolean verified) {

        return ResponseEntity.ok(
                practitionerService.verifyPractitioner(id, verified));
    }

    // ================= DELETE PROFILE (ADMIN ONLY) =================
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePractitionerProfile(
            @PathVariable Integer id) {

        practitionerService.deletePractitionerProfile(id);
        return ResponseEntity.noContent().build();
    }

    // ================= SEARCH (PUBLIC) =================
    @GetMapping("/search")
    public ResponseEntity<List<PractitionerProfileDTO>> searchBySpecialization(
            @RequestParam String specialization) {

        return ResponseEntity.ok(
                practitionerService.searchBySpecialization(specialization));
    }
}

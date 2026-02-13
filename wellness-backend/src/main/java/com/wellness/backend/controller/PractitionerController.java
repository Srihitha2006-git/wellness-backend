package com.wellness.backend.controller;

import com.wellness.backend.dto.PractitionerProfileDTO;
import com.wellness.backend.dto.PractitionerUpdateDTO;
import com.wellness.backend.service.PractitionerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practitioners")
@RequiredArgsConstructor
public class PractitionerController {

    private final PractitionerService practitionerService;

    // ================= GET ALL =================
    @GetMapping
    public ResponseEntity<List<PractitionerProfileDTO>> getAllPractitioners() {
        return ResponseEntity.ok(practitionerService.getAllPractitioners());
    }

    // ================= GET VERIFIED =================
    @GetMapping("/verified")
    public ResponseEntity<List<PractitionerProfileDTO>> getVerifiedPractitioners() {
        return ResponseEntity.ok(practitionerService.getAllVerifiedPractitioners());
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<PractitionerProfileDTO> getPractitionerById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(practitionerService.getPractitionerById(id));
    }

    // ================= GET BY USER ID =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<PractitionerProfileDTO> getPractitionerByUserId(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(practitionerService.getPractitionerByUserId(userId));
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<PractitionerProfileDTO> updatePractitionerProfile(
            @PathVariable Integer id,
            @Valid @RequestBody PractitionerUpdateDTO updateDTO) {

        return ResponseEntity.ok(
                practitionerService.updatePractitionerProfile(id, updateDTO));
    }

    // ================= VERIFY (ADMIN ONLY) =================
    @PutMapping("/{id}/verify")
    public ResponseEntity<PractitionerProfileDTO> verifyPractitioner(
            @PathVariable Integer id,
            @RequestParam Boolean verified) {

        return ResponseEntity.ok(
                practitionerService.verifyPractitioner(id, verified));
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePractitionerProfile(
            @PathVariable Integer id) {

        practitionerService.deletePractitionerProfile(id);
        return ResponseEntity.noContent().build();
    }

    // ================= SEARCH =================
    @GetMapping("/search")
    public ResponseEntity<List<PractitionerProfileDTO>> searchBySpecialization(
            @RequestParam String specialization) {

        return ResponseEntity.ok(
                practitionerService.searchBySpecialization(specialization));
    }
}

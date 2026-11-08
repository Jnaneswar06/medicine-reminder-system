package com.jnaneswar.medicinereminder.controller;

import com.jnaneswar.medicinereminder.dto.MedicineRequest;
import com.jnaneswar.medicinereminder.dto.MedicineResponse;
import com.jnaneswar.medicinereminder.model.MedicineStatus;
import com.jnaneswar.medicinereminder.security.UserPrincipal;
import com.jnaneswar.medicinereminder.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping
    public ResponseEntity<MedicineResponse> createMedicine(
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MedicineResponse response = medicineService.createMedicine(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) MedicineStatus status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<MedicineResponse> medicines = medicineService.getAllMedicines(currentUser.getId(), search, status);
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicineById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MedicineResponse response = medicineService.getMedicineById(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(
            @PathVariable String id,
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MedicineResponse response = medicineService.updateMedicine(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        medicineService.deleteMedicine(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/taken")
    public ResponseEntity<MedicineResponse> markAsTaken(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MedicineResponse response = medicineService.markAsTaken(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }
}

package com.jnaneswar.medicinereminder.controller;

import com.jnaneswar.medicinereminder.dto.DrugInfoResponse;
import com.jnaneswar.medicinereminder.dto.DrugSuggestionResponse;
import com.jnaneswar.medicinereminder.service.DrugInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drugs")
public class DrugInfoController {

    private final DrugInfoService drugInfoService;

    public DrugInfoController(DrugInfoService drugInfoService) {
        this.drugInfoService = drugInfoService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<DrugSuggestionResponse>> searchSuggestions(@RequestParam(required = false, defaultValue = "") String query) {
        List<DrugSuggestionResponse> suggestions = drugInfoService.searchDrugSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/info")
    public ResponseEntity<DrugInfoResponse> getDrugInfo(@RequestParam String name) {
        DrugInfoResponse response = drugInfoService.fetchDrugInfoFromFDA(name);
        return ResponseEntity.ok(response);
    }
}

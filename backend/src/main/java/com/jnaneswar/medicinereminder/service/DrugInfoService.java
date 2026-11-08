package com.jnaneswar.medicinereminder.service;

import com.jnaneswar.medicinereminder.dto.DrugInfoResponse;
import com.jnaneswar.medicinereminder.dto.DrugSuggestionResponse;

import java.util.List;

public interface DrugInfoService {
    List<DrugSuggestionResponse> searchDrugSuggestions(String query);
    DrugInfoResponse fetchDrugInfoFromFDA(String drugName);
}

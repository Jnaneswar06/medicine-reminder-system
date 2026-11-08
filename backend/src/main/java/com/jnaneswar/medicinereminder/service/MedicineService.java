package com.jnaneswar.medicinereminder.service;

import com.jnaneswar.medicinereminder.dto.MedicineRequest;
import com.jnaneswar.medicinereminder.dto.MedicineResponse;
import com.jnaneswar.medicinereminder.model.MedicineStatus;

import java.util.List;

public interface MedicineService {
    MedicineResponse createMedicine(MedicineRequest request, String userId);

    List<MedicineResponse> getAllMedicines(String userId, String search, MedicineStatus status);

    MedicineResponse getMedicineById(String id, String userId);

    MedicineResponse updateMedicine(String id, MedicineRequest request, String userId);

    void deleteMedicine(String id, String userId);

    MedicineResponse markAsTaken(String id, String userId);
}

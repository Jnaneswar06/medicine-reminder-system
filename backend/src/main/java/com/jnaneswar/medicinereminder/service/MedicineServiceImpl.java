package com.jnaneswar.medicinereminder.service;

import com.jnaneswar.medicinereminder.dto.MedicineRequest;
import com.jnaneswar.medicinereminder.dto.MedicineResponse;
import com.jnaneswar.medicinereminder.exception.ResourceNotFoundException;
import com.jnaneswar.medicinereminder.model.Medicine;
import com.jnaneswar.medicinereminder.model.MedicineStatus;
import com.jnaneswar.medicinereminder.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @Override
    public MedicineResponse createMedicine(MedicineRequest request, String userId) {
        Medicine medicine = new Medicine();
        medicine.setUserId(userId);
        medicine.setName(request.getName().trim());
        medicine.setDosage(request.getDosage().trim());
        medicine.setFrequency(request.getFrequency().trim());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        medicine.setReminderTime(request.getReminderTime());
        medicine.setInstructions(request.getInstructions() != null ? request.getInstructions().trim() : "");
        medicine.setStatus(request.getStatus() != null ? request.getStatus() : MedicineStatus.ACTIVE);
        medicine.setCreatedAt(LocalDateTime.now());

        Medicine savedMedicine = medicineRepository.save(medicine);
        return mapToResponse(savedMedicine);
    }

    @Override
    public List<MedicineResponse> getAllMedicines(String userId, String search, MedicineStatus status) {
        List<Medicine> medicines;

        if (StringUtils.hasText(search)) {
            medicines = medicineRepository.findByUserIdAndNameContainingIgnoreCase(userId, search.trim());
        } else if (status != null) {
            medicines = medicineRepository.findByUserIdAndStatus(userId, status);
        } else {
            medicines = medicineRepository.findByUserId(userId);
        }

        return medicines.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineResponse getMedicineById(String id, String userId) {
        Medicine medicine = medicineRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        return mapToResponse(medicine);
    }

    @Override
    public MedicineResponse updateMedicine(String id, MedicineRequest request, String userId) {
        Medicine medicine = medicineRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        medicine.setName(request.getName().trim());
        medicine.setDosage(request.getDosage().trim());
        medicine.setFrequency(request.getFrequency().trim());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        medicine.setReminderTime(request.getReminderTime());
        if (request.getInstructions() != null) {
            medicine.setInstructions(request.getInstructions().trim());
        }
        if (request.getStatus() != null) {
            medicine.setStatus(request.getStatus());
        }

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToResponse(updatedMedicine);
    }

    @Override
    public void deleteMedicine(String id, String userId) {
        Medicine medicine = medicineRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        medicineRepository.delete(medicine);
    }

    @Override
    public MedicineResponse markAsTaken(String id, String userId) {
        Medicine medicine = medicineRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        medicine.setStatus(MedicineStatus.TAKEN);
        medicine.setLastTakenAt(LocalDateTime.now());

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToResponse(updatedMedicine);
    }

    private MedicineResponse mapToResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getDosage(),
                medicine.getFrequency(),
                medicine.getStartDate(),
                medicine.getEndDate(),
                medicine.getReminderTime(),
                medicine.getInstructions(),
                medicine.getStatus(),
                medicine.getCreatedAt(),
                medicine.getLastTakenAt()
        );
    }
}

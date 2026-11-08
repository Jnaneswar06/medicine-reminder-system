package com.jnaneswar.medicinereminder.service;

import com.jnaneswar.medicinereminder.dto.MedicineRequest;
import com.jnaneswar.medicinereminder.dto.MedicineResponse;
import com.jnaneswar.medicinereminder.exception.ResourceNotFoundException;
import com.jnaneswar.medicinereminder.model.Medicine;
import com.jnaneswar.medicinereminder.model.MedicineStatus;
import com.jnaneswar.medicinereminder.repository.MedicineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MedicineServiceTest {

    @Mock
    private MedicineRepository medicineRepository;

    @InjectMocks
    private MedicineServiceImpl medicineService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createMedicine_Success() {
        MedicineRequest request = new MedicineRequest(
                "Paracetamol", "500mg", "Twice a day",
                LocalDate.now(), LocalDate.now().plusDays(7),
                LocalTime.of(9, 0), "Take after food", MedicineStatus.ACTIVE
        );

        Medicine savedMedicine = new Medicine(
                "med123", "user1", "Paracetamol", "500mg", "Twice a day",
                LocalDate.now(), LocalDate.now().plusDays(7),
                LocalTime.of(9, 0), "Take after food", MedicineStatus.ACTIVE, null
        );

        when(medicineRepository.save(any(Medicine.class))).thenReturn(savedMedicine);

        MedicineResponse response = medicineService.createMedicine(request, "user1");

        assertNotNull(response);
        assertEquals("med123", response.getId());
        assertEquals("Paracetamol", response.getName());
        assertEquals(MedicineStatus.ACTIVE, response.getStatus());
    }

    @Test
    void getAllMedicines_UserIsolation() {
        Medicine med1 = new Medicine("m1", "user1", "Paracetamol", "500mg", "Daily", LocalDate.now(), null, LocalTime.now(), "", MedicineStatus.ACTIVE, null);

        when(medicineRepository.findByUserId("user1")).thenReturn(List.of(med1));

        List<MedicineResponse> response = medicineService.getAllMedicines("user1", null, null);

        assertEquals(1, response.size());
        assertEquals("Paracetamol", response.get(0).getName());
        verify(medicineRepository, times(1)).findByUserId("user1");
    }

    @Test
    void getMedicineById_NotFound_ThrowsException() {
        when(medicineRepository.findByIdAndUserId("med999", "user1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> medicineService.getMedicineById("med999", "user1"));
    }

    @Test
    void markAsTaken_Success() {
        Medicine med = new Medicine("m1", "user1", "Paracetamol", "500mg", "Daily", LocalDate.now(), null, LocalTime.now(), "", MedicineStatus.ACTIVE, null);

        when(medicineRepository.findByIdAndUserId("m1", "user1")).thenReturn(Optional.of(med));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MedicineResponse response = medicineService.markAsTaken("m1", "user1");

        assertNotNull(response);
        assertEquals(MedicineStatus.TAKEN, response.getStatus());
        assertNotNull(response.getLastTakenAt());
    }
}

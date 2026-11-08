package com.jnaneswar.medicinereminder.repository;

import com.jnaneswar.medicinereminder.model.Medicine;
import com.jnaneswar.medicinereminder.model.MedicineStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {

    List<Medicine> findByUserId(String userId);

    List<Medicine> findByUserIdAndStatus(String userId, MedicineStatus status);

    List<Medicine> findByUserIdAndNameContainingIgnoreCase(String userId, String name);

    Optional<Medicine> findByIdAndUserId(String id, String userId);

    boolean existsByIdAndUserId(String id, String userId);
}

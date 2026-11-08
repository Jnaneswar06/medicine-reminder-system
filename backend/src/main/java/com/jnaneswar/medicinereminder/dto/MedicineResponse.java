package com.jnaneswar.medicinereminder.dto;

import com.jnaneswar.medicinereminder.model.MedicineStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class MedicineResponse {

    private String id;
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime reminderTime;
    private String instructions;
    private MedicineStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastTakenAt;

    public MedicineResponse() {
    }

    public MedicineResponse(String id, String name, String dosage, String frequency,
                            LocalDate startDate, LocalDate endDate, LocalTime reminderTime,
                            String instructions, MedicineStatus status,
                            LocalDateTime createdAt, LocalDateTime lastTakenAt) {
        this.id = id;
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reminderTime = reminderTime;
        this.instructions = instructions;
        this.status = status;
        this.createdAt = createdAt;
        this.lastTakenAt = lastTakenAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public MedicineStatus getStatus() {
        return status;
    }

    public void setStatus(MedicineStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastTakenAt() {
        return lastTakenAt;
    }

    public void setLastTakenAt(LocalDateTime lastTakenAt) {
        this.lastTakenAt = lastTakenAt;
    }
}

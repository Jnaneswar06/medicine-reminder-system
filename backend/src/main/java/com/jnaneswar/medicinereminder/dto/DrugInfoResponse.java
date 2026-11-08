package com.jnaneswar.medicinereminder.dto;

public class DrugInfoResponse {

    private boolean found;
    private String query;
    private String brandName;
    private String genericName;
    private String category;
    private String idealDosage;
    private String idealFrequency;
    private String purpose;
    private String warnings;
    private String sideEffects;
    private String activeIngredient;
    private String usage;

    public DrugInfoResponse() {
    }

    public DrugInfoResponse(boolean found, String query) {
        this.found = found;
        this.query = query;
    }

    public DrugInfoResponse(boolean found, String query, String brandName, String genericName,
                            String category, String idealDosage, String idealFrequency, String purpose,
                            String warnings, String sideEffects, String activeIngredient, String usage) {
        this.found = found;
        this.query = query;
        this.brandName = brandName;
        this.genericName = genericName;
        this.category = category;
        this.idealDosage = idealDosage;
        this.idealFrequency = idealFrequency;
        this.purpose = purpose;
        this.warnings = warnings;
        this.sideEffects = sideEffects;
        this.activeIngredient = activeIngredient;
        this.usage = usage;
    }

    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getIdealDosage() {
        return idealDosage;
    }

    public void setIdealDosage(String idealDosage) {
        this.idealDosage = idealDosage;
    }

    public String getIdealFrequency() {
        return idealFrequency;
    }

    public void setIdealFrequency(String idealFrequency) {
        this.idealFrequency = idealFrequency;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getWarnings() {
        return warnings;
    }

    public void setWarnings(String warnings) {
        this.warnings = warnings;
    }

    public String getSideEffects() {
        return sideEffects;
    }

    public void setSideEffects(String sideEffects) {
        this.sideEffects = sideEffects;
    }

    public String getActiveIngredient() {
        return activeIngredient;
    }

    public void setActiveIngredient(String activeIngredient) {
        this.activeIngredient = activeIngredient;
    }

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }
}

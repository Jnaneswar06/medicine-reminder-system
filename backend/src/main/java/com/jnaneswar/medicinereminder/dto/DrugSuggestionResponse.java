package com.jnaneswar.medicinereminder.dto;

public class DrugSuggestionResponse {
    private String name;
    private String category;
    private String defaultDosage;
    private String defaultFrequency;
    private String defaultInstructions;

    public DrugSuggestionResponse() {
    }

    public DrugSuggestionResponse(String name, String category, String defaultDosage, String defaultFrequency, String defaultInstructions) {
        this.name = name;
        this.category = category;
        this.defaultDosage = defaultDosage;
        this.defaultFrequency = defaultFrequency;
        this.defaultInstructions = defaultInstructions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDefaultDosage() {
        return defaultDosage;
    }

    public void setDefaultDosage(String defaultDosage) {
        this.defaultDosage = defaultDosage;
    }

    public String getDefaultFrequency() {
        return defaultFrequency;
    }

    public void setDefaultFrequency(String defaultFrequency) {
        this.defaultFrequency = defaultFrequency;
    }

    public String getDefaultInstructions() {
        return defaultInstructions;
    }

    public void setDefaultInstructions(String defaultInstructions) {
        this.defaultInstructions = defaultInstructions;
    }
}

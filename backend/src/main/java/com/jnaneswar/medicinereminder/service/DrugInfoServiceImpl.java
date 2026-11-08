package com.jnaneswar.medicinereminder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jnaneswar.medicinereminder.dto.DrugInfoResponse;
import com.jnaneswar.medicinereminder.dto.DrugSuggestionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DrugInfoServiceImpl implements DrugInfoService {

    private static final Logger logger = LoggerFactory.getLogger(DrugInfoServiceImpl.class);
    private static final String FDA_API_URL = "https://api.fda.gov/drug/label.json";
    private static final String RXNORM_API_URL = "https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Comprehensive clinical medicine knowledge database
    private static final List<DrugDetail> CLINICAL_DATABASE = new ArrayList<>();

    static {
        CLINICAL_DATABASE.add(new DrugDetail("Paracetamol", "Acetaminophen", "Analgesic & Antipyretic", "500mg - 650mg", "Every 6 hours (As needed)", "Pain relief and fever reduction", "Take after food with warm water", "Avoid alcohol while taking this medicine. Max 4000mg/day.", "Nausea, mild allergic reaction if sensitive"));
        CLINICAL_DATABASE.add(new DrugDetail("Dolo 650", "Paracetamol", "Analgesic & Antipyretic", "650mg", "Twice a day", "Fever and mild to moderate pain", "Take after meals with water", "Do not exceed 4 tablets in 24 hours.", "Mild drowsiness, rare liver toxicity if overdosed"));
        CLINICAL_DATABASE.add(new DrugDetail("Ibuprofen", "Ibuprofen", "NSAID / Anti-inflammatory", "200mg - 400mg", "Every 8 hours", "Inflammation, joint pain, dental pain", "Take strictly with or after food", "May cause stomach irritation. Avoid on empty stomach.", "Heartburn, abdominal pain, mild dizziness"));
        CLINICAL_DATABASE.add(new DrugDetail("Amoxicillin", "Amoxicillin", "Antibiotic (Penicillin class)", "250mg - 500mg", "Three times a day", "Bacterial infections (throat, chest, ear)", "Take at evenly spaced intervals with food", "Complete full prescribed course even if symptoms disappear.", "Mild diarrhea, skin rash, allergic reaction"));
        CLINICAL_DATABASE.add(new DrugDetail("Azithromycin", "Azithromycin", "Antibiotic (Macrolide)", "250mg - 500mg", "Once a day", "Respiratory tract infections & bronchitis", "Take 1 hour before or 2 hours after meals", "Do not skip doses. Report severe stomach cramps.", "Nausea, abdominal cramps, temporary diarrhea"));
        CLINICAL_DATABASE.add(new DrugDetail("Metformin", "Metformin HCl", "Antidiabetic", "500mg - 1000mg", "Twice a day", "Type 2 Diabetes mellitus management", "Take with meals to minimize stomach upset", "Monitor blood glucose regularly.", "GI discomfort, metallic taste, vitamin B12 deficiency"));
        CLINICAL_DATABASE.add(new DrugDetail("Pantoprazole", "Pantoprazole Sodium", "Proton Pump Inhibitor (PPI)", "40mg", "Once a day", "Acidity, GERD, gastric ulcer prevention", "Take 30 minutes before morning breakfast", "Swallow tablet whole; do not crush or chew.", "Headache, mild flatulence, joint stiffness"));
        CLINICAL_DATABASE.add(new DrugDetail("Omeprazole", "Omeprazole", "Proton Pump Inhibitor (PPI)", "20mg - 40mg", "Once a day", "Heartburn, acid reflux, stomach ulcer", "Take in the morning on an empty stomach", "Long-term use may lower magnesium levels.", "Abdominal pain, headache, mild nausea"));
        CLINICAL_DATABASE.add(new DrugDetail("Cetirizine", "Cetirizine HCl", "Antihistamine", "10mg", "Once a day (At night)", "Allergic rhinitis, sneezing, hives, itching", "Take at bedtime with water", "May cause drowsiness. Avoid driving after taking.", "Drowsiness, dry mouth, mild fatigue"));
        CLINICAL_DATABASE.add(new DrugDetail("Montelukast", "Montelukast Sodium", "Leukotriene Receptor Antagonist", "10mg", "Once a day (Evening)", "Asthma management & seasonal allergies", "Take in the evening with or without food", "Not intended for acute asthma attacks.", "Headache, nasal congestion, mild cough"));
        CLINICAL_DATABASE.add(new DrugDetail("Atorvastatin", "Atorvastatin Calcium", "Statin (Cholesterol lowering)", "10mg - 40mg", "Once a day (At night)", "High cholesterol & cardiovascular risk reduction", "Take at night for maximum cholesterol synthesis inhibition", "Report unexplained muscle pain immediately.", "Muscle pain, elevated liver enzymes, mild indigestion"));
        CLINICAL_DATABASE.add(new DrugDetail("Amlodipine", "Amlodipine Besylate", "Calcium Channel Blocker", "5mg - 10mg", "Once a day", "Hypertension & angina prevention", "Take at the same time every morning", "Monitor blood pressure regularly.", "Ankle swelling, flushing, mild dizziness"));
        CLINICAL_DATABASE.add(new DrugDetail("Telmisartan", "Telmisartan", "Angiotensin Receptor Blocker", "40mg - 80mg", "Once a day", "High blood pressure & kidney protection", "Take in the morning with a glass of water", "Do not take during pregnancy.", "Dizziness, back pain, mild fatigue"));
        CLINICAL_DATABASE.add(new DrugDetail("Lisinopril", "Lisinopril", "ACE Inhibitor", "10mg - 20mg", "Once a day", "Hypertension & heart failure management", "Take consistently every morning", "May cause a dry cough. Inform doctor if persistent.", "Dry persistent cough, dizziness, elevated potassium"));
        CLINICAL_DATABASE.add(new DrugDetail("Metoprolol", "Metoprolol Succinate", "Beta Blocker", "25mg - 50mg", "Once a day", "High blood pressure & angina", "Take with or immediately after food", "Do not stop abruptly without medical advice.", "Slow heart rate, cold hands/feet, tiredness"));
        CLINICAL_DATABASE.add(new DrugDetail("Aspirin", "Acetylsalicylic Acid", "Antiplatelet / Analgesic", "75mg - 150mg", "Once a day", "Heart attack prevention & blood thinning", "Take immediately after food", "Consult doctor if undergoing any surgery.", "Stomach discomfort, increased bleeding risk"));
        CLINICAL_DATABASE.add(new DrugDetail("Ciprofloxacin", "Ciprofloxacin", "Fluoroquinolone Antibiotic", "250mg - 500mg", "Twice a day", "Urinary tract & GI infections", "Take with plenty of water. Avoid dairy products nearby.", "Avoid prolonged sun exposure during treatment.", "Nausea, tendon discomfort, mild lightheadedness"));
        CLINICAL_DATABASE.add(new DrugDetail("Levothyroxine", "Levothyroxine Sodium", "Thyroid Hormone", "25mcg - 100mcg", "Once a day", "Hypothyroidism thyroid hormone replacement", "Take early morning on empty stomach 30 mins before food", "Do not take calcium or iron supplements together.", "Palpitations, weight loss, heat intolerance if overdosed"));
        CLINICAL_DATABASE.add(new DrugDetail("Gabapentin", "Gabapentin", "Anticonvulsant / Neuropathic", "300mg", "Three times a day", "Nerve pain & neuropathy relief", "Take with or without food", "Do not discontinue abruptly.", "Drowsiness, dizziness, unsteadiness"));
        CLINICAL_DATABASE.add(new DrugDetail("Prednisone", "Prednisone", "Corticosteroid", "5mg - 20mg", "Once a day", "Severe allergic reactions & anti-inflammation", "Take in the morning with food", "Taper off gradually under medical supervision.", "Increased appetite, insomnia, mild fluid retention"));
        CLINICAL_DATABASE.add(new DrugDetail("Ondansetron", "Ondansetron", "Antiemetic", "4mg - 8mg", "As needed", "Nausea and vomiting prevention", "Place dissolve-in-mouth tablet or take with water", "Take 30 minutes before meals when needed.", "Headache, constipation, sensation of warmth"));
        CLINICAL_DATABASE.add(new DrugDetail("Ranitidine", "Ranitidine", "H2 Blocker", "150mg", "Twice a day", "Stomach acid reduction & ulcer relief", "Take 30 to 60 minutes before meal", "Consult doctor for chronic heartburn.", "Headache, mild fatigue, skin itching"));
        CLINICAL_DATABASE.add(new DrugDetail("Losartan", "Losartan Potassium", "Angiotensin Receptor Blocker", "25mg - 50mg", "Once a day", "Hypertension & stroke risk reduction", "Take in the morning with water", "Avoid potassium supplements without doctor advice.", "Dizziness, nasal congestion, fatigue"));
        CLINICAL_DATABASE.add(new DrugDetail("Crocin 500", "Paracetamol", "Analgesic & Antipyretic", "500mg", "Every 6 hours", "Fever, body pain, headache", "Take after food with water", "Maximum 4 tablets per day.", "Mild drowsiness, rare skin allergy"));
    }

    public DrugInfoServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<DrugSuggestionResponse> searchDrugSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return CLINICAL_DATABASE.stream()
                    .limit(10)
                    .map(d -> new DrugSuggestionResponse(d.name, d.category, d.idealDosage, d.idealFrequency, d.idealInstructions))
                    .collect(Collectors.toList());
        }

        String cleanQuery = query.trim().toLowerCase();

        List<DrugSuggestionResponse> matches = CLINICAL_DATABASE.stream()
                .filter(d -> d.name.toLowerCase().contains(cleanQuery) ||
                             d.genericName.toLowerCase().contains(cleanQuery) ||
                             d.category.toLowerCase().contains(cleanQuery))
                .sorted(Comparator.comparing((DrugDetail d) -> !d.name.toLowerCase().startsWith(cleanQuery))
                        .thenComparing(d -> d.name))
                .map(d -> new DrugSuggestionResponse(d.name, d.category, d.idealDosage, d.idealFrequency, d.idealInstructions))
                .collect(Collectors.toList());

        if (matches.size() < 5) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(RXNORM_API_URL)
                        .queryParam("name", cleanQuery)
                        .toUriString();
                String jsonStr = restTemplate.getForObject(url, String.class);
                if (jsonStr != null) {
                    JsonNode root = objectMapper.readTree(jsonStr);
                    JsonNode suggestions = root.path("suggestionGroup").path("suggestionList").path("suggestion");
                    if (suggestions.isArray()) {
                        Set<String> existingNames = matches.stream().map(m -> m.getName().toLowerCase()).collect(Collectors.toSet());
                        for (JsonNode s : suggestions) {
                            String sugName = s.asText();
                            if (!existingNames.contains(sugName.toLowerCase())) {
                                matches.add(new DrugSuggestionResponse(sugName, "General Medication", "Consult Doctor", "Once a day", "Take as directed by doctor"));
                                existingNames.add(sugName.toLowerCase());
                                if (matches.size() >= 10) break;
                            }
                        }
                    }
                }
            } catch (Exception ex) {
                logger.debug("RxNorm suggestion lookup error: {}", ex.getMessage());
            }
        }

        return matches.stream().limit(10).collect(Collectors.toList());
    }

    @Override
    public DrugInfoResponse fetchDrugInfoFromFDA(String drugName) {
        if (drugName == null || drugName.trim().isEmpty()) {
            return new DrugInfoResponse(false, drugName);
        }

        String cleanName = drugName.trim();
        String lowerName = cleanName.toLowerCase();

        Optional<DrugDetail> clinicalMatch = CLINICAL_DATABASE.stream()
                .filter(d -> d.name.toLowerCase().equals(lowerName) || d.genericName.toLowerCase().equals(lowerName) || d.name.toLowerCase().contains(lowerName))
                .findFirst();

        String brandName = cleanName;
        String genericName = "N/A";
        String category = "Pharmaceutical Medication";
        String idealDosage = "Consult Doctor";
        String idealFrequency = "Once a day";
        String purpose = "Relief of symptoms";
        String usage = "Take as prescribed by doctor";
        String warnings = "Consult healthcare professional before use.";
        String sideEffects = "Nausea, dizziness if unmonitored.";
        String activeIngredient = cleanName;

        if (clinicalMatch.isPresent()) {
            DrugDetail d = clinicalMatch.get();
            brandName = d.name;
            genericName = d.genericName;
            category = d.category;
            idealDosage = d.idealDosage;
            idealFrequency = d.idealFrequency;
            purpose = d.purpose;
            usage = d.idealInstructions;
            warnings = d.warnings;
            sideEffects = d.sideEffects;
            activeIngredient = d.genericName + " (" + d.idealDosage + ")";
        }

        try {
            String searchQuery = String.format("openfda.brand_name:\"%s\" OR openfda.substance_name:\"%s\" OR openfda.generic_name:\"%s\"", cleanName, cleanName, cleanName);
            String url = UriComponentsBuilder.fromHttpUrl(FDA_API_URL)
                    .queryParam("search", searchQuery)
                    .queryParam("limit", 1)
                    .toUriString();

            String jsonResponse = restTemplate.getForObject(url, String.class);
            if (jsonResponse != null) {
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode results = root.path("results");
                if (results.isArray() && !results.isEmpty()) {
                    JsonNode drug = results.get(0);
                    JsonNode openfda = drug.path("openfda");

                    String fdaBrand = getFirstString(openfda.path("brand_name"), brandName);
                    String fdaGeneric = getFirstString(openfda.path("generic_name"), genericName);
                    String fdaIngredient = getFirstString(drug.path("active_ingredient"), activeIngredient);
                    String fdaPurpose = getFirstString(drug.path("purpose"), purpose);
                    String fdaIndications = getFirstString(drug.path("indications_and_usage"), usage);
                    String fdaWarnings = getFirstString(drug.path("warnings"), warnings);

                    return new DrugInfoResponse(
                            true,
                            cleanName,
                            fdaBrand,
                            fdaGeneric,
                            category,
                            idealDosage,
                            idealFrequency,
                            fdaPurpose,
                            truncateString(fdaWarnings, 500),
                            sideEffects,
                            truncateString(fdaIngredient, 200),
                            truncateString(fdaIndications, 500)
                    );
                }
            }
        } catch (Exception ex) {
            logger.debug("OpenFDA fallback error for query {}: {}", cleanName, ex.getMessage());
        }

        return new DrugInfoResponse(
                true,
                cleanName,
                brandName,
                genericName,
                category,
                idealDosage,
                idealFrequency,
                purpose,
                warnings,
                sideEffects,
                activeIngredient,
                usage
        );
    }

    private String getFirstString(JsonNode node, String defaultValue) {
        if (node.isArray() && !node.isEmpty()) {
            return node.get(0).asText();
        } else if (node.isTextual()) {
            return node.asText();
        }
        return defaultValue;
    }

    private String truncateString(String str, int maxLength) {
        if (str != null && str.length() > maxLength) {
            return str.substring(0, maxLength) + "...";
        }
        return str;
    }

    private static class DrugDetail {
        String name;
        String genericName;
        String category;
        String idealDosage;
        String idealFrequency;
        String purpose;
        String idealInstructions;
        String warnings;
        String sideEffects;

        DrugDetail(String name, String genericName, String category, String idealDosage, String idealFrequency, String purpose, String idealInstructions, String warnings, String sideEffects) {
            this.name = name;
            this.genericName = genericName;
            this.category = category;
            this.idealDosage = idealDosage;
            this.idealFrequency = idealFrequency;
            this.purpose = purpose;
            this.idealInstructions = idealInstructions;
            this.warnings = warnings;
            this.sideEffects = sideEffects;
        }
    }
}

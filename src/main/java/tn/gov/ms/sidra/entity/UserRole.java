package tn.gov.ms.sidra.entity;

public enum UserRole {
    SUPER_ADMIN("Super Administrateur"),
    ADMIN_STRUCTURE("Administrateur Structure"),
    UTILISATEUR("Utilisateur"),
    EXTERNE("Utilisateur Externe");

    private final String label;

    UserRole(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
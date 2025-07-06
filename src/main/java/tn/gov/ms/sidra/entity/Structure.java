package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "structures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Structure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la structure est obligatoire")
    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeStructure type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gouvernorat_id", nullable = false)
    private Gouvernorat gouvernorat;

    @Column(nullable = false)
    private String secteur;

    private String adresse;

    private String telephone;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @OneToMany(mappedBy = "structure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> utilisateurs;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}
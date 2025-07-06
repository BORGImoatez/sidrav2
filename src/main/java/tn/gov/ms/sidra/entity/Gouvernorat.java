package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "gouvernorats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Gouvernorat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du gouvernorat est obligatoire")
    @Column(nullable = false, unique = true)
    private String nom;

    @NotBlank(message = "Le code ISO3 est obligatoire")
    @Column(name = "code_iso3", nullable = false, unique = true, length = 3)
    private String codeIso3;

    @OneToMany(mappedBy = "gouvernorat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Structure> structures;

    @OneToMany(mappedBy = "gouvernorat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Delegation> delegations;
}
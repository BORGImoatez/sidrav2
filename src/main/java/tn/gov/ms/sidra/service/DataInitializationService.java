package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.entity.Gouvernorat;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.TypeStructure;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.repository.GouvernoratRepository;
import tn.gov.ms.sidra.repository.StructureRepository;
import tn.gov.ms.sidra.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GouvernoratRepository gouvernoratRepository;
    private final StructureRepository structureRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeGouvernorats();
        initializeStructures();
        initializeDefaultSuperAdmin();
    }

    /**
     * Initialise les gouvernorats de la Tunisie
     */
    private void initializeGouvernorats() {
        log.info("Initialisation des gouvernorats...");
        
        if (gouvernoratRepository.count() == 0) {
            String[][] gouvernoratsData = {
                {"Tunis", "TUN"}, {"Ariana", "ARI"}, {"Ben Arous", "BEN"}, {"Manouba", "MAN"},
                {"Nabeul", "NAB"}, {"Zaghouan", "ZAG"}, {"Bizerte", "BIZ"}, {"Béja", "BEJ"},
                {"Jendouba", "JEN"}, {"Kef", "KEF"}, {"Siliana", "SIL"}, {"Sousse", "SOU"},
                {"Monastir", "MON"}, {"Mahdia", "MAH"}, {"Sfax", "SFX"}, {"Kairouan", "KAI"},
                {"Kasserine", "KAS"}, {"Sidi Bouzid", "SID"}, {"Gabès", "GAB"}, {"Médenine", "MED"},
                {"Tataouine", "TAT"}, {"Gafsa", "GAF"}, {"Tozeur", "TOZ"}, {"Kébili", "KEB"}
            };
            
            for (String[] data : gouvernoratsData) {
                Gouvernorat gouvernorat = new Gouvernorat();
                gouvernorat.setNom(data[0]);
                gouvernorat.setCodeIso3(data[1]);
                gouvernoratRepository.save(gouvernorat);
            }
            
            log.info("✅ {} gouvernorats initialisés", gouvernoratsData.length);
        } else {
            log.info("✅ Gouvernorats déjà initialisés");
        }
    }
    
    /**
     * Initialise quelques structures par défaut
     */
    private void initializeStructures() {
        log.info("Initialisation des structures par défaut...");
        
        if (structureRepository.count() == 0) {
            Gouvernorat tunis = gouvernoratRepository.findByNom("Tunis").orElse(null);
            Gouvernorat sfax = gouvernoratRepository.findByNom("Sfax").orElse(null);
            
            if (tunis != null) {
                // Structures publiques
                createStructure("Hôpital Charles Nicolle", TypeStructure.PUBLIQUE, tunis, "Ministère de la Santé");
                createStructure("Hôpital La Rabta", TypeStructure.PUBLIQUE, tunis, "Ministère de la Santé");
                
                // Structure privée
                createStructure("Clinique Avicenne", TypeStructure.PRIVEE, tunis, "Secteur Privé");
                
                // ONG
                createStructure("Association Tunisienne de Lutte contre les Drogues", TypeStructure.ONG, tunis, "ATLD");
            }
            
            if (sfax != null) {
                createStructure("Hôpital Habib Bourguiba", TypeStructure.PUBLIQUE, sfax, "Ministère de la Santé");
            }
            
            log.info("✅ Structures par défaut initialisées");
        } else {
            log.info("✅ Structures déjà initialisées");
        }
    }
    
    private void createStructure(String nom, TypeStructure type, Gouvernorat gouvernorat, String secteur) {
        Structure structure = new Structure();
        structure.setNom(nom);
        structure.setType(type);
        structure.setGouvernorat(gouvernorat);
        structure.setSecteur(secteur);
        structure.setActif(true);
        structureRepository.save(structure);
    }

    /**
     * Crée un utilisateur SUPER_ADMIN par défaut s'il n'en existe aucun
     */
    private void initializeDefaultSuperAdmin() {
        log.info("Vérification de l'existence d'un utilisateur SUPER_ADMIN...");

        // Vérifier s'il existe déjà un SUPER_ADMIN
        boolean superAdminExists = userRepository.findByRole(UserRole.SUPER_ADMIN)
                .stream()
                .anyMatch(User::getActif);

        if (!superAdminExists) {
            log.info("Aucun utilisateur SUPER_ADMIN actif trouvé. Création du compte par défaut...");

            // Créer le SUPER_ADMIN par défaut
            User defaultSuperAdmin = new User();
            defaultSuperAdmin.setNom("Administrateur");
            defaultSuperAdmin.setPrenom("Système");
            defaultSuperAdmin.setEmail("admin@sidra.tn");
            defaultSuperAdmin.setTelephone("9518515"); // Numéro spécifié
            defaultSuperAdmin.setMotDePasse(passwordEncoder.encode("Insp2025")); // Mot de passe spécifié
            defaultSuperAdmin.setRole(UserRole.SUPER_ADMIN);
            defaultSuperAdmin.setActif(true);
            defaultSuperAdmin.setDateCreation(LocalDateTime.now());
            defaultSuperAdmin.setTentativesConnexion(0);

            try {
                userRepository.save(defaultSuperAdmin);
                log.info("✅ Utilisateur SUPER_ADMIN créé avec succès:");
                log.info("   📧 Email: {}", defaultSuperAdmin.getEmail());
                log.info("   📱 Téléphone: {}", defaultSuperAdmin.getTelephone());
                log.info("   🔑 Mot de passe: Insp2025");
                log.info("   👤 Rôle: {}", defaultSuperAdmin.getRole());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création du SUPER_ADMIN par défaut: {}", e.getMessage(), e);
            }
            
            // Créer un utilisateur EXTERNE pour les tests
            createDefaultExterneUser();
        } else {
            log.info("✅ Un utilisateur SUPER_ADMIN existe déjà. Aucune action nécessaire.");
        }
    }
    
    /**
     * Crée un utilisateur EXTERNE par défaut pour les tests
     */
    private void createDefaultExterneUser() {
        log.info("Création d'un utilisateur EXTERNE par défaut...");
        
        // Récupérer une structure par défaut
        Structure defaultStructure = structureRepository.findByNomContainingIgnoreCase("Charles Nicolle")
                .stream()
                .findFirst()
                .orElse(null);
        
        if (defaultStructure != null) {
            User externeUser = new User();
            externeUser.setNom("Externe");
            externeUser.setPrenom("Utilisateur");
            externeUser.setEmail("externe@sidra.tn");
            externeUser.setTelephone("12345678");
            externeUser.setMotDePasse(passwordEncoder.encode("123456"));
            externeUser.setRole(UserRole.EXTERNE);
            externeUser.setStructure(defaultStructure);
            externeUser.setActif(true);
            externeUser.setDateCreation(LocalDateTime.now());
            externeUser.setTentativesConnexion(0);
            
            try {
                userRepository.save(externeUser);
                log.info("✅ Utilisateur EXTERNE créé avec succès:");
                log.info("   📧 Email: {}", externeUser.getEmail());
                log.info("   📱 Téléphone: {}", externeUser.getTelephone());
                log.info("   🔑 Mot de passe: 123456");
                log.info("   👤 Rôle: {}", externeUser.getRole());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création de l'utilisateur EXTERNE: {}", e.getMessage(), e);
            }
        }
    }
}
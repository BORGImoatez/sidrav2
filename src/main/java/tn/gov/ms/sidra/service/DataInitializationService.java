package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeDefaultSuperAdmin();
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
        } else {
            log.info("✅ Un utilisateur SUPER_ADMIN existe déjà. Aucune action nécessaire.");
        }
    }
}
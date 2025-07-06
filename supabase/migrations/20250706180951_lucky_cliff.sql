-- Insertion des gouvernorats tunisiens
INSERT INTO gouvernorats (nom, code_iso3) VALUES
('Tunis', 'TUN'),
('Ariana', 'ARI'),
('Ben Arous', 'BEN'),
('Manouba', 'MAN'),
('Nabeul', 'NAB'),
('Zaghouan', 'ZAG'),
('Bizerte', 'BIZ'),
('Béja', 'BEJ'),
('Jendouba', 'JEN'),
('Kef', 'KEF'),
('Siliana', 'SIL'),
('Sousse', 'SOU'),
('Monastir', 'MON'),
('Mahdia', 'MAH'),
('Sfax', 'SFX'),
('Kairouan', 'KAI'),
('Kasserine', 'KAS'),
('Sidi Bouzid', 'SID'),
('Gabès', 'GAB'),
('Médenine', 'MED'),
('Tataouine', 'TAT'),
('Gafsa', 'GAF'),
('Tozeur', 'TOZ'),
('Kébili', 'KEB')
ON CONFLICT (nom) DO NOTHING;

-- Insertion de quelques structures de test
INSERT INTO structures (nom, type, gouvernorat_id, secteur, adresse, telephone, actif, date_creation) VALUES
('Hôpital Charles Nicolle', 'PUBLIQUE', 1, 'Ministère de la Santé', 'Boulevard 9 Avril 1938, Tunis', '71663000', true, NOW()),
('Hôpital La Rabta', 'PUBLIQUE', 1, 'Ministère de la Santé', 'Rue Jebel Lakhdhar, Tunis', '71573000', true, NOW()),
('Clinique Avicenne', 'PRIVEE', 1, 'Secteur Privé', 'Avenue Habib Bourguiba, Tunis', '71340000', true, NOW()),
('Association Tunisienne de Lutte contre les Drogues', 'ONG', 1, 'ATLD', 'Rue de la Liberté, Tunis', '71456789', true, NOW())
ON CONFLICT (nom) DO NOTHING;

-- Insertion d'un admin structure de test
-- Mot de passe: "admin123" (hashé avec BCrypt)
INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role, structure_id, actif, date_creation, tentatives_connexion) VALUES
('Bouali', 'Ahmed', 'ahmed.bouali@nicolle.tn', '+21687654321', '$2a$10$N.zmdr9k7uOLQvQHbh8biOehGklRLvdQBYsQ5UgMJmFQJIrLMjvH2', 'ADMIN_STRUCTURE', 1, true, NOW(), 0)
ON CONFLICT (email) DO NOTHING;

-- Insertion d'un utilisateur normal de test
-- Mot de passe: "user123" (hashé avec BCrypt)
INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role, structure_id, actif, date_creation, tentatives_connexion) VALUES
('Trabelsi', 'Fatma', 'fatma.trabelsi@nicolle.tn', '+21698765432', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'UTILISATEUR', 1, true, NOW(), 0)
ON CONFLICT (email) DO NOTHING;

-- Note: Le SUPER_ADMIN sera créé automatiquement au démarrage par DataInitializationService
-- si aucun SUPER_ADMIN n'existe déjà dans la base de données
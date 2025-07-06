# SIDRA Backend - API d'authentification avec OTP

## Description

Backend Spring Boot pour le système SIDRA (Système d'Information Drogue et Addiction) avec authentification à deux facteurs (2FA) utilisant des codes OTP envoyés par SMS.

## Fonctionnalités

- ✅ Authentification par email/mot de passe
- ✅ Authentification à deux facteurs (2FA) avec OTP SMS
- ✅ Gestion des rôles (SUPER_ADMIN, ADMIN_STRUCTURE, UTILISATEUR)
- ✅ Tokens JWT pour l'authentification
- ✅ Protection contre les attaques par force brute
- ✅ Gestion des tentatives de connexion et blocage temporaire
- ✅ API REST sécurisée avec Spring Security
- ✅ Base de données PostgreSQL
- ✅ Validation des données d'entrée
- ✅ Gestion centralisée des exceptions

## Technologies utilisées

- **Spring Boot 3.2.0**
- **Spring Security 6**
- **Spring Data JPA**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **BCrypt** pour le hashage des mots de passe
- **MapStruct** pour le mapping des entités
- **Lombok** pour réduire le code boilerplate

## Configuration

### Base de données

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE sidra_db;
CREATE USER sidra_user WITH PASSWORD 'sidra_password';
GRANT ALL PRIVILEGES ON DATABASE sidra_db TO sidra_user;
```

### Variables d'environnement

Configurez les variables d'environnement suivantes :

```bash
# Base de données
DB_USERNAME=sidra_user
DB_PASSWORD=sidra_password

# JWT
JWT_SECRET=mySecretKey123456789012345678901234567890

# Email (optionnel)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# SMS API (À CONFIGURER selon votre fournisseur)
SMS_API_URL=https://api.your-sms-provider.com/send
SMS_API_KEY=your-sms-api-key
SMS_SENDER=SIDRA
```

## Installation et démarrage

1. **Cloner le projet**
```bash
git clone <repository-url>
cd sidra-backend
```

2. **Installer les dépendances**
```bash
mvn clean install
```

3. **Démarrer l'application**
```bash
mvn spring-boot:run
```

L'API sera accessible sur `http://localhost:8080/api`

## Configuration SMS

⚠️ **IMPORTANT** : Vous devez configurer l'envoi de SMS dans la classe `SmsService.java`

### Étapes pour configurer l'envoi SMS :

1. **Ouvrez le fichier** `src/main/java/tn/gov/ms/sidra/service/SmsService.java`

2. **Localisez la méthode** `sendSms()` qui contient le commentaire :
   ```java
   // TODO: REMPLACER CETTE MÉTHODE PAR VOTRE IMPLÉMENTATION D'API SMS
   ```

3. **Remplacez l'implémentation générique** par votre fournisseur SMS :

#### Exemple avec Twilio :
```java
// Ajouter la dépendance Twilio dans pom.xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.14.1</version>
</dependency>

// Implémentation Twilio
Twilio.init(accountSid, authToken);
Message message = Message.creator(
    new PhoneNumber(phoneNumber),
    new PhoneNumber(smsSender),
    messageText)
    .create();
```

#### Exemple avec AWS SNS :
```java
// Ajouter la dépendance AWS SDK
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-sns</artifactId>
    <version>1.12.565</version>
</dependency>

// Implémentation AWS SNS
AmazonSNS snsClient = AmazonSNSClientBuilder.standard()
    .withRegion(Regions.EU_WEST_1)
    .build();

PublishRequest request = new PublishRequest()
    .withPhoneNumber(phoneNumber)
    .withMessage(messageText);

snsClient.publish(request);
```

## API Endpoints

### Authentification

#### POST `/api/auth/login`
Connexion par email/mot de passe

**Request:**
```json
{
  "email": "admin@sidra.tn",
  "motDePasse": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code OTP envoyé par SMS",
  "requiresOtp": true,
  "userId": 1,
  "blockedUntil": null,
  "remainingAttempts": null
}
```

#### POST `/api/auth/verify-otp`
Vérification du code OTP

**Request:**
```json
{
  "userId": 1,
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "nom": "Admin",
    "prenom": "Super",
    "email": "admin@sidra.tn",
    "role": "SUPER_ADMIN"
  }
}
```

#### POST `/api/auth/resend-otp?userId=1`
Renvoyer un nouveau code OTP

#### POST `/api/auth/logout`
Déconnexion

#### GET `/api/auth/status`
Vérifier le statut d'authentification

## Comptes de test

Les comptes suivants sont créés automatiquement :

| Email | Mot de passe | Rôle | Téléphone |
|-------|--------------|------|-----------|
| admin@sidra.tn | Insp2025 | SUPER_ADMIN | 9518515 |
| ahmed.bouali@nicolle.tn | admin123 | ADMIN_STRUCTURE | +21687654321 |
| fatma.trabelsi@nicolle.tn | user123 | UTILISATEUR | +21698765432 |

⚠️ **Note importante** : Le compte SUPER_ADMIN est créé automatiquement au premier démarrage de l'application s'il n'existe aucun utilisateur avec ce rôle.

## Sécurité

### Protection contre les attaques

- **Limitation des tentatives** : 3 tentatives de connexion maximum
- **Blocage temporaire** : 15 minutes après 3 échecs
- **Expiration OTP** : 5 minutes
- **Limitation OTP** : 3 tentatives maximum par code
- **Rate limiting** : Maximum 5 codes OTP par heure

### JWT

- **Algorithme** : HS512
- **Expiration** : 24 heures
- **Claims inclus** : userId, role, structureId

## Structure du projet

```
src/main/java/tn/gov/ms/sidra/
├── config/              # Configuration Spring
├── controller/          # Contrôleurs REST
├── dto/                # Data Transfer Objects
├── entity/             # Entités JPA
├── exception/          # Gestion des exceptions
├── mapper/             # Mappers MapStruct
├── repository/         # Repositories JPA
├── security/           # Configuration sécurité
└── service/            # Services métier
```

## Tests

Pour exécuter les tests :

```bash
mvn test
```

## Logs

Les logs sont configurés pour afficher :
- Les tentatives de connexion
- Les générations de codes OTP
- Les erreurs d'authentification
- Les actions de sécurité

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Support

Pour toute question ou problème, contactez l'équipe de développement SIDRA.
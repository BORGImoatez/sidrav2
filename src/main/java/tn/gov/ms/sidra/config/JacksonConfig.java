package tn.gov.ms.sidra.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Enregistrer le module pour les types Java 8 Time
        mapper.registerModule(new JavaTimeModule());
        
        // Désactiver l'écriture des dates comme timestamps
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Ignorer les propriétés inconnues lors de la désérialisation
        mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Gérer les références circulaires
        mapper.configure(SerializationFeature.FAIL_ON_SELF_REFERENCES, false);
        
        return mapper;
    }
}
package tn.gov.ms.sidra.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "tn.gov.ms.sidra.mapper")
public class MapperConfig {
}
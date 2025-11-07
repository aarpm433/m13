package com.rocketFoodDelivery.rocketFood.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8081",  // Expo web dev server
                        "http://localhost:19006", // Expo mobile web
                        "https://gary-nonimpressionable-imputedly.ngrok-free.dev" // ngrok
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static images publicly
        registry.addResourceHandler("/support_materials_13/**")
                .addResourceLocations("classpath:/support_materials_13/")
                .setCachePeriod(3600);
    }
}

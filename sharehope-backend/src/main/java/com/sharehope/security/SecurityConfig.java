package com.sharehope.security;

import java.nio.charset.StandardCharsets;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import com.sharehope.user.repository.UserRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("#{'${app.cors.allowed-origins}'.split(',')}")
    private List<String> corsAllowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/activate",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/public/payment-events"
                        ).permitAll()

                        .requestMatchers(
                                "/api/auth/me",
                                "/api/auth/logout",
                                "/api/auth/change-password",
                                "/api/auth/change-email",
                                "/api/auth/mfa/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/public/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/users/**"
                        ).hasRole("SUPER_ADMIN")

                        .requestMatchers(
                                "/api/admin/team/**",
                                "/api/admin/submissions/**",
                                "/api/admin/donations/**",
                                "/api/admin/newsletter/**",
                                "/api/admin/events/*/registrations/**",
                                "/api/admin/events/*/donations"
                        ).hasRole("SUPER_ADMIN")

                        .requestMatchers(
                                "/api/admin/website/**",
                                "/api/admin/programs/**",
                                "/api/admin/events/**",
                                "/api/admin/testimonials/**",
                                "/api/admin/blog/**"
                        ).hasAnyRole(
                                "SUPER_ADMIN",
                                "CONTENT_EDITOR"
                        )

                        .anyRequest().denyAll()
                )

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );

        return http.build();
    }

    /**
     * Allows the Next.js admin frontend (a different origin/port) to call
     * this API from the browser. Preflight (OPTIONS) requests are handled
     * by Spring Security itself once this is wired into the filter chain,
     * since Spring Security rejects cross-origin requests before they ever
     * reach a plain @CrossOrigin-annotated controller.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsAllowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Our JWTs are signed with a shared HMAC secret (see JwtService), not
     * validated against an OIDC issuer, so the decoder is built directly
     * from that secret rather than from issuer metadata.
     */
    @Bean
    public JwtDecoder jwtDecoder(UserRepository users) {
        SecretKeySpec secretKey = new SecretKeySpec(
                jwtSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithValidators(jwt -> {
            try {
                java.util.UUID userId = java.util.UUID.fromString(jwt.getSubject());
                Number claimVersion = jwt.getClaim("sessionVersion");
                String claimRole = jwt.getClaimAsString("role");
                boolean valid = claimVersion != null && claimRole != null && users.findById(userId)
                        .filter(user -> user.getStatus() == com.sharehope.user.model.UserStatus.ACTIVE)
                        .map(user -> user.getSessionVersion().intValue() == claimVersion.intValue()
                                && user.getRoles().stream().anyMatch(role -> role.getName().equals(claimRole)))
                        .orElse(false);
                return valid ? OAuth2TokenValidatorResult.success()
                        : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Session is no longer valid", null));
            } catch (RuntimeException error) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Session is no longer valid", null));
            }
        }));
        return decoder;
    }

    /**
     * Maps our JWT's single "role" claim (e.g. "SUPER_ADMIN") into the
     * Spring Security authority "ROLE_SUPER_ADMIN", which is what
     * hasRole(...)/hasAnyRole(...) check against internally.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            String role = jwt.getClaimAsString("role");

            if (role == null || role.isBlank()) {
                return List.of();
            }

            return List.of(new SimpleGrantedAuthority("ROLE_" + role));
        });

        return converter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

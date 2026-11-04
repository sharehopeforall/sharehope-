package com.sharehope.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void newsletterRequiresAnAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/newsletter/subscribers"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/newsletter/subscribers")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CONTENT_EDITOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void unlistedAdminRoutesAreDenied() throws Exception {
        mockMvc.perform(get("/api/admin/not-configured")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void volunteerApplicationsRequireSuperAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/submissions")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CONTENT_EDITOR"))))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/submissions")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"))))
                .andExpect(status().isOk());
    }
}

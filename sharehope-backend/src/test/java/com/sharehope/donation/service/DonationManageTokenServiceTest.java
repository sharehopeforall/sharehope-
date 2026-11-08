package com.sharehope.donation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.sharehope.donation.model.Donation;
import com.sharehope.donation.repository.DonationRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class DonationManageTokenServiceTest {
    @Test
    void acceptsOnlyUntamperedTokenForTheDonationEmail() {
        DonationRepository donations = Mockito.mock(DonationRepository.class);
        Donation donation = Donation.builder().id(UUID.randomUUID()).donorEmail("donor@example.org").build();
        when(donations.findById(donation.getId())).thenReturn(Optional.of(donation));
        DonationManageTokenService service = new DonationManageTokenService(
                donations, "a-long-payment-secret-with-at-least-32-characters");

        String token = service.create(donation);

        assertThat(service.verify(token)).contains(donation);
        assertThat(service.verify(token.substring(0, token.length() - 1) + "x")).isEmpty();
    }

    @Test
    void refusesTokensWhenServerSecretIsTooShort() {
        DonationRepository donations = Mockito.mock(DonationRepository.class);
        Donation donation = Donation.builder().id(UUID.randomUUID()).donorEmail("donor@example.org").build();
        DonationManageTokenService service = new DonationManageTokenService(donations, "short");

        assertThat(service.verify(service.create(donation))).isEmpty();
    }
}

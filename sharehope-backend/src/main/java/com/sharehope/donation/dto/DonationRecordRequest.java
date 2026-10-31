package com.sharehope.donation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DonationRecordRequest(
        @NotBlank String provider,
        @NotBlank String providerReference,
        String donorName,
        @Email String donorEmail,
        String donorPhone,
        @NotNull @Positive Long amountCents,
        @NotBlank String currency,
        @NotBlank String frequency,
        String designation,
        @NotBlank String status,
        String receiptUrl) {}

package com.sharehope.donation.repository;

import com.sharehope.donation.model.Donation;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, UUID> {
    Optional<Donation> findByProviderReference(String reference);
    List<Donation> findAllBySubscriptionReference(String reference);
    List<Donation> findAllByOrderByCreatedAtDesc();
}

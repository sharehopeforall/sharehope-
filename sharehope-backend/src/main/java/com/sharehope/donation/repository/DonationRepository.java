package com.sharehope.donation.repository;

import com.sharehope.donation.model.Donation;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DonationRepository extends JpaRepository<Donation, UUID> {
    Optional<Donation> findByProviderReference(String reference);
    List<Donation> findAllBySubscriptionReference(String reference);
    List<Donation> findAllByOrderByCreatedAtDesc();
    @Query("select d from Donation d where d.designation = :slug or d.designation like concat('%:', :slug) order by d.createdAt desc")
    List<Donation> findEventDonations(@Param("slug") String slug);
}

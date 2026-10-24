package com.sharehope.newsletter.repository;

import com.sharehope.newsletter.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, UUID> {
    boolean existsByEmailIgnoreCase(String email);
}

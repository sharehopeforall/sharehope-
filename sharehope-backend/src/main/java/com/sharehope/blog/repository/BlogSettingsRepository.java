package com.sharehope.blog.repository;

import com.sharehope.blog.model.BlogSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogSettingsRepository extends JpaRepository<BlogSettings, Integer> {}

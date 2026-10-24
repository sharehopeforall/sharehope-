package com.sharehope.blog.service;

import com.sharehope.blog.dto.BlogPostRequest;
import com.sharehope.blog.dto.BlogPostResponse;
import com.sharehope.blog.dto.BlogPostTranslationRequest;
import com.sharehope.blog.dto.PublicBlogPostResponse;
import com.sharehope.blog.dto.PublicBlogPostSummaryResponse;
import com.sharehope.blog.model.BlogPost;
import com.sharehope.blog.repository.BlogPostRepository;
import com.sharehope.exception.ResourceAlreadyExistsException;
import com.sharehope.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private static final String PUBLISHED = "PUBLISHED";
    private final BlogPostRepository repository;

    @Transactional(readOnly = true)
    public List<BlogPostResponse> adminList() {
        return repository.findAllByOrderByUpdatedAtDesc().stream().map(this::admin).toList();
    }

    @Transactional(readOnly = true)
    public BlogPostResponse adminGet(UUID id) {
        return admin(get(id));
    }

    @Transactional
    public BlogPostResponse create(BlogPostRequest request) {
        if (repository.findBySlug(request.slug()).isPresent()) {
            throw new ResourceAlreadyExistsException("Blog post slug already exists.");
        }
        BlogPost post = new BlogPost();
        apply(post, request);
        return admin(repository.save(post));
    }

    @Transactional
    public BlogPostResponse update(UUID id, BlogPostRequest request) {
        BlogPost post = get(id);
        if (repository.existsBySlugAndIdNot(request.slug(), id)) {
            throw new ResourceAlreadyExistsException("Blog post slug already exists.");
        }
        apply(post, request);
        return admin(repository.save(post));
    }

    @Transactional
    public BlogPostResponse publish(UUID id) {
        BlogPost post = get(id);
        post.setStatus(PUBLISHED);
        if (post.getPublishedAt() == null) post.setPublishedAt(OffsetDateTime.now());
        return admin(repository.save(post));
    }

    @Transactional
    public BlogPostResponse unpublish(UUID id) {
        BlogPost post = get(id);
        post.setStatus("DRAFT");
        post.setPublishedAt(null);
        return admin(repository.save(post));
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(get(id));
    }

    @Transactional(readOnly = true)
    public List<PublicBlogPostSummaryResponse> publicList(String locale, String category, Boolean featured) {
        validateLocale(locale);
        return repository.findByStatusOrderByFeaturedDescPublishedAtDescDisplayOrderAsc(PUBLISHED).stream()
                .filter(post -> category == null || category.isBlank() || post.getCategory().equalsIgnoreCase(category))
                .filter(post -> featured == null || post.getFeatured().equals(featured))
                .map(post -> summary(post, locale))
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicBlogPostResponse publicGet(String slug, String locale) {
        validateLocale(locale);
        BlogPost post = repository.findBySlug(slug)
                .filter(value -> PUBLISHED.equals(value.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found."));
        return localized(post, locale);
    }

    @Transactional(readOnly = true)
    public List<String> publicCategories() {
        return repository.findByStatusOrderByFeaturedDescPublishedAtDescDisplayOrderAsc(PUBLISHED).stream()
                .map(BlogPost::getCategory)
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
    }

    private BlogPost get(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found."));
    }

    private void apply(BlogPost post, BlogPostRequest request) {
        post.setSlug(request.slug());
        post.setCategory(request.category().trim());
        post.setFormat(request.format());
        post.setStatus(request.status());
        post.setFeatured(request.featured());
        post.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        post.setCoverImageUrl(blankToNull(request.coverImageUrl()));
        post.setVideoUrl(blankToNull(request.videoUrl()));
        post.setDurationSeconds(request.durationSeconds());
        post.setRelatedProgramSlug(blankToNull(request.relatedProgramSlug()));

        if ("VIDEO".equals(request.format()) && post.getVideoUrl() == null) {
            throw new IllegalArgumentException("A video URL is required for video posts.");
        }
        if (PUBLISHED.equals(request.status())) {
            if (post.getPublishedAt() == null) post.setPublishedAt(OffsetDateTime.now());
        } else {
            post.setPublishedAt(null);
        }

        Map<String, Object> translations = new LinkedHashMap<>();
        translations.put("en", translationMap(request.en()));
        if (request.fr() != null) translations.put("fr", translationMap(request.fr()));
        post.setTranslations(translations);
    }

    private Map<String, Object> translationMap(BlogPostTranslationRequest translation) {
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("title", translation.title());
        value.put("excerpt", translation.excerpt());
        value.put("body", translation.body());
        value.put("imageAlt", translation.imageAlt());
        value.put("buttonText", translation.buttonText());
        value.put("authorName", translation.authorName());
        value.put("seoTitle", translation.seoTitle());
        value.put("seoDescription", translation.seoDescription());
        value.put("tags", translation.tags() == null ? List.of() : translation.tags());
        return value;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> translation(BlogPost post, String locale) {
        Object value = post.getTranslations().get(locale);
        if (value instanceof Map<?, ?> map) return (Map<String, Object>) map;
        value = post.getTranslations().get("en");
        return value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
    }

    private BlogPostResponse admin(BlogPost post) {
        return new BlogPostResponse(
                post.getId(), post.getSlug(), post.getCategory(), post.getFormat(), post.getStatus(),
                post.getFeatured(), post.getDisplayOrder(), post.getCoverImageUrl(), post.getVideoUrl(),
                post.getDurationSeconds(), post.getRelatedProgramSlug(), translation(post, "en"),
                translation(post, "fr"), post.getPublishedAt(), post.getCreatedAt(), post.getUpdatedAt()
        );
    }

    private PublicBlogPostSummaryResponse summary(BlogPost post, String locale) {
        Map<String, Object> value = translation(post, locale);
        return new PublicBlogPostSummaryResponse(
                post.getId(), post.getSlug(), post.getCategory(), post.getFormat(), post.getFeatured(),
                post.getCoverImageUrl(), post.getVideoUrl(), post.getDurationSeconds(), post.getRelatedProgramSlug(),
                string(value, "title"), string(value, "excerpt"), string(value, "imageAlt"),
                string(value, "buttonText"), string(value, "authorName"), strings(value, "tags"), post.getPublishedAt(),
                readingTime(value)
        );
    }

    private PublicBlogPostResponse localized(BlogPost post, String locale) {
        Map<String, Object> value = translation(post, locale);
        return new PublicBlogPostResponse(
                post.getId(), post.getSlug(), post.getCategory(), post.getFormat(), post.getFeatured(),
                post.getCoverImageUrl(), post.getVideoUrl(), post.getDurationSeconds(), post.getRelatedProgramSlug(),
                string(value, "title"), string(value, "excerpt"), string(value, "body"),
                string(value, "imageAlt"), string(value, "buttonText"), string(value, "authorName"),
                string(value, "seoTitle"), string(value, "seoDescription"), strings(value, "tags"), post.getPublishedAt(),
                readingTime(value)
        );
    }

    private int readingTime(Map<String, Object> translation) {
        String body = string(translation, "body").trim();
        if (body.isEmpty()) return 1;
        return Math.max(1, (int) Math.ceil(body.split("\\s+").length / 220.0));
    }

    private String string(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? "" : String.valueOf(value);
    }

    private List<String> strings(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value instanceof List<?> list ? list.stream().map(String::valueOf).toList() : List.of();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void validateLocale(String locale) {
        if (!"en".equals(locale) && !"fr".equals(locale)) {
            throw new IllegalArgumentException("Unsupported locale.");
        }
    }
}

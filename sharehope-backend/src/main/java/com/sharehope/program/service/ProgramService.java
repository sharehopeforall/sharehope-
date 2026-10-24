package com.sharehope.program.service;

import com.sharehope.exception.*;
import com.sharehope.program.dto.*;
import com.sharehope.program.model.Program;
import com.sharehope.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class ProgramService {
    private final ProgramRepository repository;

    @Transactional(readOnly = true) public List<ProgramResponse> adminList() { return repository.findAllByOrderByDisplayOrderAsc().stream().map(this::admin).toList(); }
    @Transactional(readOnly = true) public List<PublicProgramResponse> publicList(String locale) { validateLocale(locale); return repository.findByPublishedTrueOrderByDisplayOrderAsc().stream().map(p -> localized(p, locale)).toList(); }
    @Transactional public ProgramResponse create(ProgramRequest request) { if (repository.findBySlug(request.slug()).isPresent()) throw new ResourceAlreadyExistsException("Program slug already exists."); Program p = new Program(); p.setId(UUID.randomUUID()); apply(p, request); return admin(repository.save(p)); }
    @Transactional public ProgramResponse update(UUID id, ProgramRequest request) { Program p = get(id); if (repository.existsBySlugAndIdNot(request.slug(), id)) throw new ResourceAlreadyExistsException("Program slug already exists."); apply(p, request); return admin(repository.save(p)); }
    @Transactional public void delete(UUID id) { repository.delete(get(id)); }
    private Program get(UUID id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Program not found.")); }
    private void apply(Program p, ProgramRequest r) { p.setSlug(r.slug()); p.setCategory(r.category()); p.setDisplayOrder(r.displayOrder() == null ? 0 : r.displayOrder()); p.setPublished(r.published()); p.setFeatured(r.featured()); p.setImageUrl(r.imageUrl()); Map<String,Object> translations = new LinkedHashMap<>(); translations.put("en", map(r.en())); if (r.fr() != null) translations.put("fr", map(r.fr())); p.setTranslations(translations); }
    private Map<String,Object> map(ProgramTranslationRequest t) { Map<String,Object> value = new LinkedHashMap<>(); value.put("title", t.title()); value.put("description", t.description()); value.put("buttonText", t.buttonText()); value.put("imageAlt", t.imageAlt()); value.put("initiatives", t.initiatives() == null ? List.of() : t.initiatives()); return value; }
    @SuppressWarnings("unchecked") private Map<String,Object> translation(Program p, String locale) { Object value = p.getTranslations().get(locale); if (value instanceof Map<?,?> map) return (Map<String,Object>) map; value = p.getTranslations().get("en"); return value instanceof Map<?,?> map ? (Map<String,Object>) map : Map.of(); }
    private ProgramResponse admin(Program p) { return new ProgramResponse(p.getId(),p.getSlug(),p.getCategory(),p.getDisplayOrder(),p.getPublished(),p.getFeatured(),p.getImageUrl(),translation(p,"en"),translation(p,"fr"),p.getCreatedAt(),p.getUpdatedAt()); }
    @SuppressWarnings("unchecked") private PublicProgramResponse localized(Program p,String locale) { Map<String,Object> t=translation(p,locale); Object raw=t.get("initiatives"); List<String> initiatives=raw instanceof List<?> list ? list.stream().map(String::valueOf).toList() : List.of(); return new PublicProgramResponse(p.getId(),p.getSlug(),p.getCategory(),p.getDisplayOrder(),p.getFeatured(),p.getImageUrl(),str(t,"title"),str(t,"description"),str(t,"buttonText"),str(t,"imageAlt"),initiatives); }
    private String str(Map<String,Object> map,String key) { Object value=map.get(key); return value == null ? "" : String.valueOf(value); }
    private void validateLocale(String locale) { if (!"en".equals(locale) && !"fr".equals(locale)) throw new IllegalArgumentException("Unsupported locale."); }
}

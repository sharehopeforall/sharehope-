package com.sharehope.event.dto; import jakarta.validation.constraints.NotBlank; import java.util.List;
public record EventTranslationRequest(@NotBlank String title,@NotBlank String excerpt,@NotBlank String description,String buttonText,String imageAlt,String metaTag,List<String> agenda,List<String> roles){}

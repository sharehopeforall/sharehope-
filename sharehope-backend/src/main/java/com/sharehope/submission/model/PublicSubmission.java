package com.sharehope.submission.model;
import jakarta.persistence.*; import lombok.*; import java.time.OffsetDateTime; import java.util.UUID;
@Entity @Table(name="public_submissions") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PublicSubmission {
 @Id private UUID id;
 @Column(name="submission_type",nullable=false,length=30) private String submissionType;
 @Column(name="first_name",nullable=false,length=100) private String firstName;
 @Column(name="last_name",nullable=false,length=100) private String lastName;
 @Column(nullable=false,length=320) private String email; @Column(length=40) private String phone;
 @Column(length=200) private String organization; @Column(length=200) private String subject;
 @Column(nullable=false,columnDefinition="text") private String details;
 @Column(nullable=false,length=5) private String locale; @Column(nullable=false,length=20) private String status;
 @Column(name="created_at",nullable=false) private OffsetDateTime createdAt;
 @PrePersist void create(){if(id==null)id=UUID.randomUUID();if(createdAt==null)createdAt=OffsetDateTime.now();if(status==null)status="NEW";}
}

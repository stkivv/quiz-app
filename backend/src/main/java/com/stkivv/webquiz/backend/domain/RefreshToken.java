package com.stkivv.webquiz.backend.domain;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class RefreshToken {
   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID Id; 

   @ManyToOne
   @JoinColumn(name = "user_fk", nullable = false)
   private AppUser appUser;

   private Date expirationDate;

   public RefreshToken(AppUser appUser, Date expirationDate) {
      this.appUser = appUser;
      this.expirationDate = expirationDate;
   }
}

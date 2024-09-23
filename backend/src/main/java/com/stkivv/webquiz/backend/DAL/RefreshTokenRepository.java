package com.stkivv.webquiz.backend.DAL;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stkivv.webquiz.backend.domain.AppUser;
import com.stkivv.webquiz.backend.domain.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    List<RefreshToken> findByAppUser(AppUser appUser);
}

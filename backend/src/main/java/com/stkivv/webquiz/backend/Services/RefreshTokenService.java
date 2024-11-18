package com.stkivv.webquiz.backend.Services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.stkivv.webquiz.backend.DAL.RefreshTokenRepository;
import com.stkivv.webquiz.backend.DAL.UserRepository;
import com.stkivv.webquiz.backend.domain.AppUser;
import com.stkivv.webquiz.backend.domain.RefreshToken;
import com.stkivv.webquiz.backend.security.JwtUtilities;

@Service
public class RefreshTokenService {
	private final JwtUtilities jwtUtilities;
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshTokenService(JwtUtilities jwtUtilities, UserRepository userRepository,
			RefreshTokenRepository refreshTokenRepository) {
		this.jwtUtilities = jwtUtilities;
		this.userRepository = userRepository;
		this.refreshTokenRepository = refreshTokenRepository;
	}

	// creates a new refresh token, saves it to db and returns the token as string
	public String createRefreshTokenForUser(String username) {
		AppUser user = userRepository.findByUsername(username);
		RefreshToken token = jwtUtilities.createRefreshToken(user);
		return refreshTokenRepository.saveAndFlush(token).getId().toString();
	}

	// deletes all expired tokens, attempts to find the token provided
	public boolean isRefreshTokenValid(String username, String tokenString) {
		AppUser user = userRepository.findByUsername(username);
		deleteInvalidRefreshTokens(user);
		UUID id = UUID.fromString(tokenString);
		Optional<RefreshToken> token = refreshTokenRepository.findById(id);
		if (token.isEmpty())
			return false;
		if (isRefreshTokenExpired(token.get()))
			return false;
		return true;
	}

	private void deleteInvalidRefreshTokens(AppUser user) {
		List<UUID> deleteQueue = new ArrayList<>();
		List<RefreshToken> tokens = refreshTokenRepository.findByAppUser(user);
		for (RefreshToken token : tokens) {
			if (isRefreshTokenExpired(token)) {
				deleteQueue.add(token.getId());
			}
		}
		refreshTokenRepository.deleteAllById(deleteQueue);
	}

	private boolean isRefreshTokenExpired(RefreshToken token) {
		Date expirationDate = token.getExpirationDate();
		if (expirationDate.before(new Date()))
			return true;
		return false;
	}

}

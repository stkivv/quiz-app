package com.stkivv.webquiz.backend.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.stkivv.webquiz.backend.domain.AppUser;
import com.stkivv.webquiz.backend.domain.RefreshToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtilities {
	@Value("${jwt.secret}")
	private String JWT_SECRET;
	@Value("${jwt.token.expiration-minutes}")
	private Integer tokenExpirationTimeMinutes;
	@Value("${jwt.refresh-token.expiration-days}")
	private Integer refreshTokenExpirationDays;

	public String createToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + tokenExpirationTimeMinutes * 60 * 1000))
				.signWith(getSignKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public RefreshToken createRefreshToken(AppUser user) {
		Date expirationDate = new Date(System.currentTimeMillis() + refreshTokenExpirationDays * 86400000);
		return new RefreshToken(user, expirationDate);
	}

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		try {
			final Claims claims = extractAllClaims(token);
			return claimsResolver.apply(claims);
		} catch (ExpiredJwtException exception) {
			return claimsResolver.apply(exception.getClaims());
		}
	}

	private Claims extractAllClaims(String token) throws ExpiredJwtException {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	private Boolean isTokenExpired(String token) {
		try {
			extractAllClaims(token);
			return false;
		} catch (ExpiredJwtException exception) {
			return true;
		}
	}

	public Boolean validateToken(String token, UserDetails user) {
		final String username = extractUsername(token);
		return (username.equals(user.getUsername()) && !isTokenExpired(token));
	}
}

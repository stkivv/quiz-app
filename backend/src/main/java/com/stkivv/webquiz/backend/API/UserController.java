package com.stkivv.webquiz.backend.API;

import com.stkivv.webquiz.backend.DTO.UserDto;
import com.stkivv.webquiz.backend.Services.CustomUserService;
import com.stkivv.webquiz.backend.Services.RefreshTokenService;
import com.stkivv.webquiz.backend.security.JwtUtilities;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class UserController {

	private final CustomUserService userService;
	private final RefreshTokenService refreshTokenService;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtilities jwtUtilities;

	UserController(AuthenticationManager authenticationManager, CustomUserService userService,
			RefreshTokenService refreshTokenService,
			PasswordEncoder passwordEncoder, JwtUtilities jwtUtilities) {
		this.authenticationManager = authenticationManager;
		this.userService = userService;
		this.refreshTokenService = refreshTokenService;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtilities = jwtUtilities;
	}

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody UserDto user) {
		if (userService.userExists(user.getUsername())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken.");
		}
		userService.registerUser(user, passwordEncoder);
		return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
	}

	@PostMapping("/login")
	public ResponseEntity<String> loginUser(@RequestBody UserDto user, HttpServletResponse response) {
		Authentication auth = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

		if (auth.isAuthenticated()) {
			String token = jwtUtilities.createToken(user.getUsername());
			String refreshToken = refreshTokenService.createRefreshTokenForUser(user.getUsername());

			Cookie accessTokenCookie = new Cookie("accessToken", token);
			accessTokenCookie.setHttpOnly(true);
			accessTokenCookie.setPath("/");

			Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
			refreshTokenCookie.setHttpOnly(true);
			refreshTokenCookie.setPath("/");

			response.addCookie(accessTokenCookie);
			response.addCookie(refreshTokenCookie);
			return ResponseEntity.ok("login successful");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("login failed");
		}
	}

	@PostMapping("/refresh")
	public ResponseEntity<String> getNewToken(@CookieValue(name = "accessToken") String accessToken,
			@CookieValue(name = "refreshToken") String refreshToken,
			HttpServletResponse response) {
		String username = jwtUtilities.extractUsername(accessToken);
		if (refreshTokenService.isRefreshTokenValid(username, refreshToken)) {
			String jwt = jwtUtilities.createToken(username);

			Cookie accessTokenCookie = new Cookie("accessToken", jwt);
			accessTokenCookie.setHttpOnly(true);
			accessTokenCookie.setPath("/");

			response.addCookie(accessTokenCookie);

			return ResponseEntity.ok("token refresh succesful");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("token refresh failed");
		}
	}

}

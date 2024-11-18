package com.stkivv.webquiz.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.stkivv.webquiz.backend.Services.CustomUserService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtilities jwtUtilities;
	private final CustomUserService userService;

	public JwtAuthenticationFilter(JwtUtilities jwtUtilities, CustomUserService userService) {
		this.jwtUtilities = jwtUtilities;
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {

		if (request.getServletPath().equals("/auth/refresh")
				|| request.getServletPath().equals("/auth/register")
				|| request.getServletPath().equals("/auth/login")) {
			filterChain.doFilter(request, response);
			return;
		}

		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("accessToken")) {
					String accessToken = cookie.getValue();
					String username = jwtUtilities.extractUsername(accessToken);
					if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
						UserDetails userDetails = userService.loadUserByUsername(username);
						if (jwtUtilities.validateToken(accessToken, userDetails)) {
							UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
									userDetails,
									null, userDetails.getAuthorities());
							authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
							SecurityContextHolder.getContext().setAuthentication(authToken);
						}
					}
				}
			}

		}
		filterChain.doFilter(request, response);
	}

}

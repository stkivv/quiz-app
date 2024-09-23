package com.stkivv.webquiz.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.stkivv.webquiz.backend.Services.CustomUserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final CustomUserService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(CustomUserService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.userDetailsService = userDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests((authorize) -> authorize
						.requestMatchers("/auth/login", "/auth/register", "/auth/refresh").permitAll()
						.anyRequest().authenticated())
				.sessionManagement((session) -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth
				.userDetailsService(userDetailsService)
				.passwordEncoder(passwordEncoder());
	}
}

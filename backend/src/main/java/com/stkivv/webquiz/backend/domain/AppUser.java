package com.stkivv.webquiz.backend.domain;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Size;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class AppUser implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID userId;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "appUser")
	@Size(max = 400)
	private List<Quiz> quizzes;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "appUser")
	private List<RefreshToken> refreshTokens;

	@Column(nullable = false)
	@Size(min = 4, max = 30)
	private String username;

	@Column(nullable = false)
	@Size(min = 7, max = 30)
	private String password;

	private boolean isEnabled;

	public AppUser(String username, String password) {
		this.username = username;
		this.password = password;
		isEnabled = true;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return new ArrayList<SimpleGrantedAuthority>();
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return isEnabled;
	}

	@Override
	public boolean isAccountNonLocked() {
		return isEnabled;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return isEnabled;
	}

	@Override
	public boolean isEnabled() {
		return isEnabled;
	}

}

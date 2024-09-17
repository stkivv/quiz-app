package com.stkivv.webquiz.backend.Services;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stkivv.webquiz.backend.DAL.UserRepository;
import com.stkivv.webquiz.backend.DTO.UserDto;
import com.stkivv.webquiz.backend.domain.AppUser;

@Service
public class CustomUserService implements UserDetailsService {

    private final UserRepository userRepo;

    public CustomUserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public AppUser loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepo.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        return user;
    }

    public boolean userExists(String username) {
        return userRepo.findByUsername(username) != null;
    }

    public void registerUser(UserDto user, PasswordEncoder passwordEncoder) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        AppUser newUser = new AppUser(user.getUsername(), encodedPassword);
        userRepo.saveAndFlush(newUser);
    }

}

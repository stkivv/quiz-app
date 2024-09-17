package com.stkivv.webquiz.backend.DAL;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.stkivv.webquiz.backend.domain.AppUser;
import com.stkivv.webquiz.backend.domain.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    List<Quiz> findByAppUser(AppUser user);
    Optional<Quiz> findByQuizIdAndAppUser(UUID quizId, AppUser user);
}

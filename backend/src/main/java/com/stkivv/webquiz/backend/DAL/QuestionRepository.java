package com.stkivv.webquiz.backend.DAL;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stkivv.webquiz.backend.domain.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

}

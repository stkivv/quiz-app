package com.stkivv.webquiz.backend.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.lang.Nullable;
import lombok.Data;

@Data
public class QuizDto {
    @Nullable
    private UUID id;

    private String title;
    private String description;
    private boolean publicQuiz;

    @Nullable
    private String passCode;

    private LocalDateTime lastEdit;

    @Nullable
    private List<QuestionDto> questions;
}

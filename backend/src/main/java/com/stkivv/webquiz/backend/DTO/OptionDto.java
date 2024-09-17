package com.stkivv.webquiz.backend.DTO;

import java.util.UUID;

import org.springframework.lang.Nullable;

import lombok.Data;

@Data
public class OptionDto {
    @Nullable
    private UUID id;

    private String phrasing;
    private boolean correctAnswer;
}

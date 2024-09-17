package com.stkivv.webquiz.backend.DTO;

import java.util.UUID;
import java.util.List;

import org.springframework.lang.Nullable;
import lombok.Data;

@Data
public class QuestionDto {
    @Nullable
    private UUID id;

    String phrasing;

    @Nullable
    private List<OptionDto> options;
}

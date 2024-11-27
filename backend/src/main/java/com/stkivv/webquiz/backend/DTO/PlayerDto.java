package com.stkivv.webquiz.backend.DTO;

import lombok.Data;

@Data
public class PlayerDto {
	private String name;
	private Integer score = 10;
}

package com.stkivv.webquiz.backend.DTO;

import lombok.Data;

@Data
public class JWTResponseDto {
   String jwt;
   String refreshToken; 
}

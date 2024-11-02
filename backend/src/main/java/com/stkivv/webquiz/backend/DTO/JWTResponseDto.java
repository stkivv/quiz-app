package com.stkivv.webquiz.backend.DTO;

import jakarta.servlet.http.Cookie;
import lombok.Data;

@Data
public class JWTResponseDto {
	Cookie jwt;
	Cookie refreshToken;
}

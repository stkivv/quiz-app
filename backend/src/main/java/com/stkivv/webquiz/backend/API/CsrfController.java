package com.stkivv.webquiz.backend.API;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// dummy endpoint to get csrf token on client
@RestController
@RequestMapping("/csrf")
public class CsrfController {

	@GetMapping
	public ResponseEntity<String> csrfToken() {
		try {
			return ResponseEntity.ok("CSRF response");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
}

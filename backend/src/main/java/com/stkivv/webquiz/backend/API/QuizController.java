package com.stkivv.webquiz.backend.API;

import java.util.UUID;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.Services.QuizService;
import com.stkivv.webquiz.backend.security.JwtUtilities;

@RestController
@RequestMapping("/quiz")
public class QuizController {

	private final QuizService quizService;
	private final JwtUtilities jwtUtilities;

	QuizController(QuizService quizService, JwtUtilities jwtUtilities) {
		this.quizService = quizService;
		this.jwtUtilities = jwtUtilities;
	}

	@GetMapping
	public ResponseEntity<List<QuizDto>> getAll(@CookieValue(name = "accessToken") String accessToken) {
		try {
			String username = jwtUtilities.extractUsername(accessToken);
			List<QuizDto> quizzes = quizService.getAllQuizzesForUser(username);
			return ResponseEntity.ok(quizzes);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

	@GetMapping("/{quizId}")
	public ResponseEntity<QuizDto> getQuizById(@CookieValue(name = "accessToken") String accessToken,
			@PathVariable UUID quizId) {
		try {
			String username = jwtUtilities.extractUsername(accessToken);
			QuizDto quiz = quizService.getQuizById(username, quizId);
			return ResponseEntity.ok().body(quiz);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

	@PostMapping()
	public ResponseEntity<QuizDto> createQuiz(@CookieValue(name = "accessToken") String accessToken,
			@RequestBody QuizDto quiz) {
		try {
			String username = jwtUtilities.extractUsername(accessToken);
			QuizDto addedQuiz = quizService.createOrUpdateQuiz(username, quiz);
			return ResponseEntity.created(null).body(addedQuiz);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(null);
		}
	}

	@DeleteMapping("/{quizId}")
	public ResponseEntity<String> deleteQuiz(@CookieValue(name = "accessToken") String accessToken,
			@PathVariable UUID quizId) {
		try {
			String username = jwtUtilities.extractUsername(accessToken);
			quizService.deleteQuiz(username, quizId);
			return ResponseEntity.ok().body(null);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

}

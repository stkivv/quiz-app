package com.stkivv.webquiz.backend.API;

import java.util.UUID;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.Services.QuizService;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    private final QuizService quizService;

    QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public ResponseEntity<List<QuizDto>> getAll(@RequestParam String username) {
        try {
            List<QuizDto> quizzes = quizService.getAllQuizzesForUser(username);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDto> getQuizById(@RequestParam String username, @PathVariable UUID quizId) {
        try {
            QuizDto quiz = quizService.getQuizById(username, quizId);
            return ResponseEntity.ok().body(quiz);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping()
    public ResponseEntity<QuizDto> createQuiz(@RequestParam String username, @RequestBody QuizDto quiz) {
        try {
            QuizDto addedQuiz = quizService.createOrUpdateQuiz(username, quiz);
            return ResponseEntity.created(null).body(addedQuiz);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@RequestParam String username, @PathVariable UUID quizId) {
        try {
            quizService.deleteQuiz(username, quizId);
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}

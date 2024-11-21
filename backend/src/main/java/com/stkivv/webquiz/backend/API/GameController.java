package com.stkivv.webquiz.backend.API;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;

import com.stkivv.webquiz.backend.DTO.AnswerDto;
import com.stkivv.webquiz.backend.DTO.GameSessionDto;
import com.stkivv.webquiz.backend.DTO.PlayerDto;
import com.stkivv.webquiz.backend.DTO.QuestionDto;
import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.Services.QuizService;
import com.stkivv.webquiz.backend.security.JwtUtilities;

@Controller
public class GameController {

	private final QuizService quizService;
	private final JwtUtilities jwtUtilities;

	public GameController(QuizService quizService, JwtUtilities jwtUtilities) {
		this.quizService = quizService;
		this.jwtUtilities = jwtUtilities;
	}

	private Map<String, GameSessionDto> gameSessions = new ConcurrentHashMap<>();

	@MessageMapping("/app/{quizId}/host")
	@SendTo("/game/{quizId}/host")
	public String hostGame(@DestinationVariable UUID quizId, @CookieValue(name = "accessToken") String accessToken) {
		String username = jwtUtilities.extractUsername(accessToken);
		QuizDto quiz = quizService.getQuizById(username, quizId);

		GameSessionDto session = new GameSessionDto();
		session.setQuestions(quiz.getQuestions());
		String passCode = generatePassCode();
		gameSessions.put(passCode, session);

		return passCode;
	}

	@MessageMapping("/app/{passCode}/players")
	@SendTo("/game/{passCode}/players")
	public List<PlayerDto> broadcastPlayers(@DestinationVariable String passCode) {
		return getSession(passCode).getPlayers();
	}

	@MessageMapping("/app/{passCode}/question")
	@SendTo("/game/{passCode}/question")
	public QuestionDto broadcastNextQuestion(@DestinationVariable String passCode) {
		GameSessionDto session = getSession(passCode);
		Integer currentIndex = session.getCurrentQuestionIndex();

		if (currentIndex > session.getHighestQuestionsIndex()) {
			throw new IndexOutOfBoundsException("No more questions available");
		}

		QuestionDto question = session.getCurrentQuestion();
		session.setCurrentQuestionIndex(currentIndex + 1);
		return question;
	}

	@MessageMapping("/app/{passCode}/answer")
	@SendTo("/game/{passCode}/answer")
	public void handleAnswer(@DestinationVariable String passCode, AnswerDto answer) {
		GameSessionDto session = getSession(passCode);

		if (answerIsCorrect(answer, session)) {
			String playerName = answer.getPlayername();
			List<PlayerDto> players = session.getPlayers();

			for (PlayerDto player : players) {
				if (player.getName().equals(playerName)) {
					Integer score = player.getScore();
					player.setScore(score + 10);
					break;
				}
			}
		}
	}

	// Generates a random 6 digit alphanumeric string that will be used to access
	// the game
	private String generatePassCode() {
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		StringBuilder result = new StringBuilder();
		Random random = new Random();

		for (int i = 0; i < 6; i++) {
			int index = random.nextInt(chars.length());
			result.append(chars.charAt(index));
		}
		return result.toString();
	}

	private boolean answerIsCorrect(AnswerDto answer, GameSessionDto session) {
		QuestionDto question = session.getCurrentQuestion();
		String correctAnswer = question.getOptions().stream()
				.filter(q -> q.isCorrectAnswer())
				.findFirst()
				.map(q -> q.getPhrasing())
				.orElse(null);

		if (correctAnswer == null)
			throw new RuntimeException("Correct answer could not be determined");

		return answer.getAnswer().toLowerCase().equals(correctAnswer.toLowerCase());
	}

	private GameSessionDto getSession(String passCode) throws IllegalArgumentException {
		GameSessionDto session = gameSessions.get(passCode);
		if (session == null) {
			throw new IllegalArgumentException("Invalid passcode for quiz");
		}
		return session;
	}
}

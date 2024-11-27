package com.stkivv.webquiz.backend.API;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.stkivv.webquiz.backend.DTO.AnswerDto;
import com.stkivv.webquiz.backend.DTO.GameSessionDto;
import com.stkivv.webquiz.backend.DTO.PlayerDto;
import com.stkivv.webquiz.backend.DTO.QuestionDto;
import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.Services.QuizService;

@Controller
public class GameController {

	private final QuizService quizService;

	public GameController(QuizService quizService) {
		this.quizService = quizService;
	}

	private Map<String, GameSessionDto> gameSessions = new ConcurrentHashMap<>();

	@MessageMapping("/{quizId}/host")
	@SendTo("/topic/{quizId}/host")
	public String hostGame(@DestinationVariable UUID quizId, String username) {
		QuizDto quiz = quizService.getQuizById(username, quizId);

		GameSessionDto session = new GameSessionDto();
		session.setQuestions(quiz.getQuestions());
		String passCode = generatePassCode();
		gameSessions.put(passCode, session);

		return passCode;
	}

	@MessageMapping("/{passCode}/join")
	@SendTo("/topic/{passCode}/join")
	public void joinGame(@DestinationVariable String passCode, String playerName) {
		GameSessionDto session = getSession(passCode);
		if (session.isInProgress())
			return;

		PlayerDto newPlayer = new PlayerDto();
		newPlayer.setName(playerName);
		session.getPlayers().add(newPlayer);
	}

	@MessageMapping("/{passCode}/players")
	@SendTo("/topic/{passCode}/players")
	public List<PlayerDto> broadcastPlayers(@DestinationVariable String passCode) {
		return getSession(passCode).getPlayers();
	}

	@MessageMapping("/{passCode}/question")
	@SendTo("/topic/{passCode}/question")
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

	@MessageMapping("/{passCode}/answer")
	@SendTo("/topic/{passCode}/answer")
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

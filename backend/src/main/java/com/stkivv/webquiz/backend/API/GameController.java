package com.stkivv.webquiz.backend.API;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.jackson.JsonObjectDeserializer;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.stkivv.webquiz.backend.DTO.AnswerDto;
import com.stkivv.webquiz.backend.DTO.GameSessionDto;
import com.stkivv.webquiz.backend.DTO.PlayerDto;
import com.stkivv.webquiz.backend.DTO.QuestionDto;
import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.Services.QuizService;

@Controller
public class GameController {

	private final QuizService quizService;
	private final SimpMessagingTemplate messagingTemplate;

	public GameController(QuizService quizService, SimpMessagingTemplate messagingTemplate) {
		this.quizService = quizService;
		this.messagingTemplate = messagingTemplate;
	}

	private Map<String, GameSessionDto> gameSessions = new ConcurrentHashMap<>();

	@MessageMapping("/{quizId}/host")
	@SendTo("/topic/{quizId}/host")
	public String hostGame(@DestinationVariable UUID quizId, String username) {
		QuizDto quiz = quizService.getQuizById(username, quizId);

		GameSessionDto session = new GameSessionDto();
		session.setQuestions(quiz.getQuestions());
		session.setPlayers(new ArrayList<>());
		String passCode = generatePassCode();
		gameSessions.put(passCode, session);

		return passCode;
	}

	@MessageMapping("/{passCode}/join")
	@SendTo("/topic/{passCode}/players")
	public List<PlayerDto> joinGame(@DestinationVariable String passCode, String playerName) {
		GameSessionDto session = getSession(passCode);
		if (session.isInProgress())
			throw new RuntimeException("Game is already in progress!");

		PlayerDto newPlayer = new PlayerDto();
		newPlayer.setName(playerName);
		session.getPlayers().add(newPlayer);
		return session.getPlayers();
	}

	@MessageMapping("/{passCode}/players")
	@SendTo("/topic/{passCode}/players")
	public List<PlayerDto> broadcastPlayers(@DestinationVariable String passCode) {
		return getSession(passCode).getPlayers();
	}

	@MessageMapping("/{passCode}/start")
	@SendTo("/topic/{passCode}/start")
	public String startGame(@DestinationVariable String passCode) {
		GameSessionDto session = getSession(passCode);
		session.setInProgress(true);
		return "Game start";
	}

	@MessageMapping("/{passCode}/roundover")
	@SendTo("/topic/{passCode}/roundover")
	public boolean endRound(@DestinationVariable String passCode) {
		nextQuestion(passCode);
		return true;
	}

	@MessageMapping("/{passCode}/finished")
	@SendTo("/topic/{passCode}/finished")
	public String notifyFinished(@DestinationVariable String passCode) {
		gameSessions.remove(passCode);
		return "Game ended";
	}

	@MessageMapping("/{passCode}/getquestion")
	@SendTo("/topic/{passCode}/question")
	public QuestionDto getCurrentQuestion(@DestinationVariable String passCode) {
		GameSessionDto session = getSession(passCode);

		// end game if out of questions
		Integer currentIndex = session.getCurrentQuestionIndex();
		if (currentIndex > session.getHighestQuestionsIndex()) {
			messagingTemplate.convertAndSend("/topic/" + passCode + "/finished", "Game ended");
		}

		QuestionDto question = session.getCurrentQuestion();
		return question;
	}

	@MessageMapping("/{passCode}/answer")
	@SendTo("/topic/{passCode}/roundover")
	public boolean handleAnswer(@DestinationVariable String passCode, AnswerDto answer) {
		GameSessionDto session = getSession(passCode);
		String playerName = answer.getPlayername();
		List<PlayerDto> players = session.getPlayers();
		players.stream().forEach(p -> {
			if (p.getName().equals(playerName)) {
				p.setAnsweredThisRound(true);
				if (answerIsCorrect(answer, session)) {
					Integer score = p.getScore();
					p.setScore(score + 10);
				}
			}
		});
		return allPlayersHaveAnsweredCurrentQuestion(passCode);
	}

	void nextQuestion(String passCode) {
		GameSessionDto session = getSession(passCode);
		Integer currentIndex = session.getCurrentQuestionIndex();

		// reset answer progress
		session.getPlayers().forEach(p -> {
			p.setAnsweredThisRound(false);
		});

		session.setCurrentQuestionIndex(currentIndex + 1);
	}

	private boolean allPlayersHaveAnsweredCurrentQuestion(String passCode) {
		GameSessionDto session = getSession(passCode);
		List<PlayerDto> players = session.getPlayers();
		for (PlayerDto p : players) {
			if (!p.isAnsweredThisRound())
				return false;
		}
		nextQuestion(passCode);
		return true;
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

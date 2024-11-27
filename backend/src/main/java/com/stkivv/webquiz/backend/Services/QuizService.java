package com.stkivv.webquiz.backend.Services;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.stkivv.webquiz.backend.ObjectMapperUtils;
import com.stkivv.webquiz.backend.DAL.QuizRepository;
import com.stkivv.webquiz.backend.DAL.UserRepository;
import com.stkivv.webquiz.backend.DTO.QuizDto;
import com.stkivv.webquiz.backend.domain.AppUser;
import com.stkivv.webquiz.backend.domain.Quiz;

@Service
public class QuizService {

	private final QuizRepository quizRepository;
	private final UserRepository userRepository;

	public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
		this.quizRepository = quizRepository;
		this.userRepository = userRepository;
	}

	public List<QuizDto> getAllQuizzesForUser(String username) {
		AppUser user = getUser(username);
		List<Quiz> quiz = quizRepository.findByAppUser(user);
		return ObjectMapperUtils.mapAll(quiz, QuizDto.class);
	}

	public QuizDto getQuizById(String username, UUID quizId) throws NoSuchElementException {
		Quiz quiz = findByUsernameAndQuizId(username, quizId);
		return ObjectMapperUtils.map(quiz, QuizDto.class);
	}

	public QuizDto createOrUpdateQuiz(String username, QuizDto quizDto) throws IllegalArgumentException {
		Quiz quiz = ObjectMapperUtils.map(quizDto, Quiz.class);

		AppUser user = getUser(username);
		quiz.setAppUser(user);
		quiz.getQuestions().forEach(question -> {
			question.setQuiz(quiz);
			question.getOptions().forEach(option -> option.setQuestion(question));
		});

		Quiz savedQuiz = quizRepository.save(quiz);
		return ObjectMapperUtils.map(savedQuiz, QuizDto.class);
	}

	public void deleteQuiz(String username, UUID quizId) {
		Quiz quiz = findByUsernameAndQuizId(username, quizId);
		quizRepository.delete(quiz);
	}

	private AppUser getUser(String username) throws UsernameNotFoundException {
		AppUser user = userRepository.findByUsername(username);

		if (user == null) {
			throw new UsernameNotFoundException("User Not Found with username: " + username);
		}
		return user;
	}

	private Quiz findByUsernameAndQuizId(String username, UUID quizId) {
		AppUser user = getUser(username);
		Optional<Quiz> quizOptional = quizRepository.findByQuizIdAndAppUser(quizId, user);
		return quizOptional.get();
	}
}

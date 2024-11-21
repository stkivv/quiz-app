package com.stkivv.webquiz.backend.DTO;

import java.util.List;

import lombok.Data;

@Data
public class GameSessionDto {
	private List<QuestionDto> questions;
	private Integer currentQuestionIndex = 0;
	private Integer highestQuestionsIndex;
	private List<PlayerDto> players;

	public void setQuestions(List<QuestionDto> questions) {
		this.questions = questions;
		highestQuestionsIndex = questions.size() - 1;
	}

	public QuestionDto getCurrentQuestion() {
		return questions.get(currentQuestionIndex);
	}
}

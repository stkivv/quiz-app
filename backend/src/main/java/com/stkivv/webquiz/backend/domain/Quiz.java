package com.stkivv.webquiz.backend.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID quizId;

	@ManyToOne
	@JoinColumn(name = "user_fk", nullable = false)
	private AppUser appUser;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "quiz", fetch = FetchType.EAGER)
	@OrderColumn(name = "question_order")
	private List<Question> questions;

	@Column(nullable = false)
	private String title;
	@Column(nullable = false)
	private String description;
	@Column(nullable = false)
	private boolean publicQuiz;
	@Column(nullable = false)
	private String passCode;
	@Column(nullable = false)
	private LocalDateTime lastEdit;
}

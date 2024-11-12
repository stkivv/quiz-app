import { Question } from "./question-dto";

export interface Quiz {
  title: string,
  description: string,
  publicQuiz: boolean,
  passCode: string,
  lastEdit: Date,
  questions: Question[]
}

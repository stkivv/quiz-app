import { Question } from "./question-dto";

export interface Quiz {
  id?: string,
  title: string,
  description: string,
  publicQuiz: boolean,
  passCode?: string,
  lastEdit?: Date,
  questions: Question[]
}

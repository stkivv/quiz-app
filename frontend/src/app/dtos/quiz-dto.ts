import { Question } from "./question-dto";

export interface Quiz {
  title: string,
  description: string,
  publicQuiz: boolean,
  passCode: string | undefined,
  lastEdit: Date | undefined,
  questions: Question[]
}

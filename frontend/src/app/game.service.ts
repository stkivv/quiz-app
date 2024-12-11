import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Player } from './dtos/player-dto';
import { Question } from './dtos/question-dto';

// note: this is effectively just a wrapper for websocketservice,
// to make it a bit nicer to use and avoid duplication
@Injectable()
export class GameService {

  constructor(private websocketService: WebsocketService) { }

  private passcode = "";

  private TOPICS = {
    players: () => `/topic/${this.passcode}/players`,
    question: () => `/topic/${this.passcode}/question`,
    finished: () => `/topic/${this.passcode}/finished`,
    roundover: () => `/topic/${this.passcode}/roundover`,
    start: () => `/topic/${this.passcode}/start`,
    host: (quizId: string) => `/topic/${quizId}/host`,
  };

  private DESTINATIONS = {
    roundover: () => `/app/${this.passcode}/roundover`,
    finished: () => `/app/${this.passcode}/finished`,
    getquestion: () => `/app/${this.passcode}/getquestion`,
    players: () => `/app/${this.passcode}/players`,
    answer: () => `/app/${this.passcode}/answer`,
    host: (quizId: string) => `/app/${quizId}/host`,
    start: () => `/app/${this.passcode}/start`,
    join: () => `/app/${this.passcode}/join`,
  }

  connectToWebsocket(passcode: string): void {
    this.passcode = passcode;
    this.websocketService.connect();
  }

  disconnectFromWebsocket(): void {
    this.websocketService.disconnect();
  }

  subscribeToHostEvent(quizId: string, callback: (passcode: string) => void) {
    this.websocketService.subscribe(this.TOPICS.host(quizId), (msg) => {
      this.passcode = msg.body;
      callback(this.passcode);
    });
  }

  subscribeToGameStartEvent(callback: () => void) {
    this.websocketService.subscribe(this.TOPICS.start(), () => callback());
  }

  subscribeToPlayerList(callback: (players: Player[]) => void) {
    this.websocketService.subscribe(this.TOPICS.players(), (msg) => {
      callback(JSON.parse(msg.body))
    });
  }

  subscribeToNewQuestionEvent(callback: (question: Question) => void) {
    this.websocketService.subscribe(this.TOPICS.question(), (msg) => {
      callback(JSON.parse(msg.body));
    });
  }

  subscribeToGameFinishedEvent(callback: () => void) {
    this.websocketService.subscribe(this.TOPICS.finished(), () => callback());
  }


  subscribeToRoundOverEvent(callback: () => void) {
    this.websocketService.subscribe(this.TOPICS.roundover(), (msg) => {
      const isOver: boolean = JSON.parse(msg.body);
      if (!isOver) return;
      callback();
    });
  }

  // initialize a new game instance
  hostGame(quizId: string, username: string) {
    this.websocketService.sendMessage(this.DESTINATIONS.host(quizId), username);
  }

  // start the gameplay loop
  startGame(username: string) {
    this.websocketService.sendMessage(this.DESTINATIONS.start(), username);
  }

  joinGame(name: string) {
    this.websocketService.sendMessage(this.DESTINATIONS.join(), name);
  }

  sendRoundOverSignal() {
    this.websocketService.sendMessage(this.DESTINATIONS.roundover(), "");
  }

  sendGameFinishedSignal() {
    this.websocketService.sendMessage(this.DESTINATIONS.finished(), "");
  }

  getQuestion() {
    this.websocketService.sendMessage(this.DESTINATIONS.getquestion(), "");
  }

  getPlayers() {
    this.websocketService.sendMessage(this.DESTINATIONS.players(), "");
  }

  sendAnswer(answer: string) {
    this.websocketService.sendMessage(this.DESTINATIONS.answer(), answer);
  }
}

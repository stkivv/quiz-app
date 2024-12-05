import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { environment } from '../environments/environment';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client!: Client;
  private connected$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.client = new Client({
      brokerURL: environment.websocketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.connected$.next(true);
    };

    this.client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      this.connected$.next(false);
    };

    this.client.onStompError = (frame) => {
      console.error(`Broker reported error: ${frame.headers['message']}`);
      console.error(`Additional details: ${frame.body}`);
    };
  }

  public subscribe(topic: string, callback: (message: Message) => void): void {
    this.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((connected) => {
        if (connected) {
          console.log("subscribing to: " + topic);
          this.client.subscribe(topic, callback)
        }
      })
  }

  public sendMessage(destination: string, body: any): void {
    this.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((connected) => {
        if (connected) {
          console.log("sending message to: " + destination);
          this.client.publish({
            destination: destination,
            body: body,
          });
        }
      })

  }

  public connect(): void {
    this.client.activate();
  }

  public disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.client.active) {
      this.client.deactivate();
    }
  }
}

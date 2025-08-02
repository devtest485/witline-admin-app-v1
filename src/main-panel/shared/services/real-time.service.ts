import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  private connections = new Map<string, Subject<any>>();
  private updateInterval = 5000; // 5 seconds

  constructor() { }

  subscribe(channelId: string): Observable<any> {
    if (!this.connections.has(channelId)) {
      const subject = new Subject<any>();
      this.connections.set(channelId, subject);

      // Simulate real-time updates
      this.startUpdateLoop(channelId, subject);
    }

    return this.connections.get(channelId)!.asObservable();
  }

  unsubscribe(channelId: string): void {
    if (this.connections.has(channelId)) {
      this.connections.get(channelId)!.complete();
      this.connections.delete(channelId);
    }
  }

  broadcast(channelId: string, data: any): void {
    if (this.connections.has(channelId)) {
      this.connections.get(channelId)!.next(data);
    }
  }

  private startUpdateLoop(channelId: string, subject: Subject<any>): void {
    const interval = setInterval(() => {
      // Simulate updates
      const updateData = {
        timestamp: new Date(),
        type: 'update',
        channelId,
        data: {
          // Add your update logic here
          randomValue: Math.random(),
          counter: Date.now()
        }
      };

      subject.next(updateData);
    }, this.updateInterval);

    // Clean up interval when subject completes
    subject.subscribe({
      complete: () => clearInterval(interval)
    });
  }
}

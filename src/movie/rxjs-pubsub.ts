import { Observable, Subject } from 'rxjs';

export class RxPubSub<T> {
  private eventStream = new Subject<T>();

  publish(data: T) {
    this.eventStream.next(data);
  }

  subscribe(): Observable<T> {
    return this.eventStream.asObservable();
  }
}

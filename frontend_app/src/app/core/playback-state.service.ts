import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from './audio.service';

/**
 * PUBLIC_INTERFACE
 * Simple state container for queue and selection, useful for cross-component coordination.
 */
@Injectable({ providedIn: 'root' })
export class PlaybackStateService {
  queue$ = new BehaviorSubject<Track[]>([]);
  index$ = new BehaviorSubject<number>(-1);

  // PUBLIC_INTERFACE
  setQueue(queue: Track[], index = 0) {
    this.queue$.next(queue.slice());
    this.index$.next(index);
  }
}

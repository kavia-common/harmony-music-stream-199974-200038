import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

/** Basic track entity used by the player. */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  durationMs: number;
  audioUrl: string;
  coverUrl?: string;
}

/**
 * PUBLIC_INTERFACE
 * AudioService wraps HTMLAudioElement for playback control, time/volume tracking and queue navigation.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio: any;
  private queue: Track[] = [];
  private currentIndex = -1;

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private playingSubject = new BehaviorSubject<boolean>(false);
  private progressSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(1);
  private mutedSubject = new BehaviorSubject<boolean>(false);

  currentTrack$ = this.currentTrackSubject.asObservable().pipe(distinctUntilChanged());
  isPlaying$ = this.playingSubject.asObservable().pipe(distinctUntilChanged());
  progress$ = this.progressSubject.asObservable();
  duration$ = this.durationSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();
  muted$ = this.mutedSubject.asObservable();

  constructor() {
    if (typeof globalThis !== 'undefined' && (globalThis as any).Audio) {
      this.audio = new (globalThis as any).Audio();
      this.audio.preload = 'auto';
      this.audio.addEventListener('timeupdate', () => {
        this.progressSubject.next(this.audio.currentTime);
      });
      this.audio.addEventListener('durationchange', () => {
        this.durationSubject.next(this.audio.duration || 0);
      });
      this.audio.addEventListener('ended', () => {
        this.next();
      });
      this.volumeSubject.next(this.audio.volume);
      this.mutedSubject.next(this.audio.muted);
    } else {
      // SSR fallback element to avoid undefined access
      this.audio = {
        src: '',
        preload: 'none',
        paused: true,
        currentTime: 0,
        duration: 0,
        volume: 1,
        muted: false,
        play: async () => { return; },
        pause: () => { /* noop */ },
        addEventListener: () => { /* noop */ },
        removeEventListener: () => { /* noop */ }
      } as any;
    }
  }

  /** Load a queue and begin playback at index (default 0). */
  // PUBLIC_INTERFACE
  playQueue(tracks: Track[], startIndex = 0): void {
    this.queue = tracks.slice();
    this.currentIndex = Math.min(Math.max(startIndex, 0), this.queue.length - 1);
    this.loadAndPlayCurrent();
  }

  /** Toggle play/pause. */
  // PUBLIC_INTERFACE
  toggle(): void {
    if (this.audio.paused) {
      void this.audio.play();
      this.playingSubject.next(true);
    } else {
      this.audio.pause();
      this.playingSubject.next(false);
    }
  }

  /** Play specific track in current queue by index. */
  // PUBLIC_INTERFACE
  playIndex(index: number): void {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      this.loadAndPlayCurrent();
    }
  }

  /** Play next in queue. */
  // PUBLIC_INTERFACE
  next(): void {
    if (this.queue.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    this.loadAndPlayCurrent();
  }

  /** Play previous in queue. */
  // PUBLIC_INTERFACE
  prev(): void {
    if (this.queue.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    this.loadAndPlayCurrent();
  }

  /** Seek to time (seconds). */
  // PUBLIC_INTERFACE
  seek(seconds: number): void {
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || seconds));
    this.progressSubject.next(this.audio.currentTime);
  }

  /** Set volume 0..1. */
  // PUBLIC_INTERFACE
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(volume, 1));
    this.volumeSubject.next(this.audio.volume);
  }

  /** Toggle mute. */
  // PUBLIC_INTERFACE
  toggleMute(): void {
    this.audio.muted = !this.audio.muted;
    this.mutedSubject.next(this.audio.muted);
  }

  /** Get current queue snapshot. */
  // PUBLIC_INTERFACE
  getQueue(): Track[] {
    return this.queue.slice();
  }

  private loadAndPlayCurrent(): void {
    const track = this.queue[this.currentIndex];
    if (!track) return;
    this.audio.src = track.audioUrl;
    this.currentTrackSubject.next(track);
    void this.audio.play().then(() => {
      this.playingSubject.next(true);
    }).catch(() => {
      // Autoplay may be blocked; remain paused
      this.playingSubject.next(false);
    });
  }
}

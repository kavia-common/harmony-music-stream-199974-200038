import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AudioService, Track } from '../../core/audio.service';
import { Subscription } from 'rxjs';

/**
 * PUBLIC_INTERFACE
 * PlayerBar renders persistent bottom player with controls.
 */
@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [NgIf],
  template: `
  <div class="player" role="region" aria-label="Audio player">
    <div class="left" *ngIf="track">
      <div class="cover" [style.backgroundImage]="'url(' + (track.coverUrl || placeholder) + ')'"></div>
      <div class="meta">
        <div class="title">{{ track.title }}</div>
        <div class="artist">{{ track.artist }}</div>
      </div>
    </div>

    <div class="center">
      <div class="controls">
        <button class="btn ghost" (click)="prev()" aria-label="Previous track">⏮</button>
        <button class="btn primary" (click)="toggle()" [attr.aria-label]="isPlaying ? 'Pause' : 'Play'">
          {{ isPlaying ? '⏸' : '▶️' }}
        </button>
        <button class="btn ghost" (click)="next()" aria-label="Next track">⏭</button>
      </div>
      <div class="progress">
        <span class="time">{{ time(progress) }}</span>
        <input class="seek" type="range" min="0" [max]="duration" [value]="progress" (input)="onSeek($any($event).target.value)" aria-label="Seek" />
        <span class="time">{{ time(duration) }}</span>
      </div>
    </div>

    <div class="right">
      <button class="btn ghost" (click)="toggleMute()" [attr.aria-label]="muted ? 'Unmute' : 'Mute'">{{ muted ? '🔇' : '🔊' }}</button>
      <input type="range" min="0" max="1" step="0.01" [value]="volume" (input)="onVolume($any($event).target.value)" aria-label="Volume" />
    </div>
  </div>
  `,
  styles: [`
    .player{
      position: sticky; bottom: 0; z-index: 20;
      display:grid; grid-template-columns: 1fr 2fr 1fr; align-items:center; gap: 12px;
      padding: 10px 16px; background: var(--color-surface);
      border-top: 1px solid rgba(17,24,39,0.06); box-shadow: 0 -6px 20px rgba(31,41,55,0.06);
    }
    .left{ display:flex; align-items:center; gap:10px; }
    .cover{ width: 44px; height: 44px; background-size: cover; background-position: center; border-radius: 8px; }
    .meta .title{ font-weight: 700; color: var(--color-text); }
    .meta .artist{ color:#6b7280; font-size: 12px; }
    .controls{ display:flex; justify-content:center; gap: 8px; }
    .btn{ padding: 6px 10px; border-radius: 10px; border: 1px solid transparent; cursor: pointer; background: transparent; outline: none; }
    .btn.ghost:hover{ background: rgba(17,24,39,0.05); }
    .btn.primary{ background: var(--color-primary); color: white; }
    .btn:focus{ box-shadow: var(--focus-ring); }
    .progress{ display:flex; align-items:center; gap: 10px; margin-top: 6px; }
    .seek{ width: 100%; }
    .time{ color:#6b7280; font-size: 12px; }
    .right{ display:flex; align-items:center; gap: 10px; justify-content:flex-end; }
    @media (max-width: 768px){
      .player{ grid-template-columns: 1fr; }
      .center{ order: 3; }
      .right{ order: 2; }
      .left{ order: 1; }
    }
  `]
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  track: Track | null = null;
  isPlaying = false;
  progress = 0;
  duration = 0;
  volume = 1;
  muted = false;
  placeholder = 'https://images.unsplash.com/photo-1527549993586-dff825b37782?q=80&w=600&auto=format&fit=crop';

  private sub = new Subscription();

  constructor(private audio: AudioService) {}

  ngOnInit(): void {
    this.sub.add(this.audio.currentTrack$.subscribe(t => this.track = t));
    this.sub.add(this.audio.isPlaying$.subscribe(p => this.isPlaying = p));
    this.sub.add(this.audio.progress$.subscribe(x => this.progress = x));
    this.sub.add(this.audio.duration$.subscribe(d => this.duration = d));
    this.sub.add(this.audio.volume$.subscribe(v => this.volume = v));
    this.sub.add(this.audio.muted$.subscribe(m => this.muted = m));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggle() { this.audio.toggle(); }
  next() { this.audio.next(); }
  prev() { this.audio.prev(); }
  onSeek(v: number) { this.audio.seek(Number(v)); }
  onVolume(v: number) { this.audio.setVolume(Number(v)); }
  toggleMute() { this.audio.toggleMute(); }

  time(sec: number): string {
    if (!sec || Number.isNaN(sec)) return '0:00';
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, '0')}`;
  }
}

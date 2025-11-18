import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { Track } from '../../core/audio.service';

/**
 * PUBLIC_INTERFACE
 * TrackList shows tracks with per-row play action.
 */
@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [NgFor],
  template: `
  <div class="list" role="list" aria-label="Track list">
    <div class="row head">
      <div>#</div>
      <div>Title</div>
      <div>Artist</div>
      <div>Duration</div>
    </div>
    <div
      class="row"
      role="listitem"
      tabindex="0"
      *ngFor="let t of tracks; let i = index"
      (dblclick)="play.emit(i)"
      (keyup.enter)="play.emit(i)"
    >
      <div>{{i+1}}</div>
      <div class="title">{{t.title}}</div>
      <div>{{t.artist}}</div>
      <div>{{ format(t.durationMs) }}</div>
    </div>
  </div>
  `,
  styles: [`
    .list{ width: 100%; background: var(--color-surface); border-radius: var(--radius-lg); overflow:hidden; border: 1px solid rgba(17,24,39,0.06); }
    .row{ display:grid; grid-template-columns: 40px 1fr 1fr 80px; gap: 8px; padding: 12px; align-items: center; border-top: 1px solid rgba(17,24,39,0.06); }
    .row.head{ font-weight: 600; color:#6b7280; background: rgba(17,24,39,0.02); border-top: 0; }
    .row:not(.head):hover{ background: rgba(37,99,235,0.06); cursor: pointer; }
    .row:focus{ outline: none; box-shadow: inset var(--focus-ring); }
    .title{ color: var(--color-text); font-weight: 600; }
  `]
})
export class TrackListComponent {
  @Input() tracks: Track[] = [];
  @Output() play = new EventEmitter<number>();

  format(ms: number): string {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, '0')}`;
  }
}

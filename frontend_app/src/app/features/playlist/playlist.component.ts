import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Playlist } from '../../core/api.service';
import { TrackListComponent } from '../../shared/track-list/track-list.component';
import { NgIf } from '@angular/common';
import { AudioService } from '../../core/audio.service';

/**
 * PUBLIC_INTERFACE
 * Playlist page shows playlist details and track list.
 */
@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [NgIf, TrackListComponent],
  template: `
  <section *ngIf="playlist" class="wrap">
    <div class="header">
      <div class="cover" [style.backgroundImage]="'url(' + (playlist.coverUrl || placeholder) + ')'"></div>
      <div>
        <div class="eyebrow">Playlist</div>
        <h1>{{playlist.name}}</h1>
        <p class="desc" *ngIf="playlist.description">{{playlist.description}}</p>
      </div>
    </div>

    <app-track-list [tracks]="playlist.tracks" (play)="playIndex($event)"></app-track-list>
  </section>
  `,
  styles: [`
    .wrap{ display: flex; flex-direction: column; gap: 16px; }
    .header{ display:flex; align-items: center; gap: 16px; }
    .cover{ width: 140px; height: 140px; background-size: cover; background-position:center; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
    .eyebrow{ color:#6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
    h1{ color: var(--color-text); font-size: 28px; }
    .desc{ color:#6b7280; }
  `]
})
export class PlaylistComponent implements OnInit {
  playlist: Playlist | null = null;
  placeholder = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=600&auto=format&fit=crop';

  constructor(private route: ActivatedRoute, private api: ApiService, private audio: AudioService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.api.getPlaylist(id).subscribe(p => this.playlist = p);
  }

  playIndex(i: number) {
    if (this.playlist?.tracks?.length) {
      this.audio.playQueue(this.playlist.tracks, i);
    }
  }
}

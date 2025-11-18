import { Component, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ApiService, SearchResults } from '../../core/api.service';
import { CardGridComponent } from '../../shared/card-grid/card-grid.component';
import { TrackListComponent } from '../../shared/track-list/track-list.component';
import { AudioService } from '../../core/audio.service';

/**
 * PUBLIC_INTERFACE
 * Search page: shows tracks/artists/albums results.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgFor, CardGridComponent, TrackListComponent],
  template: `
  <section class="section">
    <h2>Search</h2>
    <p class="hint">Use the search field in the top bar and press enter.</p>

    <div *ngIf="results">
      <h3>Tracks</h3>
      <app-track-list [tracks]="results.tracks" (play)="playIndex($event)"></app-track-list>

      <div class="pad"></div>
      <h3>Albums</h3>
      <app-card-grid [items]="results.albums" (open)="noop()"></app-card-grid>

      <div class="pad"></div>
      <h3>Artists</h3>
      <div class="artists">
        <span class="chip" *ngFor="let a of results.artists">{{a.name}}</span>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .section{ margin-bottom: 24px; }
    .hint{ color:#6b7280; }
    .pad{ height: 16px; }
    .artists{ display:flex; gap:8px; flex-wrap: wrap; }
    .chip{ background: rgba(37,99,235,0.08); color: var(--color-primary); padding: 6px 10px; border-radius: 999px; }
  `]
})
export class SearchComponent implements OnDestroy {
  results: SearchResults | null = null;
  private listener = (e: any) => this.performSearch(String(e?.detail?.query ?? ''));

  constructor(private api: ApiService, private audio: AudioService) {
    const doc = (typeof globalThis !== 'undefined') ? (globalThis as any).document : undefined;
    if (doc && typeof doc.addEventListener === 'function') {
      doc.addEventListener('perform-search', this.listener as any);
    }
  }

  ngOnDestroy(): void {
    const doc = (typeof globalThis !== 'undefined') ? (globalThis as any).document : undefined;
    if (doc && typeof doc.removeEventListener === 'function') {
      doc.removeEventListener('perform-search', this.listener as any);
    }
  }

  // PUBLIC_INTERFACE
  performSearch(query: string) {
    if (!query) { this.results = { tracks: [], albums: [], artists: [] }; return; }
    this.api.search(query).subscribe(r => this.results = r);
  }

  playIndex(i: number) {
    if (this.results?.tracks?.length) {
      this.audio.playQueue(this.results.tracks, i);
    }
  }

  noop() {}
}

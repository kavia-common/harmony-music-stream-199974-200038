import { Component, OnInit } from '@angular/core';
import { ApiService, Playlist, AlbumCard } from '../../core/api.service';
import { CardGridComponent } from '../../shared/card-grid/card-grid.component';
import { Router } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * Home page shows featured content (playlists/albums).
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardGridComponent],
  template: `
  <section class="section">
    <h2>Featured Playlists</h2>
    <div class="spacer"></div>
    <app-card-grid [items]="featured?.playlists ?? []" (open)="openPlaylist($event)"></app-card-grid>
  </section>

  <section class="section">
    <h2>Trending Albums</h2>
    <div class="spacer"></div>
    <app-card-grid [items]="featured?.albums ?? []" (open)="noop()"></app-card-grid>
  </section>
  `,
  styles: [`
    .section{ margin-bottom: 24px; }
    h2{ color: var(--color-text); }
    .spacer{ height: 12px; }
  `]
})
export class HomeComponent implements OnInit {
  featured: { playlists: Playlist[]; albums: AlbumCard[] } | null = null;
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getFeatured().subscribe(data => {
      this.featured = data;
      this.loading = false;
    });
  }

  openPlaylist(item: any) {
    this.router.navigate(['/playlist', item.id]);
  }

  noop() {}
}

import { Component, OnInit } from '@angular/core';
import { CardGridComponent } from '../../shared/card-grid/card-grid.component';
import { ApiService, Playlist } from '../../core/api.service';
import { Router } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * Library page shows user playlists.
 */
@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CardGridComponent],
  template: `
  <section>
    <h2>Your Library</h2>
    <div class="spacer"></div>
    <app-card-grid [items]="playlists" (open)="open($event)"></app-card-grid>
  </section>
  `,
  styles: [`
    .spacer{ height: 12px; }
  `]
})
export class LibraryComponent implements OnInit {
  playlists: Playlist[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getLibrary().subscribe(p => this.playlists = p);
  }

  open(p: Playlist) {
    this.router.navigate(['/playlist', p.id]);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarNavComponent } from './shared/sidebar-nav/sidebar-nav.component';
import { TopBarSearchComponent } from './shared/topbar-search/topbar-search.component';
import { PlayerBarComponent } from './shared/player-bar/player-bar.component';
import { ThemeService } from './core/theme.service';
import { ApiService, MockApiService } from './core/api.service';
import { ENV_CONFIG, getEnvironment, shouldUseMock } from './core/env.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent, TopBarSearchComponent, PlayerBarComponent],
  providers: [
    { provide: ENV_CONFIG, useFactory: getEnvironment },
    {
      provide: ApiService,
      useFactory: () => {
        // For now, we only have a mock; return a new instance.
        // If a real implementation is added, choose based on shouldUseMock(getEnvironment()).
        return new MockApiService();
      }
    }
  ],
  template: `
  <div class="app">
    <app-sidebar-nav></app-sidebar-nav>
    <main class="main">
      <app-topbar-search (search)="onSearch($event)"></app-topbar-search>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
      <app-player-bar></app-player-bar>
    </main>
  </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private theme = inject(ThemeService);
  private router = inject(Router);

  ngOnInit(): void {
    this.theme.applyOceanTheme();
  }

  onSearch(query: string) {
    this.router.navigate(['/search']).then(() => {
      // Dispatch a custom event only in the browser; avoid direct global references.
      try {
        const g: any = (typeof globalThis !== 'undefined') ? (globalThis as any) : {};
        const doc = g.document;
        if (doc && typeof doc.dispatchEvent === 'function') {
          const CE = g.CustomEvent;
          const evt = CE ? new CE('perform-search', { detail: { query } }) : ({ type: 'perform-search', detail: { query } });
          doc.dispatchEvent(evt);
        }
      } catch {
        // ignore if not supported
      }
    });
  }
}

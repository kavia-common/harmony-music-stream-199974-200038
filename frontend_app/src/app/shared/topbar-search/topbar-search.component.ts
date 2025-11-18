import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * TopBarSearch provides search input and user actions.
 */
@Component({
  selector: 'app-topbar-search',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <header class="topbar" aria-label="Top bar with search">
    <input
      [(ngModel)]="query"
      (keyup.enter)="submit()"
      type="search"
      class="search"
      placeholder="What do you want to listen to?"
      aria-label="Search"
    />
    <div class="actions">
      <button class="btn ghost" routerLink="/" aria-label="Home">Home</button>
      <button class="btn ghost" routerLink="/search" aria-label="Search">Search</button>
      <button class="btn primary" aria-label="User Menu">User</button>
    </div>
  </header>
  `,
  styles: [`
    .topbar{
      position: sticky; top: 0; z-index: 10;
      display:flex; align-items:center; gap: 12px;
      padding: 12px 16px;
      background: var(--color-bg);
      border-bottom: 1px solid rgba(17,24,39,0.06);
      backdrop-filter: blur(6px);
    }
    .search{
      flex:1; padding: 12px 14px; border-radius: 999px; border: 1px solid rgba(17,24,39,0.12);
      background: var(--color-surface);
      outline: none; color: var(--color-text);
      box-shadow: var(--shadow-sm);
      transition: box-shadow .2s ease, border-color .2s ease;
    }
    .search:focus{ border-color: var(--color-primary); box-shadow: var(--focus-ring); }
    .actions{ display:flex; gap: 8px; }
    .btn{
      padding: 8px 12px; border-radius: 10px; border: 1px solid transparent; cursor: pointer;
      transition: background .2s ease, color .2s ease, border-color .2s ease;
      outline: none;
    }
    .btn.ghost { background: transparent; color:#374151; }
    .btn.ghost:hover { background: rgba(17,24,39,0.05); }
    .btn.primary { background: var(--color-primary); color: white; box-shadow: var(--shadow-sm); }
    .btn.primary:hover { filter: brightness(1.05); }
    .btn:focus{ box-shadow: var(--focus-ring); }
  `]
})
export class TopBarSearchComponent {
  @Input() defaultQuery = '';
  @Output() search = new EventEmitter<string>();
  query = this.defaultQuery;

  submit() {
    this.search.emit(this.query?.trim() ?? '');
  }
}

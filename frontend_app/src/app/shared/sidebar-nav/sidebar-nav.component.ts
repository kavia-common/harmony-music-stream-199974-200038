import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * SidebarNav renders main navigation.
 */
@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
  <aside class="sidebar" aria-label="Primary">
    <div class="brand">
      <span class="logo" aria-hidden="true">♫</span>
      <span class="name">Harmony</span>
    </div>

    <nav class="nav">
      <a routerLink="/" routerLinkActive="active" aria-label="Home">Home</a>
      <a routerLink="/search" routerLinkActive="active" aria-label="Search">Search</a>
      <a routerLink="/library" routerLinkActive="active" aria-label="Your Library">Your Library</a>
    </nav>
  </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--color-surface);
      border-right: 1px solid rgba(17,24,39,0.08);
      box-shadow: var(--shadow-sm);
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .brand{
      display:flex; align-items:center; gap:10px;
      background: var(--gradient-accent);
      padding: 12px;
      border-radius: var(--radius-lg);
    }
    .logo{ font-size: 18px; color: var(--color-primary); }
    .name{ font-weight: 700; color: var(--color-text); }
    .nav{ display:flex; flex-direction:column; gap:10px; }
    .nav a{
      text-decoration:none; color:#374151; padding:10px 12px; border-radius:10px;
      transition: background 0.2s ease, color 0.2s ease;
      outline: none;
    }
    .nav a:hover, .nav a.active{
      background: rgba(37,99,235,0.08);
      color: var(--color-primary);
    }
    .nav a:focus { box-shadow: var(--focus-ring); }
    @media (max-width: 1024px){
      .sidebar{ width: 220px; }
    }
    @media (max-width: 768px){
      .sidebar{ display:none; }
    }
  `]
})
export class SidebarNavComponent {
  @Output() onNavigate = new EventEmitter<void>();
}

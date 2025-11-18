import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * CardGrid displays album/playlist cards.
 */
@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
  <div class="grid">
    <div
      class="card"
      tabindex="0"
      role="button"
      *ngFor="let item of items; let i = index"
      (click)="open.emit(item)"
      (keyup.enter)="open.emit(item)"
      [attr.aria-label]="item.title || item.name"
    >
      <div class="thumb" [style.backgroundImage]="'url(' + (item.coverUrl || placeholder) + ')'"></div>
      <div class="meta">
        <div class="title">{{item.title || item.name}}</div>
        <div class="subtitle" *ngIf="item.artist || item.description">
          {{item.artist || item.description}}
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .grid{
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
    .card{
      background: var(--color-surface);
      border: 1px solid rgba(17,24,39,0.06);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      cursor: pointer;
      outline: none;
      transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
    }
    .card:hover{ transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: rgba(37,99,235,0.25); }
    .card:focus{ box-shadow: var(--focus-ring); }
    .thumb{
      width: 100%; padding-top: 100%;
      background-size: cover; background-position: center;
    }
    .meta{ padding: 10px 12px; }
    .title{ font-weight: 600; color: var(--color-text); }
    .subtitle{ color:#6b7280; margin-top: 2px; font-size: 12px; }
  `]
})
export class CardGridComponent {
  @Input() items: Array<{ id: string; title?: string; name?: string; artist?: string; description?: string; coverUrl?: string }> = [];
  @Input() placeholder = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=600&auto=format&fit=crop';
  @Output() open = new EventEmitter<any>();
}

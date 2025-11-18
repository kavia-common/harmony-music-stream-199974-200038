import { Injectable } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * ThemeService applies and manages the Ocean Professional theme via CSS variables.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Apply Ocean Professional theme variables to :root. */
  // PUBLIC_INTERFACE
  applyOceanTheme(): void {
    const g: any = (typeof globalThis !== 'undefined') ? (globalThis as any) : undefined;
    const doc: any = g?.document;
    if (!doc || !doc.documentElement) return;
    const root = doc.documentElement as HTMLElement;
    this.setVar(root, '--color-primary', '#2563EB');
    this.setVar(root, '--color-secondary', '#F59E0B');
    this.setVar(root, '--color-success', '#F59E0B');
    this.setVar(root, '--color-error', '#EF4444');
    this.setVar(root, '--color-bg', '#f9fafb');
    this.setVar(root, '--color-surface', '#ffffff');
    this.setVar(root, '--color-text', '#111827');
    this.setVar(root, '--radius-md', '12px');
    this.setVar(root, '--radius-lg', '16px');
    this.setVar(root, '--shadow-sm', '0 1px 2px rgba(0,0,0,0.06)');
    this.setVar(root, '--shadow-md', '0 8px 30px rgba(31,41,55,0.08)');
    this.setVar(root, '--gradient-accent', 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(243,244,246,0.6))');
    this.setVar(root, '--focus-ring', '0 0 0 3px rgba(37,99,235,0.3)');
  }

  private setVar(root: HTMLElement, name: string, value: string) {
    root.style.setProperty(name, value);
  }
}

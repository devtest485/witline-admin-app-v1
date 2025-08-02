import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CustomTheme, ThemeConfig, ThemeMode } from '../interfaces/interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // Reactive signals for theme state
  public currentTheme = signal<ThemeMode>('light');
  public customTheme = signal<CustomTheme | null>(null);
  public isSystemDarkMode = signal<boolean>(false);
  public autoDetectSystem = signal<boolean>(false);

  // Predefined custom themes
  public readonly predefinedThemes: CustomTheme[] = [
    {
      name: 'Ocean Blue',
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#0369a1',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    },
    {
      name: 'Purple Haze',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#6d28d9',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1e1b4b',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0891b2'
    },
    {
      name: 'Forest Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#065f46',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    },
    {
      name: 'Sunset Orange',
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#b91c1c',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#9a3412',
      textSecondary: '#6b7280',
      border: '#fed7aa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    }
  ];

  constructor() {
    // Initialize theme from localStorage or system preference
    this.initializeTheme();

    // Watch for system theme changes
    if (isPlatformBrowser(this.platformId)) {
      this.watchSystemTheme();
    }

    // Effect to apply theme changes
    effect(() => {
      this.applyTheme();
    });
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const savedConfig = localStorage.getItem('witline-theme-config');

      if (savedConfig) {
        const config: ThemeConfig = JSON.parse(savedConfig);
        this.currentTheme.set(config.mode);
        this.autoDetectSystem.set(config.autoDetectSystem || false);

        if (config.customTheme) {
          this.customTheme.set(config.customTheme);
        }
      } else {
        // Default to system preference
        this.detectSystemTheme();
      }
    } catch (error) {
      console.warn('Failed to load theme configuration:', error);
      this.detectSystemTheme();
    }
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.isSystemDarkMode.set(mediaQuery.matches);

    mediaQuery.addEventListener('change', (e) => {
      this.isSystemDarkMode.set(e.matches);

      if (this.autoDetectSystem()) {
        this.currentTheme.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  private detectSystemTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isSystemDarkMode.set(prefersDark);
    this.currentTheme.set(prefersDark ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const theme = this.currentTheme();
    const custom = this.customTheme();

    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);

    // Apply ng-zorro theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply custom theme CSS variables
    if (theme === 'custom' && custom) {
      this.applyCSSVariables(custom);
    } else {
      this.clearCustomCSSVariables();
    }

    // Save configuration
    this.saveThemeConfig();
  }

  private applyCSSVariables(theme: CustomTheme): void {
    const root = document.documentElement;

    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-success', theme.success);
    root.style.setProperty('--theme-warning', theme.warning);
    root.style.setProperty('--theme-error', theme.error);
    root.style.setProperty('--theme-info', theme.info);
  }

  private clearCustomCSSVariables(): void {
    const root = document.documentElement;
    const customProps = [
      '--theme-primary', '--theme-secondary', '--theme-accent',
      '--theme-background', '--theme-surface', '--theme-text',
      '--theme-text-secondary', '--theme-border', '--theme-success',
      '--theme-warning', '--theme-error', '--theme-info'
    ];

    customProps.forEach(prop => root.style.removeProperty(prop));
  }

  private saveThemeConfig(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const config: ThemeConfig = {
      mode: this.currentTheme(),
      customTheme: this.customTheme() || undefined,
      autoDetectSystem: this.autoDetectSystem()
    };

    try {
      localStorage.setItem('witline-theme-config', JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save theme configuration:', error);
    }
  }

  // Public methods
  setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);

    if (mode !== 'custom') {
      this.autoDetectSystem.set(false);
    }
  }

  setCustomTheme(theme: CustomTheme): void {
    this.customTheme.set(theme);
    this.currentTheme.set('custom');
    this.autoDetectSystem.set(false);
  }

  setPredefinedTheme(themeName: string): void {
    const theme = this.predefinedThemes.find(t => t.name === themeName);
    if (theme) {
      this.setCustomTheme(theme);
    }
  }

  toggleTheme(): void {
    const current = this.currentTheme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('light');
    }
  }

  enableAutoDetect(): void {
    this.autoDetectSystem.set(true);
    this.currentTheme.set(this.isSystemDarkMode() ? 'dark' : 'light');
  }

  disableAutoDetect(): void {
    this.autoDetectSystem.set(false);
  }

  // Utility methods for components
  getThemeClasses(): string {
    const theme = this.currentTheme();
    const baseClasses = [`theme-${theme}`];

    if (theme === 'dark') {
      baseClasses.push('dark');
    }

    return baseClasses.join(' ');
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  isLight(): boolean {
    return this.currentTheme() === 'light';
  }

  isCustom(): boolean {
    return this.currentTheme() === 'custom';
  }
}

import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ThemeService } from '../../services/theme.service';
import { ThemeMode } from '../../interfaces/interfaces';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzToolTipModule,
    NzBadgeModule,
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
  // Reactive signals for theme state
  currentIcon = computed(() => {
    const theme = this.themeService.currentTheme();
    if (this.themeService.autoDetectSystem()) return 'sync';

    switch (theme) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'custom': return 'bg-colors';
      default: return 'sun';
    }
  });

  currentThemeLabel = computed(() => {
    const theme = this.themeService.currentTheme();

    if (this.themeService.autoDetectSystem()) {
      return 'Auto';
    }

    if (theme === 'custom') {
      const customTheme = this.themeService.customTheme();
      return customTheme?.name || 'Custom';
    }

    return theme.charAt(0).toUpperCase() + theme.slice(1);
  });

  tooltipText = computed(() => {
    const label = this.currentThemeLabel();
    return `Current theme: ${label}`;
  });

  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  setPredefinedTheme(themeName: string): void {
    this.themeService.setPredefinedTheme(themeName);
  }

  toggleAutoDetect(): void {
    if (this.themeService.autoDetectSystem()) {
      this.themeService.disableAutoDetect();
    } else {
      this.themeService.enableAutoDetect();
    }
  }

  isCustomThemeSelected(themeName: string): boolean {
    const current = this.themeService.customTheme();
    return this.themeService.currentTheme() === 'custom' && current?.name === themeName;
  }

  openCustomThemeBuilder(): void {
    // Implement custom theme builder modal
    console.log('Opening custom theme builder...');
  }
}

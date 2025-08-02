import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CustomTheme } from '../../shared/interfaces/interfaces';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-custom-theme-builder',
  imports: [
    CommonModule, FormsModule, NzModalModule, NzFormModule, NzInputModule,
    NzButtonModule, NzColorPickerModule, NzTabsModule, NzCardModule,
    NzIconModule, NzSelectModule, ReactiveFormsModule
  ],
  templateUrl: './custom-theme-builder.component.html',
  styleUrl: './custom-theme-builder.component.scss'
})
export class CustomThemeBuilderComponent {
  @Input() isVisible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() themeCreated = new EventEmitter<CustomTheme>();

  customTheme: CustomTheme = {
    name: 'My Custom Theme',
    primary: '#1890ff',
    secondary: '#722ed1',
    accent: '#fa541c',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#d9d9d9',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff'
  };

  public themeService = inject(ThemeService);

  loadPresetTheme(themeName: any): void {
    const preset = this.themeService.predefinedThemes.find(t => t.name === themeName);
    if (preset) {
      this.customTheme = { ...preset };
    }
  }

  saveTheme(): void {
    this.themeService.setCustomTheme(this.customTheme);
    this.themeCreated.emit(this.customTheme);
    this.onCancel();
  }

  onCancel(): void {
    this.isVisible = false;
    this.visibleChange.emit(false);
  }
}
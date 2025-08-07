import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ThemeToggleComponent } from '../../../main-panel/shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzButtonModule,
    ThemeToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}

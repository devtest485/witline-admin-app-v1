import { Component } from '@angular/core';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ThemeToggleComponent } from '../../main-panel/shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    RouterOutlet,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzDrawerModule,
    NzLayoutModule,
    NzSwitchModule,
    NzToolTipModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    ThemeToggleComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isCollapsed = false;
  mobileDrawerVisible = false;

  toggleSidebar(): void {
    if (window.innerWidth < 1024) {
      this.mobileDrawerVisible = true;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  onCollapsedChange(collapsed: boolean): void {
    this.isCollapsed = collapsed;
  }

  closeMobileDrawer(): void {
    this.mobileDrawerVisible = false;
  }
}

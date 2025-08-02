import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ThemeToggleComponent } from '../main-panel/shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzButtonModule,
    NzDrawerModule,
    ThemeToggleComponent,
    NzMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  mobileDrawerVisible = false;

  ngOnInit() {
    // Theme service is automatically initialized
  }

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

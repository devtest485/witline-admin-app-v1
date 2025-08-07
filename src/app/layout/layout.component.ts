import { Component } from '@angular/core';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    HeaderComponent,
    BreadcrumbComponent,
    LeftSidebarComponent
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

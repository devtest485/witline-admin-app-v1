import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-left-sidebar',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    RouterLink
  ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent {
  @Input() isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  onCollapsedChange(value: boolean) {
    this.collapsedChange.emit(value);
  }
}

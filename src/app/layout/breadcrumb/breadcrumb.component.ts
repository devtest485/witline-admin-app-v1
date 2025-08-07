import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    NzBreadCrumbModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() isCollapsed = false;

}

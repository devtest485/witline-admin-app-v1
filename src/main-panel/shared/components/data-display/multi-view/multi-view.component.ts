import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-view',
  imports: [
    CommonModule, FormsModule, NzTabsModule, NzCardModule, NzListModule, NzTableModule,
    NzButtonModule, NzIconModule, NzTagModule, NzSelectModule, NzSpinModule
  ],
  templateUrl: './multi-view.component.html',
  styleUrl: './multi-view.component.scss'
})
export class MultiViewComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  viewData: any[] = [];
  filteredViewData: any[] = [];
  selectedViewType = 'all';
  tabPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  isLoading = false;

  ngOnInit() {
    this.initializeMultiViewData();
    this.setupTabPosition();
  }

  private initializeMultiViewData() {
    this.isLoading = true;

    const data = this.context.sortedByAsc || [];

    // Create different view types based on data
    this.viewData = [
      {
        title: 'Grid View',
        type: 'grid',
        icon: 'appstore',
        count: data.length,
        items: data.map(item => ({
          ...item,
          lastUpdated: new Date(),
          status: item.status || 'active'
        }))
      },
      {
        title: 'List View',
        type: 'list',
        icon: 'bars',
        count: data.length,
        items: data.map(item => ({
          ...item,
          lastUpdated: new Date(),
          status: item.status || 'active',
          avatar: item.avatar
        }))
      },
      {
        title: 'Table View',
        type: 'table',
        icon: 'table',
        count: data.length,
        columns: [
          { title: 'Name', key: 'name' },
          { title: 'Description', key: 'description' },
          { title: 'Status', key: 'status' },
          { title: 'Created', key: 'created' }
        ],
        items: data.map(item => ({
          ...item,
          created: new Date().toLocaleDateString(),
          status: item.status || 'active'
        }))
      },
      {
        title: 'Analytics',
        type: 'analytics',
        icon: 'bar-chart',
        selectedMetric: 'sales',
        analytics: [
          { label: 'Total Items', value: data.length, change: 12 },
          { label: 'Active', value: Math.floor(data.length * 0.8), change: 5 },
          { label: 'Completed', value: Math.floor(data.length * 0.6), change: -2 },
          { label: 'Pending', value: Math.floor(data.length * 0.2), change: 8 }
        ]
      }
    ];

    this.filterViews();

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private setupTabPosition() {
    if (this.config.showInRightPanel) {
      this.tabPosition = 'top';
    } else if (this.config.showInModal) {
      this.tabPosition = 'top';
    }
  }

  onViewTypeChange(): void {
    this.filterViews();
  }

  private filterViews(): void {
    if (this.selectedViewType === 'all') {
      this.filteredViewData = [...this.viewData];
    } else {
      this.filteredViewData = this.viewData.filter(view => view.type === this.selectedViewType);
    }
  }

  getViewIcon(type: string): string {
    const icons: Record<string, string> = {
      grid: 'appstore',
      list: 'bars',
      table: 'table',
      analytics: 'bar-chart'
    };
    return icons[type] || 'eye';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      error: 'error',
      completed: 'processing'
    };
    return colors[status?.toLowerCase()] || 'default';
  }

  refreshAllViews(): void {
    this.initializeMultiViewData();
  }

  // Grid View Actions
  addGridItem(view: any): void {
    console.log('Adding grid item to view:', view);
  }

  // List View Actions
  addListItem(view: any): void {
    console.log('Adding list item to view:', view);
  }

  // Table View Actions
  addTableRow(view: any): void {
    console.log('Adding table row to view:', view);
  }

  exportTable(view: any): void {
    console.log('Exporting table from view:', view);
  }

  // Common Actions
  viewItem(item: any): void {
    console.log('Viewing item:', item);
  }

  editItem(item: any): void {
    console.log('Editing item:', item);
  }

  deleteItem(item: any): void {
    console.log('Deleting item:', item);
  }

  createView(): void {
    console.log('Creating new view');
  }
}
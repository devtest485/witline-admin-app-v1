import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { ThemeService } from '../../../services/theme.service';
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-list-view',
  imports: [CommonModule, FormsModule, NzCardModule, NzButtonModule, NzIconModule, NzSpinModule, NzTagModule, NzEmptyModule, NzListModule, NzAvatarModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  listData: any[] = [];
  loading = false;
  isAllSelected = false;
  selectedCount = 0;


  private themeService = inject(ThemeService);

  ngOnInit() {
    this.initializeListData();
  }

  private initializeListData() {
    this.listData = (this.context.sortedByAsc || []).map(item => ({
      ...item,
      selected: false,
      lastModified: item.lastModified || new Date(),
      tags: item.tags || [],
      priority: item.priority || 'medium',
      progress: item.progress || Math.floor(Math.random() * 100)
    }));
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      error: 'error'
    };
    return colors[status.toLowerCase()] || 'default';
  }

  getTagColor(tag: string): string {
    const colors = this.themeService.isDark()
      ? ['blue', 'green', 'purple', 'orange']
      : ['geekblue', 'green', 'purple', 'volcano'];

    return colors[tag.length % colors.length];
  }

  getItemIcon(item: any): string {
    if (item.type) {
      const iconMap: Record<string, string> = {
        user: 'user',
        file: 'file-text',
        folder: 'folder',
        task: 'check-square',
        project: 'project'
      };
      return iconMap[item.type] || 'file';
    }
    return 'file';
  }

  getAvatarStyle(item: any): any {
    if (this.themeService.isCustom()) {
      return {
        'background-color': 'var(--theme-primary)',
        'color': 'var(--theme-surface)'
      };
    }
    return {};
  }

  getPriorityClass(priority: string): string {
    const priorityClasses: Record<string, string> = {
      high: 'tw-text-red-500',
      medium: 'tw-text-yellow-500',
      low: 'tw-text-green-500'
    };
    return priorityClasses[priority.toLowerCase()] || 'theme-text-secondary';
  }

  toggleSelectAll(): void {
    this.isAllSelected = !this.isAllSelected;
    this.listData.forEach(item => item.selected = this.isAllSelected);
    this.updateSelectedCount();
  }

  onItemSelectionChange(): void {
    this.updateSelectedCount();
    this.isAllSelected = this.listData.length > 0 && this.listData.every(item => item.selected);
  }

  private updateSelectedCount(): void {
    this.selectedCount = this.listData.filter(item => item.selected).length;
  }

  viewItem(item: any, index: number): void {
    console.log('Viewing item:', item);
  }

  editItem(item: any, index: number): void {
    console.log('Editing item:', item);
  }

  deleteItem(item: any, index: number): void {
    console.log('Deleting item:', item);
  }

  bulkEdit(): void {
    const selectedItems = this.listData.filter(item => item.selected);
    console.log('Bulk editing items:', selectedItems);
  }

  bulkDelete(): void {
    const selectedItems = this.listData.filter(item => item.selected);
    console.log('Bulk deleting items:', selectedItems);
  }
}
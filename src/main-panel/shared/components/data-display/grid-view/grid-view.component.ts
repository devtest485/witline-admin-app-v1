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

@Component({
  selector: 'app-grid-view',
  imports: [CommonModule, NzCardModule, NzButtonModule, NzIconModule, NzSpinModule, NzTagModule, NzEmptyModule],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss'
})
export class GridViewComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  cardViewData: any[] = [];
  templateNode: any[] = [];
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';

  private themeService = inject(ThemeService);

  async ngOnInit() {
    this.isLoading = true;
    await this.initializeGridView();
    this.isLoading = false;
  }

  private async initializeGridView() {
    // Your existing grid initialization logic
    this.cardViewData = this.context.sortedByAsc || [];

    // Process card data with error handling
    this.cardViewData.forEach(element => {
      if (element.childCategory) {
        element.childCategory.collectionUi = this.safeJsonParse(element.childCategory.collectionUi);
        element.childCategory.gUI = this.safeJsonParse(element.childCategory.gUI);
      }
    });

    // Process template nodes
    await this.processTemplateNodes();
  }

  private async processTemplateNodes() {
    try {
      let nodes: any[] = this.context.categoryLocator?.collectionUi
        ? this.safeJsonParse(this.context.categoryLocator.collectionUi)
        : [];

      if (nodes.length > 0) {
        // Your existing node processing logic
        this.templateNode = nodes;
      }
    } catch (error) {
      console.error('Error processing template nodes:', error);
    }
  }

  getGridClasses(): string {
    const baseClasses = 'tw-grid tw-gap-4 tw-transition-all tw-duration-300';

    if (this.viewMode === 'list') {
      return `${baseClasses} tw-grid-cols-1`;
    }

    // Responsive grid based on container size
    if (this.config.showInModal) {
      return `${baseClasses} tw-grid-cols-1 md:tw-grid-cols-2`;
    }

    if (this.config.showInRightPanel) {
      return `${baseClasses} tw-grid-cols-1`;
    }

    return `${baseClasses} tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4`;
  }

  getCategoryColor(category: any): string {
    // Theme-aware category colors
    if (this.themeService.isDark()) {
      const colors = ['blue', 'green', 'purple', 'orange', 'cyan'];
      return colors[Math.abs(category.name?.length || 0) % colors.length];
    }

    const colors = ['geekblue', 'green', 'purple', 'volcano', 'cyan'];
    return colors[Math.abs(category.name?.length || 0) % colors.length];
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      error: 'error',
      processing: 'processing'
    };

    return statusColors[status.toLowerCase()] || 'default';
  }

  getStatusIcon(status: string): string {
    const statusIcons: Record<string, string> = {
      active: 'check-circle',
      inactive: 'minus-circle',
      pending: 'clock-circle',
      error: 'close-circle',
      processing: 'sync'
    };

    return statusIcons[status.toLowerCase()] || 'question-circle';
  }

  getCustomProperties(properties: any): Array<{ key: string, value: any }> {
    if (!properties) return [];

    return Object.entries(properties)
      .slice(0, 4) // Limit to 4 properties
      .map(([key, value]) => ({ key, value }));
  }

  renderNode(node: any): string {
    return `<span class="theme-text-tertiary">${node.content || node.name || 'Node'}</span>`;
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  refreshData(): void {
    this.ngOnInit();
  }

  viewItem(item: any, index: number): void {
    console.log('Viewing item:', item, 'at index:', index);
  }

  editItem(item: any, index: number): void {
    console.log('Editing item:', item, 'at index:', index);
  }

  deleteItem(item: any, index: number): void {
    console.log('Deleting item:', item, 'at index:', index);
    // Add confirmation dialog
  }

  createNewItem(): void {
    console.log('Creating new item');
  }

  private safeJsonParse(jsonString: string): any {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch {
      return {};
    }
  }
}
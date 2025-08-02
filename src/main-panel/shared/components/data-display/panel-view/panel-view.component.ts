import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { UIComponent } from '../../../enums/uicomponent';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-panel-view',
  imports: [
    CommonModule, NzCollapseModule, NzButtonModule, NzIconModule,
    NzTagModule, NzBadgeModule, NzToolTipModule, NzSpinModule
  ],
  templateUrl: './panel-view.component.html',
  styleUrl: './panel-view.component.scss'
})
export class PanelViewComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  Math = Math;
  panelData: any[] = [];
  isLoading = false;
  accordionMode = false;
  ngOnInit() {
    this.initializePanelData();
  }

  private initializePanelData() {
    this.isLoading = true;

    // Process the incoming data
    this.panelData = (this.context.sortedByAsc || []).map((item, index) => ({
      ...item,
      expanded: index === 0, // First panel expanded by default
      disabled: item.disabled || false,
      notifications: item.notifications || 0,
      progress: item.progress !== undefined ? item.progress : Math.floor(Math.random() * 100),
      metrics: item.metrics || this.generateDefaultMetrics(),
      items: item.items || [],
      actions: item.actions || this.generateDefaultActions()
    }));

    // Handle UI component specific logic
    this.handleUIComponentSpecificLogic();

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private handleUIComponentSpecificLogic() {
    switch (this.context.uiComponent) {
      case UIComponent.RightPanel:
        this.accordionMode = true;
        break;
      case UIComponent.Component:
        // Handle component specific logic
        break;
      default:
        break;
    }
  }

  private generateDefaultMetrics(): any[] {
    return [
      { label: 'Total', value: Math.floor(Math.random() * 1000), change: Math.floor(Math.random() * 20) - 10 },
      { label: 'Active', value: Math.floor(Math.random() * 100), change: Math.floor(Math.random() * 10) },
      { label: 'Completed', value: Math.floor(Math.random() * 500), change: Math.floor(Math.random() * 15) - 5 }
    ];
  }

  private generateDefaultActions(): any[] {
    return [
      { label: 'View Details', icon: 'eye', type: 'default' },
      { label: 'Export', icon: 'download', type: 'default' },
      { label: 'Settings', icon: 'setting', type: 'default' }
    ];
  }

  getPanelIcon(panel: any): string {
    if (panel.icon) return panel.icon;

    const iconMap: Record<string, string> = {
      dashboard: 'dashboard',
      analytics: 'bar-chart',
      users: 'user',
      settings: 'setting',
      reports: 'file-text',
      tasks: 'check-square'
    };

    return iconMap[panel.type?.toLowerCase()] || 'folder';
  }

  getPanelIconColor(panel: any): string {
    if (panel.status === 'error') return 'tw-text-red-500';
    if (panel.status === 'warning') return 'tw-text-yellow-500';
    if (panel.status === 'success') return 'tw-text-green-500';
    return 'theme-text-secondary';
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      error: 'error',
      success: 'success',
      warning: 'warning'
    };
    return statusColors[status.toLowerCase()] || 'default';
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'tw-text-green-500';
    if (progress >= 50) return 'tw-text-yellow-500';
    return 'tw-text-red-500';
  }

  expandAll(): void {
    this.panelData.forEach(panel => panel.expanded = true);
  }

  collapseAll(): void {
    this.panelData.forEach(panel => panel.expanded = false);
  }

  editPanel(panel: any, index: number): void {
    console.log('Editing panel:', panel, 'at index:', index);
  }

  refreshPanel(panel: any, index: number): void {
    console.log('Refreshing panel:', panel, 'at index:', index);
    // Add refresh logic
  }

  removePanel(panel: any, index: number): void {
    console.log('Removing panel:', panel, 'at index:', index);
    this.panelData.splice(index, 1);
  }

  onPanelAction(action: any, panel: any, index: number): void {
    console.log('Panel action:', action, 'for panel:', panel, 'at index:', index);
  }

  createPanel(): void {
    console.log('Creating new panel');
  }
}
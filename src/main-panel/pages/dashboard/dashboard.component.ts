import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { DynamicUIRouterComponent } from '../dynamic-ui-router/dynamic-ui-router.component';
import { CustomThemeBuilderComponent } from '../custom-theme-builder/custom-theme-builder.component';
import { ComponentConfig, ComponentContext, CustomTheme } from '../../shared/interfaces/interfaces';
import { ThemeService } from '../../shared/services/theme.service';
import { UIComponent } from '../../shared/enums/uicomponent';
import { DataDisplay } from '../../shared/enums/data-display';
import { ComponentBehaviorService } from '../../shared/services/component-behavior.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    DynamicUIRouterComponent,
    CustomThemeBuilderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  gridContext!: ComponentContext;
  gridConfig!: ComponentConfig;

  listContext!: ComponentContext;
  listConfig!: ComponentConfig;

  showCustomThemeBuilder = false;

  public themeService = inject(ThemeService);
  private componentService = inject(ComponentBehaviorService);

  ngOnInit() {
    this.setupDemoData();
  }

  private setupDemoData() {
    // Grid View Demo
    this.gridContext = this.componentService.renderComponent(
      UIComponent.NewComponent,
      DataDisplay.GridView,
      { categoryId: 1, trackingNumber: 'DEMO-001' },
      [
        {
          title: 'Sample Card 1',
          description: 'This is a demo card with theme support',
          status: 'active',
          childCategory: { name: 'Demo Category' },
          tags: ['demo', 'sample', 'card']
        },
        {
          title: 'Sample Card 2',
          description: 'Another demo card showing theme colors',
          status: 'pending',
          childCategory: { name: 'Test Category' },
          tags: ['test', 'theme']
        }
      ]
    );
    this.gridConfig = this.componentService.getComponentConfig(UIComponent.NewComponent);

    // List View Demo
    this.listContext = this.componentService.renderComponent(
      UIComponent.Component,
      DataDisplay.ListView,
      { categoryId: 2 },
      [
        {
          title: 'Demo List Item 1',
          description: 'First item in the themed list',
          status: 'active',
          priority: 'high',
          type: 'task'
        },
        {
          title: 'Demo List Item 2',
          description: 'Second item with different status',
          status: 'pending',
          priority: 'medium',
          type: 'project'
        }
      ]
    );
    this.listConfig = this.componentService.getComponentConfig(UIComponent.Component);
  }

  testComponent(type: string): void {
    console.log(`Testing ${type} component with current theme:`, this.themeService.currentTheme());

    // You can implement specific component testing logic here
    switch (type) {
      case 'grid':
        this.refreshGridData();
        break;
      case 'list':
        this.refreshListData();
        break;
      // Add other cases
    }
  }

  testPopup(): void {
    // Demo popup with theme support
    const popupContext = this.componentService.renderComponent(
      UIComponent.Popup,
      DataDisplay.MultiView,
      { categoryId: 999 },
      [
        { title: 'Popup Demo', description: 'This popup respects your theme settings' }
      ]
    );

    console.log('Testing popup component:', popupContext);
    // You would typically open a modal here
  }

  refreshGridData(): void {
    console.log('Refreshing grid data...');
    this.setupDemoData();
  }

  refreshListData(): void {
    console.log('Refreshing list data...');
    this.setupDemoData();
  }

  onThemeCreated(theme: CustomTheme): void {
    console.log('New custom theme created:', theme);
    // Theme is automatically applied by the service
  }
}

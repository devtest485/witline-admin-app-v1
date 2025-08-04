import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicUIRouterComponent } from '../dynamic-ui-router/dynamic-ui-router.component';
import { ComponentConfig, ComponentContext } from '../../shared/interfaces/interfaces';
import { UIComponent } from '../../shared/enums/uicomponent';
import { DataDisplay } from '../../shared/enums/data-display';
import { ComponentBehaviorService } from '../../shared/services/component-behavior.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { categoryLocatorData, sortedData } from '../data';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DynamicUIRouterComponent,
    NzModalModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  mainContext!: ComponentContext;
  mainConfig!: ComponentConfig;

  rightPanelContext!: ComponentContext;
  rightPanelConfig!: ComponentConfig;

  modalContext!: ComponentContext;
  modalConfig!: ComponentConfig;

  // UI state
  isLoading = false;
  showRightPanel = false;
  showModal = false;
  modalTitle = '';
  modalWidth = '800px';
  
  // Split view state
  showSplitView = false;
  leftSplitContext!: ComponentContext;
  leftSplitConfig!: ComponentConfig;
  rightSplitContext!: ComponentContext;
  rightSplitConfig!: ComponentConfig;
  
  // Merge view state
  showMergeView = false;
  primaryMergeContext!: ComponentContext;
  primaryMergeConfig!: ComponentConfig;
  secondaryMergeContext!: ComponentContext;
  secondaryMergeConfig!: ComponentConfig;

  constructor(
    private componentService: ComponentBehaviorService,
  ) { }

  ngOnInit() {
    this.loadDashboardComponents();
  }

  // Replace your original checkComponentBehavior calls with these methods:

  async loadGridData() {
    this.isLoading = true;

    try {
      // Process the data using your enhanced service
      this.mainContext = await this.componentService.renderComponent(
        categoryLocatorData.uiComponent,
        categoryLocatorData.dataDisplay,
        categoryLocatorData,
        sortedData
      );

      this.mainConfig = this.componentService.getComponentConfig(UIComponent.Popup); // Use Popup since data shows uiComponent = 8
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading grid data:', error);
      this.isLoading = false;
    }
  }

  async loadRightPanelData() {
    try {
      this.rightPanelContext = await this.componentService.renderComponent(
        UIComponent.RightPanel,
        DataDisplay.PanelView,
        { categoryId: 2 },
        [
          {
            title: 'Quick Actions',
            description: 'Frequently used actions',
            actions: [
              { label: 'New Report', icon: 'plus' },
              { label: 'Export Data', icon: 'download' }
            ]
          }
        ]
      );

      this.rightPanelConfig = this.componentService.getComponentConfig(UIComponent.RightPanel);
      this.showRightPanel = true;
    } catch (error) {
      console.error('Error loading right panel data:', error);
    }
  }

  async openFormModal() {
    try {
      this.modalContext = await this.componentService.renderComponent(
        UIComponent.Popup,
        DataDisplay.Model,
        { categoryId: 3, name: 'User Form' },
        [
          {
            name: 'Create User',
            fields: ['name', 'email', 'role', 'department']
          }
        ]
      );

      this.modalConfig = this.componentService.getComponentConfig(UIComponent.Popup);
      this.modalTitle = 'Create New User';
      this.modalWidth = '600px';
      this.showModal = true;
    } catch (error) {
      console.error('Error opening form modal:', error);
    }
  }

  private loadDashboardComponents() {
    // Load default dashboard view
    this.loadGridData();
  }

  closeModal() {
    this.showModal = false;
  }

  // Reset UI state before testing new components
  private resetUIState() {
    this.showModal = false;
    this.showRightPanel = false;
    this.showSplitView = false;
    this.showMergeView = false;
    this.mainContext = undefined as any;
    this.rightPanelContext = undefined as any;
    this.modalContext = undefined as any;
    this.leftSplitContext = undefined as any;
    this.rightSplitContext = undefined as any;
    this.primaryMergeContext = undefined as any;
    this.secondaryMergeContext = undefined as any;
  }

  // Public reset method for Reset button
  resetAllViews() {
    this.resetUIState();
    this.loadDashboardComponents(); // Load default view
  }

  // Additional test methods for different UI component combinations
  async testGridView() {
    this.isLoading = true;
    try {
      this.mainContext = await this.componentService.renderComponent(
        UIComponent.NewComponent,
        DataDisplay.GridView,
        categoryLocatorData,
        sortedData
      );
      this.mainConfig = this.componentService.getComponentConfig(UIComponent.NewComponent);
      this.isLoading = false;
    } catch (error) {
      console.error('Error testing grid view:', error);
      this.isLoading = false;
    }
  }

  async testListView() {
    this.isLoading = true;
    try {
      this.mainContext = await this.componentService.renderComponent(
        UIComponent.NewComponent,
        DataDisplay.ListView,
        categoryLocatorData,
        sortedData
      );
      this.mainConfig = this.componentService.getComponentConfig(UIComponent.NewComponent);
      this.isLoading = false;
    } catch (error) {
      console.error('Error testing list view:', error);
      this.isLoading = false;
    }
  }

  async testPanelView() {
    this.isLoading = true;
    try {
      this.mainContext = await this.componentService.renderComponent(
        UIComponent.Component,
        DataDisplay.PanelView,
        categoryLocatorData,
        sortedData
      );
      this.mainConfig = this.componentService.getComponentConfig(UIComponent.Component);
      this.isLoading = false;
    } catch (error) {
      console.error('Error testing panel view:', error);
      this.isLoading = false;
    }
  }

  async testSplitComponent() {
    this.isLoading = true;
    try {
      this.mainContext = await this.componentService.renderComponent(
        UIComponent.SplitComponent,
        DataDisplay.GridView,
        categoryLocatorData,
        sortedData
      );
      this.mainConfig = this.componentService.getComponentConfig(UIComponent.SplitComponent);
      this.isLoading = false;
    } catch (error) {
      console.error('Error testing split component:', error);
      this.isLoading = false;
    }
  }

  // Test all UI Component combinations with proper UI behavior
  async testUIComponent(uiComponent: UIComponent, dataDisplay: DataDisplay) {
    this.isLoading = true;
    
    // Reset UI state first
    this.resetUIState();
    
    try {
      const context = await this.componentService.renderComponent(
        uiComponent,
        dataDisplay,
        categoryLocatorData,
        sortedData
      );
      const config = this.componentService.getComponentConfig(uiComponent);

      // Handle UI Component behavior correctly
      switch (uiComponent) {
        case UIComponent.Popup:
          // Popup should open in modal
          this.modalContext = context;
          this.modalConfig = config;
          this.modalTitle = config.headerTitle || 'Popup Component';
          this.modalWidth = '800px';
          this.showModal = true;
          break;

        case UIComponent.RightPanel:
          // RightPanel should display in sidebar
          this.rightPanelContext = context;
          this.rightPanelConfig = config;
          this.showRightPanel = true;
          break;

        case UIComponent.SplitComponent:
          // SplitComponent: Two windows with same data (split view)
          this.showSplitView = true;
          
          // Left split - first half of data
          this.leftSplitContext = {
            ...context,
            sortedByAsc: context.sortedByAsc || []
          };
          this.leftSplitConfig = { ...config, headerTitle: 'Split View - Left' };
          
          // Right split - same data (as requested)
          this.rightSplitContext = {
            ...context,
            sortedByAsc: context.sortedByAsc || []
          };
          this.rightSplitConfig = { ...config, headerTitle: 'Split View - Right' };
          break;

        case UIComponent.MergeComponent:
          // MergeComponent: Changes from one window apply to another
          this.showMergeView = true;
          
          // Primary merge window
          this.primaryMergeContext = {
            ...context,
            sortedByAsc: context.sortedByAsc || []
          };
          this.primaryMergeConfig = { ...config, headerTitle: 'Primary View (Source)' };
          
          // Secondary merge window - will sync changes from primary
          this.secondaryMergeContext = {
            ...context,
            sortedByAsc: context.sortedByAsc || []
          };
          this.secondaryMergeConfig = { ...config, headerTitle: 'Secondary View (Target)' };
          break;

        case UIComponent.Premeditated:
        case UIComponent.Component:
        case UIComponent.NewComponent:
        case UIComponent.Wizard:
        case UIComponent.NewWizard:
        default:
          // These display in main content area
          this.mainContext = context;
          this.mainConfig = config;
          break;
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Error testing UI component:', error);
      this.isLoading = false;
    }
  }

  // Helper methods to get enum values for template
  getUIComponents() {
    return [
      { value: UIComponent.Premeditated, name: 'Premeditated' },
      { value: UIComponent.RightPanel, name: 'RightPanel' },
      { value: UIComponent.Component, name: 'Component' },
      { value: UIComponent.NewComponent, name: 'NewComponent' },
      { value: UIComponent.MergeComponent, name: 'MergeComponent' },
      { value: UIComponent.SplitComponent, name: 'SplitComponent' },
      { value: UIComponent.Wizard, name: 'Wizard' },
      { value: UIComponent.NewWizard, name: 'NewWizard' },
      { value: UIComponent.Popup, name: 'Popup' }
    ];
  }

  getDataDisplays() {
    return [
      { value: DataDisplay.PanelView, name: 'PanelView' },
      { value: DataDisplay.MultiView, name: 'MultiView' },
      { value: DataDisplay.ListView, name: 'ListView' },
      { value: DataDisplay.GridView, name: 'GridView' },
      { value: DataDisplay.HtmlBlock, name: 'HtmlBlock' },
      { value: DataDisplay.Template, name: 'Template' },
      { value: DataDisplay.PreComponent, name: 'PreComponent' },
      { value: DataDisplay.WebComponent, name: 'WebComponent' },
      { value: DataDisplay.Model, name: 'Model' },
      { value: DataDisplay.ModelField, name: 'ModelField' }
    ];
  }

  // Expose enums to template
  UIComponent = UIComponent;
  DataDisplay = DataDisplay;
}

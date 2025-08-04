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

  constructor(
    private componentService: ComponentBehaviorService,
  ) { }

  ngOnInit() {
    this.loadDashboardComponents();
  }

  // Replace your original checkComponentBehavior calls with these methods:

  loadGridData() {
    this.isLoading = true;

    // Simulate data loading
    setTimeout(() => {
      this.mainContext = this.componentService.renderComponent(
        categoryLocatorData.uiComponent,
        categoryLocatorData.dataDisplay,
        categoryLocatorData,
        sortedData
      );

      this.mainConfig = this.componentService.getComponentConfig(UIComponent.NewComponent);
      this.isLoading = false;
    }, 1000);
  }

  loadRightPanelData() {
    this.rightPanelContext = this.componentService.renderComponent(
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
  }

  openFormModal() {
    this.modalContext = this.componentService.renderComponent(
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
  }

  private loadDashboardComponents() {
    // Load default dashboard view
    this.loadGridData();
  }

  closeModal() {
    this.showModal = false;
  }
}

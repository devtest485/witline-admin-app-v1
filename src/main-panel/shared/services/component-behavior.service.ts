import { Injectable, ViewContainerRef } from '@angular/core';
import { UIComponent } from '../enums/uicomponent';
import { DataDisplay } from '../enums/data-display';
import { ComponentConfig, ComponentContext } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComponentBehaviorService {
  /**
    * Simplified method that replaces your original checkComponentBehavior
    */
  renderComponent(
    uiComponent: UIComponent,
    dataDisplay: DataDisplay,
    categoryLocator: any,
    sortedByAsc: any[],
    viewContainer?: ViewContainerRef
  ): ComponentContext {

    const context: ComponentContext = {
      uiComponent,
      dataDisplay,
      categoryLocator,
      sortedByAsc,
      viewContainer
    };

    return context;
  }

  /**
   * Get configuration based on UI Component type
   */
  getComponentConfig(uiComponent: UIComponent): ComponentConfig {
    switch (uiComponent) {
      case UIComponent.Popup:
        return {
          showInModal: true,
          headerTitle: 'Popup Component',
          containerClass: 'tw-max-w-4xl'
        };

      case UIComponent.RightPanel:
        return {
          showInRightPanel: true,
          containerClass: 'tw-w-80 tw-h-full'
        };

      case UIComponent.Component:
      case UIComponent.NewComponent:
        return {
          containerClass: 'tw-w-full tw-h-full'
        };

      default:
        return {};
    }
  }
}

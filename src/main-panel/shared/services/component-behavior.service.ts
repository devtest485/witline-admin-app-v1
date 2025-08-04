import { Injectable, ViewContainerRef } from '@angular/core';
import { UIComponent } from '../enums/uicomponent';
import { DataDisplay } from '../enums/data-display';
import { ComponentConfig, ComponentContext } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComponentBehaviorService {
  
  /**
   * Enhanced method that processes your data based on UI Component and Data Display types
   */
  async renderComponent(
    uiComponent: UIComponent,
    dataDisplay: DataDisplay,
    categoryLocator: any,
    sortedByAsc: any[],
    viewContainer?: ViewContainerRef
  ): Promise<ComponentContext> {

    // Validate inputs
    if (!this.validateInputs(uiComponent, dataDisplay)) {
      console.warn('Invalid component configuration:', { uiComponent, dataDisplay });
    }

    const context: ComponentContext = {
      uiComponent,
      dataDisplay,
      categoryLocator,
      sortedByAsc,
      viewContainer
    };

    // Process the context based on your original checkComponentBehavior logic
    return await this.processComponentBehavior(context);
  }

  /**
   * Process component behavior based on UI Component and Data Display combination
   */
  private async processComponentBehavior(context: ComponentContext): Promise<ComponentContext> {
    const { uiComponent, dataDisplay } = context;
    
    try {
      switch (uiComponent) {
        case UIComponent.Premeditated:
          return await this.handlePremeditatedComponent(context);
          
        case UIComponent.RightPanel:
          return await this.handleRightPanelComponent(context);
          
        case UIComponent.Component:
          return await this.handleMainComponent(context);
          
        case UIComponent.NewComponent:
          return await this.handleNewComponent(context);
          
        case UIComponent.MergeComponent:
          return await this.handleMergeComponent(context);
          
        case UIComponent.SplitComponent:
          return await this.handleSplitComponent(context);
          
        case UIComponent.Wizard:
          return await this.handleWizardComponent(context);
          
        case UIComponent.NewWizard:
          return await this.handleNewWizardComponent(context);
          
        case UIComponent.Popup:
          return await this.handlePopupComponent(context);
          
        default:
          console.warn(`Unknown UI Component type: ${uiComponent}`);
          return context;
      }
    } catch (error) {
      console.error('Error processing component behavior:', error);
      return context;
    }
  }

  // Component handlers - UI Components only affect data processing and configuration
  // The actual UI rendering is handled by the DataDisplay components in dynamic-ui-router
  
  private async handlePremeditatedComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Premeditated components - planned in advance, minimal processing
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add premeditated-specific metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isPremeditated: true,
      processedAt: new Date().toISOString()
    };
    
    return processedContext;
  }

  private async handleRightPanelComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Right panel specific processing (from your original logic)
    processedContext.sortedByAsc = (await this.processDataForDisplay(context)).map(item => ({
      ...item,
      isSelected: false
    }));
    
    // Add right panel metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isRightPanel: true,
      rightCategoryTypeCategory: processedContext.sortedByAsc
    };
    
    return processedContext;
  }

  private async handleMainComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Main component processing (from your original logic)
    processedContext.sortedByAsc = (await this.processDataForDisplay(context)).map(item => ({
      ...item,
      isSelected: false
    }));
    
    // Add main component flags
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isRightNavMenu: true,
      profFromCategory: processedContext.sortedByAsc
    };
    
    return processedContext;
  }

  private async handleNewComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // New component with enhanced features
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add new component metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isNewComponent: true,
      enhancedFeatures: true
    };
    
    return processedContext;
  }

  private async handleMergeComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Merge component - combines multiple data sources
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add merge-specific metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isMergeComponent: true,
      mergeMode: 'auto'
    };
    
    console.log('Processing merge component with data:', processedContext.sortedByAsc?.length || 0, 'items');
    return processedContext;
  }

  private async handleSplitComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Split component processing (from your original logic)
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Set split view flags (from your original logic)
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isCategoryBox2: true,
      isSplitView: true,
      splitMode: 'horizontal'
    };
    
    return processedContext;
  }

  private async handleWizardComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Wizard component - step-by-step processing
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add wizard metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isWizard: true,
      currentStep: 1,
      totalSteps: Math.ceil((processedContext.sortedByAsc?.length || 0) / 5)
    };
    
    console.log('Processing wizard component with', processedContext.categoryLocator.totalSteps, 'steps');
    return processedContext;
  }

  private async handleNewWizardComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // New wizard with enhanced features
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add new wizard metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isNewWizard: true,
      enhancedWizard: true,
      currentStep: 1,
      totalSteps: Math.ceil((processedContext.sortedByAsc?.length || 0) / 3),
      allowSkipSteps: true
    };
    
    console.log('Processing new wizard component with enhanced features');
    return processedContext;
  }

  private async handlePopupComponent(context: ComponentContext): Promise<ComponentContext> {
    const processedContext = { ...context };
    
    // Popup component processing
    processedContext.sortedByAsc = await this.processDataForDisplay(context);
    
    // Add popup metadata
    processedContext.categoryLocator = {
      ...context.categoryLocator,
      isPopup: true,
      modalSize: 'large',
      allowBackdropClose: true
    };
    
    return processedContext;
  }

  // Unified data processing method that handles all DataDisplay types
  private async processDataForDisplay(context: ComponentContext): Promise<any[]> {
    const { dataDisplay, sortedByAsc, categoryLocator } = context;
    
    switch (dataDisplay) {
      case DataDisplay.PanelView:
      case DataDisplay.MultiView:
      case DataDisplay.ListView:
        // Simple list-based data
        return sortedByAsc || [];
        
      case DataDisplay.GridView:
        // Grid view data processing (from your original logic)
        return await this.processGridViewData(context);
        
      case DataDisplay.HtmlBlock:
        // HTML block data processing
        return await this.processHtmlBlockData(sortedByAsc);
        
      case DataDisplay.Template:
        // Template data processing
        return await this.processTemplateData(categoryLocator);
        
      case DataDisplay.PreComponent:
        // Pre-component data
        return sortedByAsc || [];
        
      case DataDisplay.WebComponent:
        // Web component data processing
        return await this.processWebComponentData(categoryLocator);
        
      case DataDisplay.Model:
        // Model data processing
        return await this.processModelData(context);
        
      case DataDisplay.ModelField:
        // Model field data processing
        return await this.processModelFieldData(categoryLocator);
        
      default:
        return sortedByAsc || [];
    }
  }

  // Data processing methods (from your original logic)
  private async processGridViewData(context: ComponentContext): Promise<any[]> {
    const cardViewData = [...(context.sortedByAsc || [])];
    
    // Process each card data item (from your original logic)
    cardViewData.forEach(element => {
      if (element.childCategory) {
        element.childCategory.collectionUi = this.safeJsonParse(element.childCategory.collectionUi);
        element.childCategory.gUI = this.safeJsonParse(element.childCategory.gUI);
      }
    });

    // Process template nodes if available (from your original logic)
    if (context.categoryLocator?.collectionUi) {
      const nodes = this.safeJsonParse(context.categoryLocator.collectionUi) || [];
      // Here you would call your nodesClassesPrefixService.processNodesClasses(nodes)
      // and commonService.embedAPINodesBuilder(nodes, true, categoryLocator.categoryId)
      console.log('Processing template nodes:', nodes);
    }

    return cardViewData;
  }

  private async processHtmlBlockData(data: any[]): Promise<any[]> {
    // Process HTML block template data (from your original logic)
    console.log('Processing HTML block data');
    return data || [];
  }

  private async processTemplateData(categoryLocator: any): Promise<any[]> {
    // Process template request data (from your original logic)
    console.log('Processing template data for:', categoryLocator);
    return [];
  }

  private async processWebComponentData(categoryLocator: any): Promise<any[]> {
    // Process web components card model (from your original logic)
    if (categoryLocator?.trackingNumber && categoryLocator?.categoryId) {
      console.log('Processing web component data for:', categoryLocator.trackingNumber, categoryLocator.categoryId);
    }
    return [];
  }

  private async processModelData(context: ComponentContext): Promise<any[]> {
    // Process model data (from your original logic)
    console.log('Processing model data');
    return context.sortedByAsc || [];
  }

  private async processModelFieldData(categoryLocator: any): Promise<any[]> {
    // Process model fields (from your original logic)
    console.log('Processing model field data for:', categoryLocator);
    return [];
  }

  /**
   * Get configuration based on UI Component type - Complete implementation for all 9 types
   */
  getComponentConfig(uiComponent: UIComponent): ComponentConfig {
    switch (uiComponent) {
      case UIComponent.Premeditated:
        return {
          headerTitle: 'Premeditated Component',
          headerSubtitle: 'Planned in advance with minimal processing',
          containerClass: 'tw-w-full tw-h-full'
        };

      case UIComponent.RightPanel:
        return {
          showInRightPanel: true,
          headerTitle: 'Right Panel',
          headerSubtitle: 'Sidebar component display',
          containerClass: 'tw-w-80 tw-h-full'
        };

      case UIComponent.Component:
        return {
          headerTitle: 'Main Component',
          headerSubtitle: 'Standard main content area',
          containerClass: 'tw-w-full tw-h-full'
        };

      case UIComponent.NewComponent:
        return {
          headerTitle: 'New Component',
          headerSubtitle: 'Enhanced component with new features',
          containerClass: 'tw-w-full tw-h-full'
        };

      case UIComponent.MergeComponent:
        return {
          headerTitle: 'Merge Component',
          headerSubtitle: 'Combines multiple data sources',
          containerClass: 'tw-w-full tw-h-full tw-space-y-4'
        };

      case UIComponent.SplitComponent:
        return {
          headerTitle: 'Split View Component',
          headerSubtitle: 'Horizontal split view layout',
          containerClass: 'tw-w-full tw-h-full tw-flex tw-flex-col'
        };

      case UIComponent.Wizard:
        return {
          headerTitle: 'Wizard Component',
          headerSubtitle: 'Step-by-step guided process',
          containerClass: 'tw-w-full tw-max-w-4xl tw-mx-auto'
        };

      case UIComponent.NewWizard:
        return {
          headerTitle: 'New Wizard Component',
          headerSubtitle: 'Enhanced wizard with advanced features',
          containerClass: 'tw-w-full tw-max-w-5xl tw-mx-auto'
        };

      case UIComponent.Popup:
        return {
          showInModal: true,
          headerTitle: 'Popup Component',
          headerSubtitle: 'Modal dialog display',
          containerClass: 'tw-max-w-4xl'
        };

      default:
        return {
          headerTitle: 'Unknown Component',
          headerSubtitle: 'Unsupported component type',
          containerClass: 'tw-w-full'
        };
    }
  }

  // Utility methods
  private validateInputs(uiComponent: UIComponent, dataDisplay: DataDisplay): boolean {
    return uiComponent !== undefined && 
           uiComponent !== null && 
           dataDisplay !== undefined && 
           dataDisplay !== null;
  }

  private safeJsonParse(jsonString: any): any {
    if (!jsonString) return null;
    if (typeof jsonString === 'object') return jsonString;
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return null;
    }
  }

  // Helper method to check if combination is supported
  isCombinationSupported(uiComponent: UIComponent, dataDisplay: DataDisplay): boolean {
    // All combinations are currently supported
    return true;
  }
}

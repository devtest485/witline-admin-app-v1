import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMarks, NzSliderModule } from 'ng-zorro-antd/slider';

interface ComponentStyle {
  width?: string;
  padding?: string;
  borderRadius?: number;
  [key: string]: string | number | undefined;
}

interface ComponentProperties {
  [key: string]: string | number | boolean;
}

interface SelectedComponent {
  properties: ComponentProperties;
  style: ComponentStyle;
  name: string;
}

@Component({
  selector: 'app-pre-component',
  imports: [
    CommonModule, FormsModule, NzCardModule, NzButtonModule, NzIconModule, NzTagModule,
    NzSpinModule, NzModalModule, NzFormModule, NzInputModule, NzSelectModule,
    NzToolTipModule, NzPopoverModule, NzCodeEditorModule, NzTabsModule,
    NzTreeModule, CdkDrag, CdkDropList, NzProgressModule, NzDividerModule, NzSliderModule
  ],
  templateUrl: './pre-component.component.html',
  styleUrl: './pre-component.component.scss'
})
export class PreComponentComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  preComponent: any[] = [];
  isLoading = false;
  isDesignMode = false;
  previewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  // Design Mode Properties
  basicComponents: any[] = [];
  layoutComponents: any[] = [];
  customComponents: any[] = [];
  canvasComponents: any[] = [];
  selectedComponentIndex = -1;
  selectedComponent: SelectedComponent | null = null;

  // Editor Properties
  showComponentEditor = false;
  editingComponent: any = null;
  editingComponentCode = '';

  // Canvas Properties
  gridPattern = '';
  undoStack: any[] = [];
  redoStack: any[] = [];

  marks: NzMarks = { 0: '0px', 5: '5px', 10: '10px', 20: '20px' };

  constructor() {
    this.setupGridPattern();
    this.initializeComponentLibrary();
  }

  ngOnInit() {
    this.initializePreComponents();
  }

  private initializePreComponents() {
    this.isLoading = true;

    // Process incoming data
    this.preComponent = (this.context.sortedByAsc || []).map(item => ({
      ...item,
      status: item.status || 'draft',
      lastModified: item.lastModified || new Date(),
      isFavorite: item.isFavorite || false,
      metrics: item.metrics || this.generateComponentMetrics(),
      code: item.code || this.generateDefaultCode(item)
    }));

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private initializeComponentLibrary() {
    this.basicComponents = [
      {
        id: 'button',
        name: 'Button',
        icon: 'plus-square',
        description: 'Interactive button component',
        template: '<button style="padding: 8px 16px; background: var(--theme-primary); color: white; border: none; border-radius: 4px; cursor: pointer;">{{text}}</button>',
        properties: { text: 'Click Me', disabled: false },
        style: { width: 'auto', padding: '8px', borderRadius: 4 }
      },
      {
        id: 'input',
        name: 'Input Field',
        icon: 'edit',
        description: 'Text input component',
        template: '<input type="text" placeholder="{{placeholder}}" style="padding: 8px 12px; border: 1px solid var(--border-primary); border-radius: 4px; width: {{width}};">',
        properties: { placeholder: 'Enter text...', width: '100%' },
        style: { width: '100%', padding: '8px', borderRadius: 4 }
      },
      {
        id: 'text',
        name: 'Text Block',
        icon: 'file-text',
        description: 'Text content block',
        template: '<div style="color: var(--text-primary); font-size: {{fontSize}}; font-weight: {{fontWeight}};">{{content}}</div>',
        properties: { content: 'Sample text content', fontSize: '14px', fontWeight: 'normal' },
        style: { width: '100%', padding: '0px', borderRadius: 0 }
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'picture',
        description: 'Image display component',
        template: '<img src="{{src}}" alt="{{alt}}" style="max-width: {{width}}; height: auto; border-radius: {{borderRadius}}px;">',
        properties: { src: 'https://via.placeholder.com/300x200', alt: 'Sample image', width: '100%' },
        style: { width: '100%', padding: '0px', borderRadius: 4 }
      }
    ];

    this.layoutComponents = [
      {
        id: 'container',
        name: 'Container',
        icon: 'border',
        description: 'Layout container',
        template: '<div style="padding: {{padding}}; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: {{borderRadius}}px;">{{content}}</div>',
        properties: { content: 'Container content', padding: '16px' },
        style: { width: '100%', padding: '16px', borderRadius: 8 }
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        icon: 'appstore',
        description: 'CSS Grid layout',
        template: '<div style="display: grid; grid-template-columns: repeat({{columns}}, 1fr); gap: {{gap}};">{{content}}</div>',
        properties: { columns: 2, gap: '16px', content: 'Grid items...' },
        style: { width: '100%', padding: '0px', borderRadius: 0 }
      },
      {
        id: 'flex',
        name: 'Flex Layout',
        icon: 'menu',
        description: 'Flexbox layout',
        template: '<div style="display: flex; flex-direction: {{direction}}; gap: {{gap}}; align-items: {{align}};">{{content}}</div>',
        properties: { direction: 'row', gap: '16px', align: 'center', content: 'Flex items...' },
        style: { width: '100%', padding: '0px', borderRadius: 0 }
      }
    ];

    this.customComponents = [
      {
        id: 'card',
        name: 'Custom Card',
        icon: 'credit-card',
        description: 'Themed card component',
        template: `
          <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 16px; box-shadow: var(--shadow-sm);">
            <h3 style="color: var(--text-primary); margin: 0 0 8px 0;">{{title}}</h3>
            <p style="color: var(--text-secondary); margin: 0;">{{content}}</p>
          </div>
        `,
        properties: { title: 'Card Title', content: 'Card content goes here...' },
        style: { width: '100%', padding: '16px', borderRadius: 8 }
      }
    ];
  }

  private setupGridPattern() {
    // Create SVG grid pattern for canvas background
    const gridSvg = `
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" fill="transparent"/>
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      </svg>
    `;
    this.gridPattern = btoa(gridSvg);
  }

  // Design Mode Methods
  toggleDesignMode() {
    this.isDesignMode = !this.isDesignMode;
    if (this.isDesignMode && this.canvasComponents.length === 0) {
      this.loadSampleCanvas();
    }
  }

  private loadSampleCanvas() {
    this.canvasComponents = [
      { ...this.basicComponents[0], id: Date.now() + '_1' },
      { ...this.basicComponents[1], id: Date.now() + '_2' }
    ];
  }

  onDragStart(component: any) {
    console.log('Drag started for component:', component);
  }

  onComponentDrop(event: any) {
    const draggedComponent = event.item.data;
    const newComponent = {
      ...draggedComponent,
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };

    this.canvasComponents.push(newComponent);
    this.saveCanvasState();
  }

  selectComponent(index: number) {
    this.selectedComponentIndex = index;
    this.selectedComponent = this.canvasComponents[index];
  }

  renderComponent(component: any): string {
    let template = component.template;

    // Replace property placeholders
    if (component.properties) {
      Object.entries(component.properties).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, String(value));
      });
    }

    // Apply component styles
    if (component.style) {
      const styleString = Object.entries(component.style)
        .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
        .join('; ');

      // Wrap in styled container
      template = `<div style="${styleString}">${template}</div>`;
    }

    return template;
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  getPropertyType(value: any): string {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
  }

  updateCanvas() {
    // Force re-render of canvas
    this.canvasComponents = [...this.canvasComponents];
  }

  editComponent(component: any, index: number) {
    this.editingComponent = { ...component };
    this.editingComponentCode = this.generateComponentCode(component);
    this.showComponentEditor = true;
  }

  duplicateComponent(component: any, index: number) {
    const duplicate = {
      ...component,
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: component.name + ' (Copy)'
    };
    this.canvasComponents.splice(index + 1, 0, duplicate);
    this.saveCanvasState();
  }

  removeComponent(index: number) {
    this.canvasComponents.splice(index, 1);
    if (this.selectedComponentIndex === index) {
      this.selectedComponentIndex = -1;
      this.selectedComponent = null;
    }
    this.saveCanvasState();
  }

  clearCanvas() {
    this.canvasComponents = [];
    this.selectedComponentIndex = -1;
    this.selectedComponent = null;
    this.saveCanvasState();
  }

  // Undo/Redo System
  private saveCanvasState() {
    this.undoStack.push(JSON.stringify(this.canvasComponents));
    this.redoStack = []; // Clear redo stack when new action is performed

    // Limit undo stack size
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  undoLastAction() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      if (currentState) {
        this.redoStack.push(currentState);
      }

      const previousState = this.undoStack[this.undoStack.length - 1];
      this.canvasComponents = JSON.parse(previousState);
    }
  }

  redoLastAction() {
    if (this.redoStack.length > 0) {
      const redoState = this.redoStack.pop();
      if (redoState) {
        this.undoStack.push(redoState);
        this.canvasComponents = JSON.parse(redoState);
      }
    }
  }

  // Preview Mode Methods
  updatePreview() {
    // Update preview based on mode
    console.log('Preview mode updated to:', this.previewMode);
  }

  refreshPreview() {
    this.initializePreComponents();
  }

  fullscreenPreview() {
    // Implement fullscreen preview
    console.log('Opening fullscreen preview');
  }

  getPreviewGridClass(): string {
    switch (this.previewMode) {
      case 'mobile':
        return 'tw-grid-cols-1';
      case 'tablet':
        return 'tw-grid-cols-1 md:tw-grid-cols-2';
      case 'desktop':
      default:
        return 'tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3';
    }
  }

  renderComponentPreview(component: any): string {
    // Generate a preview version of the component
    return `
      <div style="background: var(--bg-secondary); padding: 12px; border-radius: 4px; border: 1px solid var(--border-primary);">
        <div style="color: var(--text-primary); font-weight: 500; margin-bottom: 8px;">${component.name}</div>
        <div style="color: var(--text-secondary); font-size: 12px;">
          ${component.description || 'Component preview'}
        </div>
      </div>
    `;
  }

  getComponentStatusColor(component: any): string {
    const statusColors: Record<string, string> = {
      draft: 'default',
      review: 'warning',
      approved: 'success',
      deployed: 'processing',
      deprecated: 'error'
    };
    return statusColors[component.status] || 'default';
  }

  // Component Actions
  deployComponent(component: any, index: number) {
    console.log('Deploying component:', component);
    component.status = 'deployed';
    component.lastModified = new Date();
  }

  editComponentCode(component: any, index: number) {
    this.editComponent(component, index);
  }

  testComponent(component: any, index: number) {
    console.log('Testing component:', component);
    // Implement component testing
  }

  favoriteComponent(component: any, index: number) {
    component.isFavorite = !component.isFavorite;
  }

  shareComponent(component: any, index: number) {
    console.log('Sharing component:', component);
    // Implement component sharing
  }

  cloneComponent(component: any, index: number) {
    const clone = {
      ...component,
      name: component.name + ' (Clone)',
      status: 'draft',
      lastModified: new Date()
    };
    this.preComponent.push(clone);
  }

  // Editor Methods
  closeComponentEditor() {
    this.showComponentEditor = false;
    this.editingComponent = null;
    this.editingComponentCode = '';
  }

  saveComponent() {
    if (this.editingComponent) {
      // Save component changes
      const index = this.canvasComponents.findIndex(c => c.id === this.editingComponent.id);
      if (index >= 0) {
        this.canvasComponents[index] = { ...this.editingComponent };
        this.updateCanvas();
      }
    }
    this.closeComponentEditor();
  }

  // Utility Methods
  private generateComponentMetrics(): any[] {
    return [
      { label: 'Uses', value: Math.floor(Math.random() * 100) },
      { label: 'Tests', value: Math.floor(Math.random() * 50) },
      { label: 'Score', value: Math.floor(Math.random() * 10) }
    ];
  }

  private generateDefaultCode(component: any): string {
    return `
      // Component: ${component.name}
      export class ${component.name}Component {
        constructor() {
          this.data = ${JSON.stringify(component, null, 2)};
        }
        
        render() {
          return '<div>Component implementation</div>';
        }
      }
    `;
  }

  private generateComponentCode(component: any): string {
    return `
      // Generated code for: ${component.name}
      const ${component.name.replace(/\s+/g, '')}Component = {
        template: \`${component.template}\`,
        properties: ${JSON.stringify(component.properties, null, 2)},
        style: ${JSON.stringify(component.style, null, 2)}
      };
    `;
  }

  // Global Actions
  createNewComponent() {
    this.toggleDesignMode();
  }

  exportComponents() {
    const exportData = {
      preComponents: this.preComponent,
      canvasComponents: this.canvasComponents,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-components-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  refreshLibrary() {
    this.initializeComponentLibrary();
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
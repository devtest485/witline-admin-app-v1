import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { WebComponentService } from '../../../services/web-component.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { ThemeService } from '../../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-web-component',
  imports: [
    CommonModule, FormsModule, NzCardModule, NzButtonModule, NzIconModule, NzSpinModule,
    NzTabsModule, NzTableModule, NzTagModule, NzModalModule, NzFormModule,
    NzInputModule, NzSelectModule, NzUploadModule, NzProgressModule, NzEmptyModule,
    NzToolTipModule, NzPopoverModule, NzDividerModule, NzCodeEditorModule, NzRateModule,
    NzStatisticModule
  ],
  templateUrl: './web-component.component.html',
  styleUrl: './web-component.component.scss'
})
export class WebComponentComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  webComponents: any[] = [];
  filteredStoreComponents: any[] = [];
  storeComponents: any[] = [];
  isLoading = false;

  // Search and Filter
  storeSearchTerm = '';
  storeCategory = 'all';

  // Component Builder
  newComponent = {
    name: '',
    type: 'element',
    description: '',
    code: ''
  };

  // Preview
  showPreviewModal = false;
  previewingComponent: any = null;

  public themeService = inject(ThemeService);

  ngOnInit() {
    this.initializeWebComponents();
    this.initializeStore();
  }

  private initializeWebComponents() {
    this.isLoading = true;

    // Load from context or use sample data
    this.webComponents = (this.context.sortedByAsc || []).map(item => ({
      ...item,
      type: item.type || 'element',
      status: item.status || 'active',
      version: item.version || '1.0.0',
      usageCount: item.usageCount || Math.floor(Math.random() * 100),
      lastUsed: item.lastUsed || new Date(),
      performance: item.performance || Math.floor(Math.random() * 30) + 70,
      properties: item.properties || this.generateSampleProperties()
    }));

    if (this.webComponents.length === 0) {
      this.webComponents = this.generateSampleComponents();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private initializeStore() {
    this.storeComponents = [
      {
        name: 'awesome-button',
        category: 'ui',
        description: 'A beautiful, themeable button component',
        author: 'UI Team',
        rating: 4.8,
        downloads: 1205,
        size: '12KB'
      },
      {
        name: 'data-grid',
        category: 'data',
        description: 'Advanced data grid with sorting and filtering',
        author: 'Data Team',
        rating: 4.6,
        downloads: 856,
        size: '45KB'
      },
      {
        name: 'smart-form',
        category: 'forms',
        description: 'Intelligent form with validation',
        author: 'Form Team',
        rating: 4.9,
        downloads: 2341,
        size: '28KB'
      }
    ];

    this.filteredStoreComponents = [...this.storeComponents];
  }

  private generateSampleComponents(): any[] {
    return [
      {
        name: 'custom-button',
        type: 'element',
        status: 'active',
        version: '2.1.0',
        description: 'Customizable button with theme support',
        usageCount: 45,
        lastUsed: new Date(),
        performance: 92,
        properties: [
          { name: 'text', type: 'string' },
          { name: 'variant', type: 'string' },
          { name: 'disabled', type: 'boolean' }
        ]
      },
      {
        name: 'data-card',
        type: 'widget',
        status: 'active',
        version: '1.5.2',
        description: 'Responsive data display card',
        usageCount: 78,
        lastUsed: new Date(),
        performance: 88,
        properties: [
          { name: 'title', type: 'string' },
          { name: 'content', type: 'string' },
          { name: 'actions', type: 'array' }
        ]
      }
    ];
  }

  private generateSampleProperties(): any[] {
    return [
      { name: 'title', type: 'string' },
      { name: 'visible', type: 'boolean' },
      { name: 'data', type: 'object' }
    ];
  }

  // Component Management
  loadComponent(component: any) {
    console.log('Loading component:', component);
    component.usageCount = (component.usageCount || 0) + 1;
    component.lastUsed = new Date();
  }

  previewComponent(component: any) {
    this.previewingComponent = component;
    this.showPreviewModal = true;
  }

  editComponent(component: any) {
    console.log('Editing component:', component);
  }

  downloadComponent(component: any) {
    const exportData = {
      name: component.name,
      type: component.type,
      version: component.version,
      description: component.description,
      properties: component.properties,
      code: component.code || '// Component code here'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name}.component.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  shareComponent(component: any) {
    console.log('Sharing component:', component);
    // Implement sharing functionality
  }

  unregisterComponent(component: any) {
    const index = this.webComponents.indexOf(component);
    if (index > -1) {
      this.webComponents.splice(index, 1);
    }
  }

  // Store Management
  searchStore() {
    this.filterStore();
  }

  filterStore() {
    this.filteredStoreComponents = this.storeComponents.filter(component => {
      const matchesSearch = !this.storeSearchTerm ||
        component.name.toLowerCase().includes(this.storeSearchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(this.storeSearchTerm.toLowerCase());

      const matchesCategory = this.storeCategory === 'all' ||
        component.category === this.storeCategory;

      return matchesSearch && matchesCategory;
    });
  }

  installComponent(storeComponent: any) {
    const newComponent = {
      ...storeComponent,
      status: 'installed',
      usageCount: 0,
      lastUsed: new Date(),
      performance: 85,
      properties: this.generateSampleProperties()
    };

    this.webComponents.push(newComponent);
    console.log('Installed component:', newComponent);
  }

  previewStoreComponent(component: any) {
    this.previewingComponent = component;
    this.showPreviewModal = true;
  }

  // Component Builder
  registerNewComponent() {
    this.newComponent = {
      name: '',
      type: 'element',
      description: '',
      code: this.getDefaultComponentTemplate()
    };
  }

  loadTemplate() {
    this.newComponent.code = this.getDefaultComponentTemplate();
  }

  validateComponent() {
    console.log('Validating component:', this.newComponent);
    // Implement validation logic
  }

  previewNewComponent() {
    this.previewingComponent = { ...this.newComponent };
    this.showPreviewModal = true;
  }

  registerComponent() {
    if (this.newComponent.name && this.newComponent.code) {
      const component = {
        ...this.newComponent,
        version: '1.0.0',
        status: 'active',
        usageCount: 0,
        lastUsed: new Date(),
        performance: 85,
        properties: this.generateSampleProperties()
      };

      this.webComponents.push(component);
      this.newComponent = { name: '', type: 'element', description: '', code: '' };
      console.log('Registered new component:', component);
    }
  }

  private getDefaultComponentTemplate(): string {
    return `
class MyCustomElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: block;
          padding: 16px;
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--border-primary, #d9d9d9);
          border-radius: 8px;
        }
        
        .content {
          color: var(--text-primary, #000000);
        }
      </style>
      
      <div class="content">
        <h3>Custom Web Component</h3>
        <p>This is a sample web component with theme support.</p>
      </div>
    \`;
  }
}

customElements.define('my-custom-element', MyCustomElement);
    `.trim();
  }

  // Utility Methods
  getComponentTypeColor(type: string): string {
    const colors: Record<string, string> = {
      element: 'blue',
      widget: 'green',
      layout: 'purple',
      form: 'orange'
    };
    return colors[type] || 'default';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      deprecated: 'error',
      installed: 'processing'
    };
    return colors[status] || 'default';
  }

  getPerformanceColor(performance: number): string {
    if (performance >= 90) return '#52c41a';
    if (performance >= 70) return '#faad14';
    return '#ff4d4f';
  }

  // Analytics Methods
  getActiveComponentCount(): number {
    return this.webComponents.filter(c => c.status === 'active').length;
  }

  getTotalDownloads(): number {
    return this.webComponents.reduce((total, c) => total + (c.usageCount || 0), 0);
  }

  getAverageRating(): number {
    const components = this.webComponents.filter(c => c.rating);
    if (components.length === 0) return 0;
    return components.reduce((sum, c) => sum + c.rating, 0) / components.length;
  }

  // Global Actions
  importComponents() {
    console.log('Importing components from file');
    // Implement file import functionality
  }

  refreshComponents() {
    this.initializeWebComponents();
  }

  closePreview() {
    this.showPreviewModal = false;
    this.previewingComponent = null;
  }
}
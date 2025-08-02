import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-template-view',
  imports: [
    CommonModule, FormsModule, NzSelectModule, NzButtonModule, NzIconModule, NzSpinModule,
    NzTabsModule, NzCardModule, NzModalModule, NzFormModule, NzInputModule,
    NzCodeEditorModule, NzToolTipModule, NzTagModule, NzDividerModule
  ],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss'
})
export class TemplateViewComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  availableTemplates: any[] = [];
  selectedTemplate = '';
  currentTemplate: any = null;
  templateSource = '';
  renderedTemplate = '';
  isLoading = false;
  responsivePreview = false;

  templateVariables: any[] = [];
  dataSchema: any[] = [];
  sampleDataSets: any[] = [];

  templateSettings = {
    name: '',
    category: 'custom',
    description: '',
    enableCache: true,
    enableSafeMode: true,
    enableDebugMode: false,
    enableAutoRefresh: true,
    useThemeVariables: true,
    adaptToTheme: true,
    includeThemeClasses: true
  };

  showCreateModal = false;
  newTemplate = {
    name: '',
    type: 'html',
    description: ''
  };

  ngOnInit() {
    this.initializeTemplates();
    this.setupSampleData();
    this.setupDataSchema();
  }

  private initializeTemplates() {
    this.isLoading = true;

    // Load templates from service or use defaults
    this.availableTemplates = [
      {
        id: 'default-card',
        name: 'Default Card',
        category: 'system',
        status: 'active',
        version: '1.0.0',
        description: 'Basic card template with theme support',
        createdAt: new Date(),
        modifiedAt: new Date(),
        usageCount: 25,
        source: this.getDefaultCardTemplate()
      },
      {
        id: 'dashboard-widget',
        name: 'Dashboard Widget',
        category: 'system',
        status: 'active',
        version: '1.2.0',
        description: 'Statistical widget for dashboards',
        createdAt: new Date(),
        modifiedAt: new Date(),
        usageCount: 15,
        source: this.getDashboardWidgetTemplate()
      },
      {
        id: 'data-table',
        name: 'Data Table',
        category: 'custom',
        status: 'active',
        version: '2.0.0',
        description: 'Responsive data table with sorting',
        createdAt: new Date(),
        modifiedAt: new Date(),
        usageCount: 42,
        source: this.getDataTableTemplate()
      }
    ];

    if (this.availableTemplates.length > 0) {
      this.selectedTemplate = this.availableTemplates[0].id;
      this.onTemplateChange();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private setupSampleData() {
    this.sampleDataSets = [
      {
        name: 'User Profiles',
        description: 'Sample user profile data',
        recordCount: 10,
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          status: ['active', 'inactive', 'pending'][i % 3],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
          joinDate: new Date(2023, i % 12, (i % 28) + 1)
        }))
      },
      {
        name: 'Product Catalog',
        description: 'Sample product data',
        recordCount: 8,
        data: Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
          price: (Math.random() * 1000 + 100).toFixed(2),
          category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
          status: ['in-stock', 'out-of-stock', 'low-stock'][i % 3],
          rating: (Math.random() * 2 + 3).toFixed(1)
        }))
      }
    ];
  }

  private setupDataSchema() {
    this.dataSchema = [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'name', type: 'string', description: 'Display name' },
      { name: 'title', type: 'string', description: 'Item title' },
      { name: 'description', type: 'string', description: 'Item description' },
      { name: 'status', type: 'string', description: 'Current status' },
      { name: 'createdAt', type: 'date', description: 'Creation date' },
      { name: 'updatedAt', type: 'date', description: 'Last update date' },
      { name: 'category', type: 'string', description: 'Item category' },
      { name: 'tags', type: 'array', description: 'Associated tags' },
      { name: 'metadata', type: 'object', description: 'Additional metadata' }
    ];
  }

  onTemplateChange() {
    this.currentTemplate = this.availableTemplates.find(t => t.id === this.selectedTemplate);
    if (this.currentTemplate) {
      this.templateSource = this.currentTemplate.source;
      this.templateSettings.name = this.currentTemplate.name;
      this.templateSettings.category = this.currentTemplate.category;
      this.templateSettings.description = this.currentTemplate.description;
      this.extractTemplateVariables();
      this.renderTemplate();
    }
  }

  private extractTemplateVariables() {
    const regex = /\{\{\{?(\w+)\}?\}\}/g;
    const variables = new Set();
    let match;

    while ((match = regex.exec(this.templateSource)) !== null) {
      variables.add(match[1]);
    }

    this.templateVariables = Array.from(variables).map(name => ({
      name,
      type: this.inferVariableType(name as string),
      description: this.getVariableDescription(name as string),
      defaultValue: this.getDefaultValue(name as string)
    }));
  }

  private inferVariableType(name: string): string {
    if (['id', 'count', 'total', 'amount'].includes(name)) return 'number';
    if (['date', 'created', 'updated', 'modified'].some(d => name.toLowerCase().includes(d))) return 'date';
    if (['active', 'enabled', 'visible'].includes(name)) return 'boolean';
    if (['tags', 'items', 'list'].includes(name)) return 'array';
    return 'string';
  }

  private getVariableDescription(name: string): string {
    const descriptions: Record<string, string> = {
      name: 'Display name or title',
      title: 'Primary title text',
      description: 'Detailed description',
      status: 'Current status or state',
      id: 'Unique identifier',
      count: 'Numeric count value',
      date: 'Date value',
      avatar: 'Profile image URL',
      category: 'Category classification'
    };
    return descriptions[name] || `The ${name} value`;
  }

  private getDefaultValue(name: string): string {
    const defaults: Record<string, string> = {
      name: 'Sample Name',
      title: 'Sample Title',
      description: 'Sample description text',
      status: 'active',
      id: '1',
      count: '0',
      category: 'default'
    };
    return defaults[name] || `{${name}}`;
  }

  private renderTemplate() {
    let rendered = this.templateSource;
    const data = this.context.sortedByAsc?.[0] || {};

    // Replace template variables with actual data
    this.templateVariables.forEach(variable => {
      const regex = new RegExp(`\\{\\{\\{?${variable.name}\\}?\\}\\}`, 'g');
      const value = data[variable.name] || variable.defaultValue;
      rendered = rendered.replace(regex, String(value));
    });

    // Apply theme variables if enabled
    if (this.templateSettings.useThemeVariables) {
      rendered = this.applyThemeVariables(rendered);
    }

    this.renderedTemplate = rendered;
  }

  private applyThemeVariables(content: string): string {
    // Replace theme color placeholders with CSS variables
    const themeReplacements: Record<string, string> = {
      '{{theme.primary}}': 'var(--theme-primary)',
      '{{theme.secondary}}': 'var(--theme-secondary)',
      '{{theme.success}}': 'var(--theme-success)',
      '{{theme.warning}}': 'var(--theme-warning)',
      '{{theme.error}}': 'var(--theme-error)',
      '{{bg.primary}}': 'var(--bg-primary)',
      '{{bg.secondary}}': 'var(--bg-secondary)',
      '{{text.primary}}': 'var(--text-primary)',
      '{{text.secondary}}': 'var(--text-secondary)',
      '{{border.primary}}': 'var(--border-primary)'
    };

    Object.entries(themeReplacements).forEach(([placeholder, variable]) => {
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), variable);
    });

    return content;
  }

  getTemplateStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      draft: 'warning',
      deprecated: 'error'
    };
    return colors[status] || 'default';
  }

  getVariableTypeColor(type: string): string {
    const colors: Record<string, string> = {
      string: 'blue',
      number: 'green',
      boolean: 'purple',
      date: 'orange',
      array: 'cyan',
      object: 'magenta'
    };
    return colors[type] || 'default';
  }

  getFieldTypeColor(type: string): string {
    return this.getVariableTypeColor(type);
  }

  // Template Management Methods
  createNewTemplate() {
    this.newTemplate = { name: '', type: 'html', description: '' };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createTemplate() {
    if (this.newTemplate.name.trim()) {
      const template = {
        id: `custom-${Date.now()}`,
        name: this.newTemplate.name,
        category: 'custom',
        status: 'draft',
        version: '1.0.0',
        description: this.newTemplate.description,
        createdAt: new Date(),
        modifiedAt: new Date(),
        usageCount: 0,
        source: this.getTemplateByType(this.newTemplate.type)
      };

      this.availableTemplates.push(template);
      this.selectedTemplate = template.id;
      this.onTemplateChange();
      this.closeCreateModal();
    }
  }

  private getTemplateByType(type: string): string {
    const templates: Record<string, string> = {
      html: this.getDefaultCardTemplate(),
      card: this.getDefaultCardTemplate(),
      list: this.getListTemplate(),
      table: this.getDataTableTemplate(),
      form: this.getFormTemplate()
    };
    return templates[type] || templates['html'];
  }

  // Template Operations
  duplicateTemplate(template: any) {
    const duplicate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      modifiedAt: new Date(),
      usageCount: 0
    };

    this.availableTemplates.push(duplicate);
    this.selectedTemplate = duplicate.id;
    this.onTemplateChange();
  }

  exportTemplate(template: any) {
    const exportData = {
      name: template.name,
      description: template.description,
      version: template.version,
      source: template.source,
      variables: this.templateVariables,
      settings: this.templateSettings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.template.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  editTemplate(template: any) {
    console.log('Editing template:', template);
    // Implement template editing modal or navigate to editor
  }

  // Template Source Operations
  onTemplateSourceChange() {
    this.extractTemplateVariables();
    this.renderTemplate();
  }

  formatTemplateCode() {
    // Basic HTML formatting
    this.templateSource = this.formatHtml(this.templateSource);
    this.renderTemplate();
  }

  private formatHtml(html: string): string {
    return html
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  validateTemplate() {
    // Basic template validation
    const errors: string[] = [];

    if (!this.templateSource.trim()) {
      errors.push('Template source is empty');
    }

    // Check for unclosed tags
    const openTags = (this.templateSource.match(/<[^/>][^>]*>/g) || []).length;
    const closeTags = (this.templateSource.match(/<\/[^>]+>/g) || []).length;

    if (openTags !== closeTags) {
      errors.push('Mismatched HTML tags detected');
    }

    // Check for undefined variables
    const undefinedVars = this.templateVariables.filter(v =>
      !this.context.sortedByAsc?.[0]?.[v.name] && !v.defaultValue
    );

    if (undefinedVars.length > 0) {
      errors.push(`Undefined variables: ${undefinedVars.map(v => v.name).join(', ')}`);
    }

    if (errors.length === 0) {
      console.log('Template validation passed');
    } else {
      console.warn('Template validation errors:', errors);
    }
  }

  // Preview Operations
  toggleResponsivePreview() {
    this.responsivePreview = !this.responsivePreview;
  }

  refreshPreview() {
    this.renderTemplate();
  }

  previewTemplate() {
    this.renderTemplate();
  }

  // Data Operations
  getCurrentDataContext(): string {
    return JSON.stringify(this.context.sortedByAsc, null, 2);
  }

  loadSampleData() {
    if (this.sampleDataSets.length > 0) {
      this.applySampleData(this.sampleDataSets[0]);
    }
  }

  applySampleData(sample: any) {
    // Apply sample data to context (this would typically update the parent component)
    console.log('Applying sample data:', sample);
    this.renderTemplate();
  }

  // Settings Operations
  resetSettings() {
    this.templateSettings = {
      name: this.currentTemplate?.name || '',
      category: this.currentTemplate?.category || 'custom',
      description: this.currentTemplate?.description || '',
      enableCache: true,
      enableSafeMode: true,
      enableDebugMode: false,
      enableAutoRefresh: true,
      useThemeVariables: true,
      adaptToTheme: true,
      includeThemeClasses: true
    };
  }

  saveSettings() {
    if (this.currentTemplate) {
      this.currentTemplate.name = this.templateSettings.name;
      this.currentTemplate.category = this.templateSettings.category;
      this.currentTemplate.description = this.templateSettings.description;
      this.currentTemplate.modifiedAt = new Date();
    }
    console.log('Settings saved:', this.templateSettings);
  }

  // Template Actions
  resetTemplate() {
    if (this.currentTemplate) {
      this.templateSource = this.currentTemplate.source;
      this.renderTemplate();
    }
  }

  saveAsNewTemplate() {
    this.newTemplate = {
      name: `${this.currentTemplate?.name || 'Template'} (Modified)`,
      type: 'html',
      description: 'Modified version of template'
    };
    this.showCreateModal = true;
  }

  applyTemplate() {
    console.log('Applying template:', this.currentTemplate);
    // Emit event or call parent method to apply template
  }

  refreshTemplates() {
    this.initializeTemplates();
  }

  // Template Definitions
  private getDefaultCardTemplate(): string {
    return `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h3 style="color: var(--text-primary); margin: 0; font-size: 18px;">{{title}}</h3>
          <span style="background: var(--theme-primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">{{status}}</span>
        </div>
        <p style="color: var(--text-secondary); margin: 0 0 12px 0; line-height: 1.5;">{{description}}</p>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-tertiary);">
          <span>ID: {{id}}</span>
          <span>•</span>
          <span>Category: {{category}}</span>
        </div>
      </div>
    `;
  }

  private getDashboardWidgetTemplate(): string {
    return `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 20px; text-align: center;">
        <div style="color: var(--theme-primary); font-size: 32px; font-weight: bold; margin-bottom: 8px;">{{count}}</div>
        <div style="color: var(--text-primary); font-size: 16px; font-weight: 500; margin-bottom: 4px;">{{title}}</div>
        <div style="color: var(--text-secondary); font-size: 12px;">{{description}}</div>
      </div>
    `;
  }

  private getDataTableTemplate(): string {
    return `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; overflow: hidden;">
        <div style="background: var(--bg-secondary); padding: 12px 16px; border-bottom: 1px solid var(--border-primary);">
          <h4 style="color: var(--text-primary); margin: 0;">{{title}}</h4>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--bg-tertiary);">
                <th style="padding: 12px; text-align: left; color: var(--text-primary); border-bottom: 1px solid var(--border-primary);">Name</th>
                <th style="padding: 12px; text-align: left; color: var(--text-primary); border-bottom: 1px solid var(--border-primary);">Status</th>
                <th style="padding: 12px; text-align: left; color: var(--text-primary); border-bottom: 1px solid var(--border-primary);">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; color: var(--text-primary); border-bottom: 1px solid var(--border-secondary);">{{name}}</td>
                <td style="padding: 12px; color: var(--text-primary); border-bottom: 1px solid var(--border-secondary);">{{status}}</td>
                <td style="padding: 12px; color: var(--text-primary); border-bottom: 1px solid var(--border-secondary);">{{category}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private getListTemplate(): string {
    return `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px;">
        <div style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-secondary);">
          <div style="width: 40px; height: 40px; background: var(--theme-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            {{name.charAt(0)}}
          </div>
          <div style="flex: 1;">
            <div style="color: var(--text-primary); font-weight: 500;">{{name}}</div>
            <div style="color: var(--text-secondary); font-size: 12px;">{{description}}</div>
          </div>
          <div style="background: var(--theme-success); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            {{status}}
          </div>
        </div>
      </div>
    `;
  }

  private getFormTemplate(): string {
    return `
      <form style="background: var(--bg-primary); padding: 24px; border-radius: 8px; border: 1px solid var(--border-primary);">
        <h2 style="color: var(--text-primary); margin: 0 0 20px 0;">{{title}}</h2>
        <div style="margin-bottom: 16px;">
          <label style="color: var(--text-primary); display: block; margin-bottom: 4px; font-weight: 500;">Name</label>
          <input type="text" value="{{name}}" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="color: var(--text-primary); display: block; margin-bottom: 4px; font-weight: 500;">Description</label>
          <textarea style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); min-height: 80px;">{{description}}</textarea>
        </div>
        <button type="submit" style="background: var(--theme-primary); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 500;">
          Submit
        </button>
      </form>
    `;
  }
}
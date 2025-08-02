import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-html-block',
  imports: [
    CommonModule, FormsModule, NzSpinModule, NzButtonModule, NzIconModule,
    NzSelectModule, NzCodeEditorModule, NzTabsModule, NzCardModule, NzToolTipModule
  ],
  templateUrl: './html-block.component.html',
  styleUrl: './html-block.component.scss'
})
export class HtmlBlockComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  rawHtmlContent = '';
  processedHtmlContent = '';
  isLoading = false;
  isEditMode = false;
  selectedTemplate = '';
  fallbackMessage = 'Switch to edit mode to create HTML content';

  availableTemplates = [
    { id: 'blank', name: 'Blank Template' },
    { id: 'card', name: 'Card Layout' },
    { id: 'dashboard', name: 'Dashboard Widget' },
    { id: 'article', name: 'Article Layout' },
    { id: 'form', name: 'Form Template' }
  ];

  themeVariables = [
    { css: 'var(--theme-primary)', description: 'Primary theme color', value: '#1890ff' },
    { css: 'var(--theme-secondary)', description: 'Secondary theme color', value: '#722ed1' },
    { css: 'var(--bg-primary)', description: 'Primary background', value: '#ffffff' },
    { css: 'var(--bg-secondary)', description: 'Secondary background', value: '#f5f5f5' },
    { css: 'var(--text-primary)', description: 'Primary text color', value: '#000000' },
    { css: 'var(--text-secondary)', description: 'Secondary text color', value: '#666666' },
    { css: 'var(--border-primary)', description: 'Primary border color', value: '#d9d9d9' },
    { css: 'var(--theme-success)', description: 'Success color', value: '#52c41a' },
    { css: 'var(--theme-warning)', description: 'Warning color', value: '#faad14' },
    { css: 'var(--theme-error)', description: 'Error color', value: '#ff4d4f' }
  ];

  contentStats = {
    elements: 0,
    classes: 0,
    themeVars: 0,
    dataBindings: 0
  };

  private themeService = inject(ThemeService);

  ngOnInit() {
    this.loadHtmlContent();
  }

  private async loadHtmlContent() {
    this.isLoading = true;

    try {
      // Try to load from your service first
      if (this.context.sortedByAsc && this.context.sortedByAsc.length > 0) {
        const htmlData = this.context.sortedByAsc[0];
        this.rawHtmlContent = htmlData.htmlContent || htmlData.content || '';
      }

      if (!this.rawHtmlContent) {
        this.rawHtmlContent = this.getDefaultContent();
      }

      this.processContent();

    } catch (error) {
      console.error('Error loading HTML content:', error);
      this.rawHtmlContent = this.getErrorContent();
      this.fallbackMessage = 'Error loading content. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private getDefaultContent(): string {
    return `
      <div style="background: var(--bg-primary); padding: 24px; border-radius: 8px; border: 1px solid var(--border-primary);">
        <h2 style="color: var(--theme-primary); margin-bottom: 16px;">Welcome to HTML Block</h2>
        <p style="color: var(--text-primary); margin-bottom: 12px;">
          This is a dynamic HTML block that supports theme variables and data binding.
        </p>
        <div style="background: var(--bg-secondary); padding: 12px; border-radius: 4px; margin-bottom: 12px;">
          <strong style="color: var(--text-primary);">Theme Integration:</strong>
          <span style="color: var(--text-secondary);"> Colors automatically adapt to your selected theme.</span>
        </div>
        <button style="background: var(--theme-primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Sample Button
        </button>
      </div>
    `;
  }

  private getErrorContent(): string {
    return `
      <div style="background: var(--theme-error); color: white; padding: 16px; border-radius: 4px; text-align: center;">
        <strong>Error Loading Content</strong>
        <p style="margin: 8px 0 0 0;">Please check your HTML content or try refreshing.</p>
      </div>
    `;
  }

  private processContent(): void {
    let content = this.rawHtmlContent;

    // Process data bindings if context data is available
    if (this.context.sortedByAsc && this.context.sortedByAsc.length > 0) {
      content = this.processDataBindings(content);
    }

    // Update theme variables with current theme values
    content = this.updateThemeVariables(content);

    this.processedHtmlContent = content;
    this.updateContentStats();
  }

  private processDataBindings(content: string): string {
    const data = this.context.sortedByAsc[0] || {};

    // Simple template replacement - replace {{property}} with actual values
    return content.replace(/\{\{([^}]+)\}\}/g, (match, property) => {
      const value = this.getNestedProperty(data, property.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  private updateThemeVariables(content: string): string {
    // Update CSS variables with current theme values
    if (this.themeService.isCustom()) {
      const customTheme = this.themeService.customTheme();
      if (customTheme) {
        this.themeVariables.forEach(variable => {
          if (variable.css.includes('--theme-primary')) {
            variable.value = customTheme.primary;
          } else if (variable.css.includes('--theme-secondary')) {
            variable.value = customTheme.secondary;
          }
          // Add more mappings as needed
        });
      }
    }

    return content;
  }

  private updateContentStats(): void {
    const content = this.processedHtmlContent;

    // Count HTML elements
    this.contentStats.elements = (content.match(/<[^>]+>/g) || []).length;

    // Count CSS classes
    this.contentStats.classes = (content.match(/class\s*=\s*["'][^"']*["']/g) || []).length;

    // Count theme variables
    this.contentStats.themeVars = (content.match(/var\(--[^)]+\)/g) || []).length;

    // Count data bindings
    this.contentStats.dataBindings = (content.match(/\{\{[^}]+\}\}/g) || []).length;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.processContent();
    }
  }

  onContentChange(): void {
    // Auto-process content in edit mode for real-time preview
    if (this.isEditMode) {
      this.processContent();
    }
  }

  onTemplateChange(): void {
    if (this.selectedTemplate) {
      this.loadTemplate(this.selectedTemplate);
    }
  }

  private loadTemplate(templateId: string): void {
    const templates: Record<string, string> = {
      blank: '',
      card: this.getCardTemplate(),
      dashboard: this.getDashboardTemplate(),
      article: this.getArticleTemplate(),
      form: this.getFormTemplate()
    };

    this.rawHtmlContent = templates[templateId] || templates['blank'];
    this.processContent();
  }

  private getCardTemplate(): string {
    return `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: var(--bg-secondary); padding: 16px; border-bottom: 1px solid var(--border-primary);">
          <h3 style="color: var(--text-primary); margin: 0;">{{title}}</h3>
        </div>
        <div style="padding: 16px;">
          <p style="color: var(--text-secondary); margin: 0 0 12px 0;">{{description}}</p>
          <div style="display: flex; gap: 8px;">
            <span style="background: var(--theme-primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">{{status}}</span>
          </div>
        </div>
      </div>
    `;
  }

  private getDashboardTemplate(): string {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: var(--theme-primary); font-size: 24px; font-weight: bold;">{{totalUsers}}</div>
          <div style="color: var(--text-secondary); font-size: 14px;">Total Users</div>
        </div>
        <div style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: var(--theme-success); font-size: 24px; font-weight: bold;">{{activeUsers}}</div>
          <div style="color: var(--text-secondary); font-size: 14px;">Active Users</div>
        </div>
      </div>
    `;
  }

  private getArticleTemplate(): string {
    return `
      <article style="background: var(--bg-primary); padding: 24px; border-radius: 8px; max-width: 800px;">
        <header style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-primary);">
          <h1 style="color: var(--text-primary); margin: 0 0 8px 0;">{{title}}</h1>
          <div style="color: var(--text-secondary); font-size: 14px;">{{publishDate}} • {{author}}</div>
        </header>
        <div style="color: var(--text-primary); line-height: 1.6;">
          {{content}}
        </div>
      </article>
    `;
  }

  private getFormTemplate(): string {
    return `
      <form style="background: var(--bg-primary); padding: 24px; border-radius: 8px; border: 1px solid var(--border-primary);">
        <h2 style="color: var(--text-primary); margin: 0 0 16px 0;">Contact Form</h2>
        <div style="margin-bottom: 16px;">
          <label style="color: var(--text-primary); display: block; margin-bottom: 4px;">Name</label>
          <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="color: var(--text-primary); display: block; margin-bottom: 4px;">Email</label>
          <input type="email" style="width: 100%; padding: 8px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);">
        </div>
        <button type="submit" style="background: var(--theme-primary); color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer;">
          Submit
        </button>
      </form>
    `;
  }

  refreshContent(): void {
    this.loadHtmlContent();
  }

  formatCode(): void {
    // Simple HTML formatting
    this.rawHtmlContent = this.formatHtml(this.rawHtmlContent);
    this.processContent();
  }

  private formatHtml(html: string): string {
    // Basic HTML formatting - you might want to use a proper formatter library
    return html
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  insertThemeVariables(): void {
    const variables = this.themeVariables.map(v => v.css).join('\n');
    this.rawHtmlContent += `\n\n<!-- Available Theme Variables:\n${variables}\n-->`;
    this.processContent();
  }

  getLineCount(): number {
    return this.rawHtmlContent.split('\n').length;
  }

  getDataContext(): string {
    return JSON.stringify(this.context.sortedByAsc, null, 2);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }

  loadSampleContent(): void {
    this.rawHtmlContent = this.getDefaultContent();
    this.processContent();
  }
}
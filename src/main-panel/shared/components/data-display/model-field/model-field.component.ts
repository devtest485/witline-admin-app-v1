import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../../services/theme.service';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRateModule } from 'ng-zorro-antd/rate';

interface ExtendedFormlyFieldConfig extends FormlyFieldConfig {
  dependencies?: string[];
  key: string | number;
  type?: string;
  templateOptions: {
    label?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    disabled?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    step?: number;
    type?: string;
    fieldWidth?: string;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-model-field',
  imports: [
    CommonModule, FormsModule, FormlyModule, ReactiveFormsModule, NzCardModule, NzButtonModule,
    NzIconModule, NzTableModule, NzModalModule, NzSpinModule, NzFormModule,
    NzInputModule, NzSelectModule, NzSwitchModule, NzTagModule, NzToolTipModule,
    NzDividerModule, NzCollapseModule, NzTabsModule, NzStepsModule, NzAlertModule,
    NzCodeEditorModule, NzTreeModule, NzTransferModule, CdkDrag,
    NzInputNumberModule, NzStatisticModule, NzProgressModule, NzRateModule, NzSelectModule
  ],
  templateUrl: './model-field.component.html',
  styleUrl: './model-field.component.scss'
})
export class ModelFieldComponent implements OnInit {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  // Component State
  modelFields: ExtendedFormlyFieldConfig[] = [];
  filteredModelFields: ExtendedFormlyFieldConfig[] = [];
  selectedField: ExtendedFormlyFieldConfig | null = null;
  selectedFieldIndex = -1;
  isLoading = false;

  // Configuration
  configStep = 0;
  fieldSearchTerm = '';
  fieldFilterType = 'all';

  // Available Field Types
  availableFieldTypes = [
    { value: 'input', label: 'Text Input' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Group' },
    { value: 'datepicker', label: 'Date Picker' },
    { value: 'file', label: 'File Upload' },
    { value: 'number', label: 'Number Input' }
  ];

  // Validation
  customValidationMessages: { type: string; message: string }[] = [];

  // Preview
  previewForm = new FormGroup({});
  previewModel: any = {};

  // Schema
  schemaFormat = 'formly';
  schemaJson = '';

  // Analytics
  fieldAnalytics: any[] = [];

  public themeService: ThemeService = inject(ThemeService);
  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit() {
    this.initializeModelFields();
  }

  private initializeModelFields() {
    this.isLoading = true;

    // Load from context or generate sample fields
    if (this.context.sortedByAsc && this.context.sortedByAsc.length > 0) {
      this.generateFieldsFromContext();
    } else {
      this.generateSampleFields();
    }

    this.generateFieldAnalytics();
    this.updateSchemaJson();

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private toExtended(field: FormlyFieldConfig): ExtendedFormlyFieldConfig {
    return this.ensureTemplateOptions(field);
  }

  private generateFieldsFromContext() {
    const sampleData = this.context.sortedByAsc[0];
    Object.keys(sampleData).forEach(key => {
      const value = sampleData[key];
      const field = this.createFieldFromValue(key, value);
      this.modelFields.push(this.toExtended(field));
    });
    this.filteredModelFields = [...this.modelFields];
  }

  private generateSampleFields() {
    this.modelFields = [
      this.ensureTemplateOptions({
        key: 'firstName',
        type: 'input',
        templateOptions: {
          label: 'First Name',
          placeholder: 'Enter first name...',
          required: true,
          minLength: 2,
          maxLength: 50
        }
      }),
      this.ensureTemplateOptions({
        key: 'email',
        type: 'input',
        templateOptions: {
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter email...',
          required: true
        },
        validators: {
          validation: ['email']
        }
      }),
      this.ensureTemplateOptions({
        key: 'birthDate',
        type: 'datepicker',
        templateOptions: {
          label: 'Birth Date',
          placeholder: 'Select date...',
          required: false
        }
      }),
      this.ensureTemplateOptions({
        key: 'newsletter',
        type: 'checkbox',
        templateOptions: {
          label: 'Subscribe to newsletter',
          description: 'Receive updates and promotions'
        }
      })
    ];

    this.filteredModelFields = [...this.modelFields];
  }

  /**
  * Safely get field key as string
  */
  getFieldKey(field: FormlyFieldConfig | null | undefined): string {
    if (!field || !field.key) return 'unnamed';
    if (Array.isArray(field.key)) return field.key[0]?.toString() || 'unnamed';
    return field.key.toString();
  }

  /**
   * Safely get field label with fallbacks
   */
  getFieldLabel(field: FormlyFieldConfig | null | undefined): string {
    if (!field) return 'Unnamed Field';
    return field.templateOptions?.label || this.getFieldKey(field) || 'Unnamed Field';
  }

  // Helper method to ensure field has templateOptions
  private ensureTemplateOptions(field: FormlyFieldConfig | null): ExtendedFormlyFieldConfig {
    if (!field) {
      return {
        key: `field_${Date.now()}`,
        type: 'input',
        templateOptions: {}
      };
    }

    if (!field.templateOptions) {
      field.templateOptions = {};
    }

    return field as ExtendedFormlyFieldConfig;
  }

  private createFieldFromValue(key: string, value: any): FormlyFieldConfig {
    const fieldType = this.inferFieldType(value);

    return {
      key: key,
      type: fieldType,
      templateOptions: {
        label: this.formatLabel(key),
        placeholder: `Enter ${key}...`,
        required: false
      }
    };
  }

  private inferFieldType(value: any): string {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'input';
    if (typeof value === 'string') {
      if (value.includes('@')) return 'input'; // email
      if (value.length > 100) return 'textarea';
      return 'input';
    }
    if (value instanceof Date) return 'datepicker';
    return 'input';
  }

  private formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private generateFieldAnalytics() {
    this.fieldAnalytics = this.modelFields.map(field => ({
      fieldKey: field.key,
      fieldType: field.type,
      usageCount: Math.floor(Math.random() * 1000) + 100,
      errorRate: Math.floor(Math.random() * 30),
      completionRate: Math.floor(Math.random() * 30) + 70,
      performance: Math.floor(Math.random() * 2) + 3
    }));
  }

  // Field Management
  createNewField() {
    const newField: ExtendedFormlyFieldConfig = {
      key: `field_${this.modelFields.length + 1}`,
      type: 'input',
      templateOptions: {
        label: 'New Field',
        placeholder: 'Enter value...',
        required: false
      }
    };

    this.modelFields.push(newField);
    this.filteredModelFields = [...this.modelFields];
    this.selectField(newField, this.modelFields.length - 1);
    this.updateSchemaJson();
  }

  selectField(field: ExtendedFormlyFieldConfig, index: number) {
    // Deep clone to avoid reference issues
    this.selectedField = JSON.parse(JSON.stringify(field));

    // Ensure the cloned field has templateOptions
    this.selectedField = this.ensureTemplateOptions(this.selectedField);

    this.selectedFieldIndex = index;
    this.configStep = 0;
    this.setupCustomValidationMessages();
    this.updatePreview();
  }

  editField(field: FormlyFieldConfig, index: number) {
    // this.selectField(field, index);
  }

  cloneField(field: FormlyFieldConfig, index: number) {
    const clonedField = JSON.parse(JSON.stringify(field));
    clonedField.key = `${field.key}_copy`;

    this.modelFields.splice(index + 1, 0, clonedField);
    this.filteredModelFields = [...this.modelFields];
    this.updateSchemaJson();
  }

  deleteField(index: number) {
    this.modelFields.splice(index, 1);
    this.filteredModelFields = [...this.modelFields];

    if (this.selectedFieldIndex === index) {
      this.selectedField = null;
      this.selectedFieldIndex = -1;
    }

    this.updateSchemaJson();
  }

  filterFields() {
    this.filteredModelFields = this.modelFields.filter(field => {
      const matchesSearch = !this.fieldSearchTerm ||
        field.key?.toString().toLowerCase().includes(this.fieldSearchTerm.toLowerCase()) ||
        field.templateOptions?.label?.toLowerCase().includes(this.fieldSearchTerm.toLowerCase());

      const matchesType = this.fieldFilterType === 'all' ||
        (this.fieldFilterType === 'input' && ['input', 'textarea'].includes(field.props?.type!)) ||
        (this.fieldFilterType === 'select' && ['select', 'radio', 'checkbox'].includes(field.props?.type!)) ||
        (this.fieldFilterType === 'layout' && ['fieldset', 'tabs'].includes(field.props?.type!)) ||
        (this.fieldFilterType === 'validation' && field.validators);

      return matchesSearch && matchesType;
    });
  }

  sortFields() {
    this.modelFields.sort((a, b) => (a.key! > b.key!) ? 1 : -1);
    this.filteredModelFields = [...this.modelFields];
  }

  refreshFields() {
    this.filteredModelFields = [...this.modelFields];
  }

  // Field Configuration
  onFieldTypeChange() {
    if (this.selectedField) {
      this.selectedField.templateOptions = {
        ...this.selectedField.templateOptions,
        type: this.selectedField.type === 'input' ? 'text' : undefined
      };
      this.updatePreview();
    }
  }

  private setupCustomValidationMessages() {
    this.customValidationMessages = [];
    if (this.selectedField?.templateOptions?.required) {
      this.customValidationMessages.push({
        type: 'required',
        message: 'This field is required'
      });
    }
  }

  addValidationMessage() {
    this.customValidationMessages.push({
      type: 'required',
      message: 'This field is required'
    });
  }

  removeValidationMessage(index: number) {
    this.customValidationMessages.splice(index, 1);
  }

  private updatePreview() {
    if (this.selectedField) {
      this.previewForm = this.fb.group({});
      this.previewModel = {};
    }
  }

  testField() {
    console.log('Testing field:', this.selectedField);
    // Implement field testing logic
  }

  saveFieldConfiguration() {
    if (this.selectedField && this.selectedFieldIndex >= 0) {
      this.modelFields[this.selectedFieldIndex] = JSON.parse(JSON.stringify(this.selectedField));
      this.filteredModelFields = [...this.modelFields];
      this.updateSchemaJson();
      console.log('Field configuration saved');
    }
  }

  resetFieldConfiguration() {
    if (this.selectedFieldIndex >= 0) {
      this.selectField(this.modelFields[this.selectedFieldIndex], this.selectedFieldIndex);
    }
  }

  duplicateFieldConfiguration() {
    if (this.selectedField) {
      this.cloneField(this.selectedField, this.selectedFieldIndex);
    }
  }

  getValidationRuleCount(): number {
    if (!this.selectedField) return 0;

    let count = 0;
    const opts = this.selectedField.templateOptions;

    if (opts.required) count++;
    if (opts.minLength) count++;
    if (opts.maxLength) count++;
    if (opts.pattern) count++;
    if (this.selectedField.validators) {
      count += Object.keys(this.selectedField.validators).length;
    }

    return count;
  }

  // Schema Management
  private updateSchemaJson() {
    switch (this.schemaFormat) {
      case 'formly':
        this.schemaJson = JSON.stringify(this.modelFields, null, 2);
        break;
      case 'jsonschema':
        this.schemaJson = JSON.stringify(this.convertToJsonSchema(), null, 2);
        break;
      case 'openapi':
        this.schemaJson = JSON.stringify(this.convertToOpenAPI(), null, 2);
        break;
    }
  }

  private convertToJsonSchema() {
    const schema = {
      type: 'object',
      properties: {} as any,
      required: [] as string[]
    };

    this.modelFields.forEach(field => {
      const property: any = {
        type: this.getJsonSchemaType(field.props?.type!),
        title: field.templateOptions?.label || field.key
      };

      if (field.templateOptions?.description) {
        property.description = field.templateOptions.description;
      }

      if (field.templateOptions?.minLength) {
        property.minLength = field.templateOptions.minLength;
      }

      if (field.templateOptions?.maxLength) {
        property.maxLength = field.templateOptions.maxLength;
      }

      schema.properties[Number(field.key)!] = property;

      if (field.templateOptions?.required) {
        schema.required.push(field.key?.toString()!);
      }
    });

    return schema;
  }

  private convertToOpenAPI() {
    return {
      type: 'object',
      properties: this.convertToJsonSchema().properties,
      required: this.modelFields
        .filter(f => f.templateOptions?.required)
        .map(f => f.key!)
    };
  }

  private getJsonSchemaType(formlyType: string): string {
    const typeMap: Record<string, string> = {
      input: 'string',
      textarea: 'string',
      select: 'string',
      checkbox: 'boolean',
      radio: 'string',
      datepicker: 'string',
      file: 'string',
      number: 'number'
    };

    return typeMap[formlyType] || 'string';
  }

  formatSchema() {
    try {
      const parsed = JSON.parse(this.schemaJson);
      this.schemaJson = JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.error('Invalid JSON schema:', error);
    }
  }

  validateSchema() {
    try {
      JSON.parse(this.schemaJson);
      console.log('Schema is valid JSON');
    } catch (error) {
      console.error('Invalid JSON schema:', error);
    }
  }

  exportSchema() {
    const blob = new Blob([this.schemaJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-schema-${this.schemaFormat}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  loadSchemaFromJson() {
    try {
      const schema = JSON.parse(this.schemaJson);
      if (this.schemaFormat === 'formly') {
        this.modelFields = this.convertToExtended(schema);
        this.filteredModelFields = [...this.modelFields];
      }
      console.log('Schema loaded successfully');
    } catch (error) {
      console.error('Failed to load schema:', error);
    }
  }

  // Safe property access methods
  updateFieldProperty<K extends keyof ExtendedFormlyFieldConfig['templateOptions']>(
    key: K,
    value: ExtendedFormlyFieldConfig['templateOptions'][K]
  ) {
    if (this.selectedField) {
      this.selectedField.templateOptions[key] = value;
    }
  }

  getFieldProperty<K extends keyof ExtendedFormlyFieldConfig['templateOptions']>(
    key: K
  ): ExtendedFormlyFieldConfig['templateOptions'][K] | undefined {
    return this.selectedField?.templateOptions[key];
  }

  // Convert regular FormlyFieldConfig to ExtendedFormlyFieldConfig
  private convertToExtended(fields: FormlyFieldConfig[]): ExtendedFormlyFieldConfig[] {
    return fields.map(field => this.ensureTemplateOptions(field));
  }

  applySchemaChanges() {
    this.loadSchemaFromJson();
    this.updateSchemaJson();
  }

  // Global Actions
  importFieldSchema() {
    console.log('Importing field schema from file');
  }

  exportFieldSchema() {
    const exportData = {
      fields: this.modelFields,
      analytics: this.fieldAnalytics,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-fields-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Utility Methods
  getFieldTypeColor(type: string): string {
    const colors: Record<string, string> = {
      input: 'blue',
      textarea: 'green',
      select: 'purple',
      checkbox: 'orange',
      radio: 'cyan',
      datepicker: 'geekblue',
      file: 'magenta',
      number: 'volcano'
    };
    return colors[type] || 'default';
  }

  getRequiredFieldCount(): number {
    return this.modelFields.filter(f => f.templateOptions?.required).length;
  }

  getValidatedFieldCount(): number {
    return this.modelFields.filter(f =>
      f.validators ||
      f.templateOptions?.minLength ||
      f.templateOptions?.maxLength ||
      f.templateOptions?.pattern
    ).length;
  }
}
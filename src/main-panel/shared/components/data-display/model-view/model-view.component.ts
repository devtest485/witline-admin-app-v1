import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { ComponentConfig, ComponentContext } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelService } from '../../../services/model.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ThemeService } from '../../../services/theme.service';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-model-view',
  imports: [
    CommonModule, FormsModule, FormlyModule, ReactiveFormsModule, NzCardModule, NzButtonModule,
    NzIconModule, NzTabsModule, NzTableModule, NzModalModule, NzSpinModule,
    NzFormModule, NzInputModule, NzSelectModule, NzDatePickerModule, NzSwitchModule,
    NzTagModule, NzDividerModule, NzToolTipModule, NzPopconfirmModule, NzStepsModule,
    NzProgressModule, NzAlertModule, NzCodeEditorModule, NzUploadModule, NzStatisticModule,
    NzInputNumberModule
  ],
  templateUrl: './model-view.component.html',
  styleUrl: './model-view.component.scss'
})
export class ModelViewComponent {
  @Input() context!: ComponentContext;
  @Input() config!: ComponentConfig;

  // Form Management
  dynamicForm = new FormGroup({});
  formFields: FormlyFieldConfig[] = [];
  formModel: any = {};
  formOptions: FormlyFormOptions = {};

  // Component State
  isLoading = false;
  getCategoryType: any[] = [];
  formTemplates: any[] = [];
  formSubmissions: any[] = [];

  // Field Types
  basicFieldTypes: any[] = [];
  advancedFieldTypes: any[] = [];
  layoutFieldTypes: any[] = [];

  // Editor State
  showFieldEditor = false;
  editingField: any = null;
  editingFieldIndex = -1;

  // Settings
  formSettings = {
    title: 'Dynamic Form',
    description: 'Auto-generated form',
    enableRealTimeValidation: true,
    showValidationSummary: true,
    enableProgressIndicator: false,
    enableAutoSave: true,
    enableMultipleSubmissions: false,
    enableDraftSaving: true,
    enableEmailNotifications: false
  };

  public themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initializeFormData();
    this.initializeFieldTypes();
    this.initializeTemplates();
    this.setupFormOptions();
  }

  private initializeFormData() {
    this.isLoading = true;

    // Load data from context
    this.getCategoryType = this.context.sortedByAsc || [];

    // Generate sample submissions
    this.formSubmissions = this.generateSampleSubmissions();

    // Initialize with sample fields
    if (this.getCategoryType.length > 0) {
      this.generateFieldsFromData();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private initializeFieldTypes() {
    this.basicFieldTypes = [
      {
        name: 'Text Input',
        type: 'input',
        icon: 'edit',
        description: 'Single line text input',
        template: {
          type: 'input',
          templateOptions: {
            label: 'Text Field',
            placeholder: 'Enter text...',
            required: false
          }
        }
      },
      {
        name: 'Textarea',
        type: 'textarea',
        icon: 'file-text',
        description: 'Multi-line text input',
        template: {
          type: 'textarea',
          templateOptions: {
            label: 'Textarea Field',
            placeholder: 'Enter text...',
            rows: 4,
            required: false
          }
        }
      },
      {
        name: 'Select Dropdown',
        type: 'select',
        icon: 'down',
        description: 'Dropdown selection',
        template: {
          type: 'select',
          templateOptions: {
            label: 'Select Field',
            placeholder: 'Choose option...',
            options: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
            ],
            required: false
          }
        }
      },
      {
        name: 'Checkbox',
        type: 'checkbox',
        icon: 'check-square',
        description: 'Boolean checkbox',
        template: {
          type: 'checkbox',
          templateOptions: {
            label: 'Checkbox Field',
            description: 'Check this option'
          }
        }
      },
      {
        name: 'Radio Group',
        type: 'radio',
        icon: 'check-circle',
        description: 'Radio button group',
        template: {
          type: 'radio',
          templateOptions: {
            label: 'Radio Field',
            options: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
            ],
            required: false
          }
        }
      }
    ];

    this.advancedFieldTypes = [
      {
        name: 'Date Picker',
        type: 'datepicker',
        icon: 'calendar',
        description: 'Date selection input',
        template: {
          type: 'datepicker',
          templateOptions: {
            label: 'Date Field',
            placeholder: 'Select date...',
            required: false
          }
        }
      },
      {
        name: 'Number Input',
        type: 'input',
        icon: 'number',
        description: 'Numeric input field',
        template: {
          type: 'input',
          templateOptions: {
            label: 'Number Field',
            type: 'number',
            placeholder: 'Enter number...',
            min: 0,
            required: false
          }
        }
      },
      {
        name: 'Email Input',
        type: 'input',
        icon: 'mail',
        description: 'Email validation input',
        template: {
          type: 'input',
          templateOptions: {
            label: 'Email Field',
            type: 'email',
            placeholder: 'Enter email...',
            required: false
          },
          validators: {
            validation: ['email']
          }
        }
      },
      {
        name: 'File Upload',
        type: 'file',
        icon: 'upload',
        description: 'File upload control',
        template: {
          type: 'file',
          templateOptions: {
            label: 'File Field',
            multiple: false,
            accept: '*',
            required: false
          }
        }
      }
    ];

    this.layoutFieldTypes = [
      {
        name: 'Fieldset',
        type: 'fieldset',
        icon: 'border',
        description: 'Group fields together',
        template: {
          type: 'fieldset',
          templateOptions: {
            label: 'Field Group'
          },
          fieldGroup: []
        }
      },
      {
        name: 'Tabs',
        type: 'tabs',
        icon: 'tabs',
        description: 'Tabbed field groups',
        template: {
          type: 'tabs',
          fieldGroup: [
            {
              templateOptions: { label: 'Tab 1' },
              fieldGroup: []
            }
          ]
        }
      }
    ];
  }

  private initializeTemplates() {
    this.formTemplates = [
      {
        name: 'Contact Form',
        category: 'system',
        description: 'Basic contact information form',
        usageCount: 45,
        rating: 4.8,
        isFavorite: false,
        fields: [
          {
            key: 'firstName',
            type: 'input',
            templateOptions: {
              label: 'First Name',
              placeholder: 'Enter first name...',
              required: true
            }
          },
          {
            key: 'lastName',
            type: 'input',
            templateOptions: {
              label: 'Last Name',
              placeholder: 'Enter last name...',
              required: true
            }
          },
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: 'Email',
              type: 'email',
              placeholder: 'Enter email...',
              required: true
            }
          },
          {
            key: 'message',
            type: 'textarea',
            templateOptions: {
              label: 'Message',
              placeholder: 'Enter your message...',
              rows: 4,
              required: true
            }
          }
        ]
      },
      {
        name: 'User Registration',
        category: 'system',
        description: 'User account registration form',
        usageCount: 32,
        rating: 4.6,
        isFavorite: true,
        fields: [
          {
            key: 'username',
            type: 'input',
            templateOptions: {
              label: 'Username',
              placeholder: 'Choose username...',
              required: true,
              minLength: 3
            }
          },
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: 'Email',
              type: 'email',
              placeholder: 'Enter email...',
              required: true
            }
          },
          {
            key: 'password',
            type: 'input',
            templateOptions: {
              label: 'Password',
              type: 'password',
              placeholder: 'Choose password...',
              required: true,
              minLength: 8
            }
          },
          {
            key: 'acceptTerms',
            type: 'checkbox',
            templateOptions: {
              label: 'I accept the terms and conditions',
              required: true
            }
          }
        ]
      },
      {
        name: 'Survey Form',
        category: 'custom',
        description: 'Customer feedback survey',
        usageCount: 28,
        rating: 4.2,
        isFavorite: false,
        fields: [
          {
            key: 'satisfaction',
            type: 'radio',
            templateOptions: {
              label: 'How satisfied are you with our service?',
              options: [
                { label: 'Very Satisfied', value: 5 },
                { label: 'Satisfied', value: 4 },
                { label: 'Neutral', value: 3 },
                { label: 'Dissatisfied', value: 2 },
                { label: 'Very Dissatisfied', value: 1 }
              ],
              required: true
            }
          },
          {
            key: 'recommendations',
            type: 'checkbox',
            templateOptions: {
              label: 'Would you recommend us to others?'
            }
          },
          {
            key: 'feedback',
            type: 'textarea',
            templateOptions: {
              label: 'Additional Feedback',
              placeholder: 'Please share your thoughts...',
              rows: 4
            }
          }
        ]
      }
    ];
  }

  private setupFormOptions() {
    this.formOptions = {
      formState: {
        awesomeIsForced: false,
      },
      resetModel: () => {
        this.formModel = {};
      }
    };
  }

  private generateFieldsFromData() {
    const sampleData = this.getCategoryType[0];
    if (sampleData) {
      Object.keys(sampleData).forEach((key, index) => {
        if (index < 5) { // Limit to first 5 properties
          const value = sampleData[key];
          const fieldType = this.inferFieldType(value);

          this.formFields.push({
            key: key,
            type: fieldType,
            templateOptions: {
              label: this.formatLabel(key),
              placeholder: `Enter ${key}...`,
              required: false
            }
          });
        }
      });
    }
  }

  private inferFieldType(value: any): string {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'input';
    if (typeof value === 'string') {
      if (value.includes('@')) return 'input'; // email
      if (value.length > 50) return 'textarea';
      return 'input';
    }
    return 'input';
  }

  private formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private generateSampleSubmissions(): any[] {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      formName: this.formSettings.title,
      submittedBy: `User ${i + 1}`,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
      data: { sample: `data${i}` }
    }));
  }

  // Field Management
  addField(fieldType: any) {
    const newField = {
      key: `field_${this.formFields.length + 1}`,
      ...JSON.parse(JSON.stringify(fieldType.template))
    };

    this.formFields.push(newField);
    this.updateForm();
  }

  addBasicField() {
    this.addField(this.basicFieldTypes[0]);
  }

  editField(field: any, index: number) {
    this.editingField = JSON.parse(JSON.stringify(field));
    this.editingFieldIndex = index;
    this.showFieldEditor = true;
  }

  duplicateField(field: any, index: number) {
    const duplicate = JSON.parse(JSON.stringify(field));
    duplicate.key = `${field.key}_copy`;
    this.formFields.splice(index + 1, 0, duplicate);
    this.updateForm();
  }

  removeField(index: number) {
    this.formFields.splice(index, 1);
    this.updateForm();
  }

  saveField() {
    if (this.editingField && this.editingFieldIndex >= 0) {
      this.formFields[this.editingFieldIndex] = this.editingField;
      this.updateForm();
    }
    this.closeFieldEditor();
  }

  closeFieldEditor() {
    this.showFieldEditor = false;
    this.editingField = null;
    this.editingFieldIndex = -1;
  }

  private updateForm() {
    // Trigger form update
    this.formFields = [...this.formFields];
  }

  // Form Actions
  submitForm() {
    if (this.dynamicForm.valid) {
      console.log('Form submitted:', this.formModel);

      // Add to submissions
      const submission = {
        id: this.formSubmissions.length + 1,
        formName: this.formSettings.title,
        submittedBy: 'Current User',
        submittedAt: new Date(),
        status: 'pending',
        data: { ...this.formModel }
      };

      this.formSubmissions.unshift(submission);

      // Reset form
      this.resetForm();
    } else {
      console.warn('Form is invalid');
    }
  }

  resetForm() {
    this.formModel = {};
    this.dynamicForm.reset();
  }

  validateForm() {
    this.dynamicForm.markAllAsTouched();
    console.log('Form validation status:', this.dynamicForm.valid);
    console.log('Form errors:', this.dynamicForm.errors);
  }

  previewForm() {
    console.log('Form preview:', {
      fields: this.formFields,
      model: this.formModel,
      settings: this.formSettings
    });
  }

  saveForm() {
    const formData = {
      title: this.formSettings.title,
      description: this.formSettings.description,
      fields: this.formFields,
      settings: this.formSettings,
      savedAt: new Date()
    };

    console.log('Saving form:', formData);
  }

  clearForm() {
    this.formFields = [];
    this.formModel = {};
    this.updateForm();
  }

  // Template Management
  loadTemplate(template: any) {
    this.formFields = JSON.parse(JSON.stringify(template.fields));
    this.formSettings.title = template.name;
    this.formSettings.description = template.description;
    template.usageCount = (template.usageCount || 0) + 1;
    this.updateForm();
  }

  previewTemplate(template: any) {
    console.log('Previewing template:', template);
  }

  favoriteTemplate(template: any) {
    template.isFavorite = !template.isFavorite;
  }

  // Data Management
  viewSubmission(submission: any) {
    console.log('Viewing submission:', submission);
  }

  exportSubmission(submission: any) {
    const blob = new Blob([JSON.stringify(submission, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submission-${submission.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Settings Management
  resetSettings() {
    this.formSettings = {
      title: 'Dynamic Form',
      description: 'Auto-generated form',
      enableRealTimeValidation: true,
      showValidationSummary: true,
      enableProgressIndicator: false,
      enableAutoSave: true,
      enableMultipleSubmissions: false,
      enableDraftSaving: true,
      enableEmailNotifications: false
    };
  }

  saveSettings() {
    console.log('Saving settings:', this.formSettings);
  }

  // Global Actions
  createNewModel() {
    this.clearForm();
  }

  importModel() {
    console.log('Importing model from file');
  }

  exportModels() {
    const exportData = {
      forms: [{
        title: this.formSettings.title,
        description: this.formSettings.description,
        fields: this.formFields,
        settings: this.formSettings
      }],
      templates: this.formTemplates,
      submissions: this.formSubmissions,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-models-${Date.now()}.json`;
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
      datepicker: 'geekblue'
    };
    return colors[type] || 'default';
  }

  getValidatorCount(validators: any): number {
    if (!validators) return 0;
    return Object.keys(validators).length;
  }

  getSubmissionStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  }

  getCategoryTypeCount(): number {
    return this.getCategoryType.length;
  }

  getSubmissionCount(): number {
    return this.formSubmissions.length;
  }

  getSuccessRate(): number {
    const approved = this.formSubmissions.filter(s => s.status === 'approved').length;
    return this.formSubmissions.length > 0 ? Math.round((approved / this.formSubmissions.length) * 100) : 0;
  }
}

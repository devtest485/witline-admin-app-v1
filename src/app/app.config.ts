import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(en_US),
    importProvidersFrom(
      FormsModule,
      FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'minLength', message: 'Minimum length not met' },
          { name: 'maxLength', message: 'Maximum length exceeded' },
          { name: 'min', message: 'Value too small' },
          { name: 'max', message: 'Value too large' }
        ],
        wrappers: [
          // { name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
          // { name: 'formly-vertical-wrapper', component: FormlyVerticalWrapper },
          // { name: 'formly-vertical-theme-wrapper', component: FormlyVerticalThemeWrapper, },
          // { name: 'formly-wrapper-panel', component: PanelWrapperComponent },
          // { name: 'input-wrapper', component: FormlyInputWrapper },
          // { name: 'select-wrapper', component: FormlySelectWrapper },
          // { name: 'checkbox-wrapper', component: FormlyCheckboxWrapper },
          // { name: 'radio-wrapper', component: FormlyRadioWrapper },
          // { name: 'tabs-wrapper', component: FormlyTabsWrapper },
        ],
        types: [
          // { name: 'button', component: FormlyButtonField },
          // { name: 'input', component: InputFieldComponent },
          // { name: 'custom', component: CustomInputFieldComponent },
          // { name: 'textarea', component: InputFieldComponent },
          // { name: 'repeatSection', component: RepeatSectionFieldComponent },
          // { name: 'select', component: SelectFieldComponent },
          // { name: 'tags', component: SelectFieldComponent },
          // { name: 'gridSection', component: GridSectionsFieldComponent },
          // { name: 'ng-select', component: NgSelectFieldComponent },
          // { name: 'ng-search', component: NgSelectFieldComponent },
        ],
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
  ]
};

import { Component, computed, inject, Input } from '@angular/core';
import { ComponentConfig, ComponentContext } from '../../shared/interfaces/interfaces';
import { DataDisplay } from '../../shared/enums/data-display';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';
import { NzSpinComponent } from "ng-zorro-antd/spin";
import { PanelViewComponent } from "../../shared/components/data-display/panel-view/panel-view.component";
import { MultiViewComponent } from "../../shared/components/data-display/multi-view/multi-view.component";
import { ListViewComponent } from "../../shared/components/data-display/list-view/list-view.component";
import { GridViewComponent } from "../../shared/components/data-display/grid-view/grid-view.component";
import { HtmlBlockComponent } from "../../shared/components/data-display/html-block/html-block.component";
import { PreComponentComponent } from "../../shared/components/data-display/pre-component/pre-component.component";
import { WebComponentComponent } from "../../shared/components/data-display/web-component/web-component.component";
import { ModelFieldComponent } from "../../shared/components/data-display/model-field/model-field.component";
import { TemplateViewComponent } from "../../shared/components/data-display/template-view/template-view.component";
import { ModelViewComponent } from "../../shared/components/data-display/model-view/model-view.component";
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-dynamic-ui-router',
  imports: [
    CommonModule,
    NzSpinComponent,
    PanelViewComponent,
    MultiViewComponent,
    ListViewComponent,
    GridViewComponent,
    HtmlBlockComponent,
    PreComponentComponent,
    WebComponentComponent,
    ModelFieldComponent,
    TemplateViewComponent,
    ModelViewComponent,
    NzEmptyModule
],
  templateUrl: './dynamic-ui-router.component.html',
  styleUrl: './dynamic-ui-router.component.scss'
})
export class DynamicUIRouterComponent {
  @Input() context!: ComponentContext;
  @Input() config: ComponentConfig = {};
  @Input() isLoading = false;

  DataDisplay = DataDisplay;

  private themeService = inject(ThemeService);

  containerClasses = computed(() => {
    const baseClasses = [
      'tw-w-full',
      'theme-transition',
      'theme-bg-primary'
    ];

    if (this.config.showInModal) {
      baseClasses.push(
        'tw-max-h-[80vh]',
        'tw-overflow-auto',
        'tw-p-6',
        'tw-rounded-lg',
        'theme-shadow-lg'
      );
    }

    if (this.config.showInRightPanel) {
      baseClasses.push(
        'tw-h-full',
        'tw-border-l',
        'theme-border-primary',
        'tw-p-4',
        'theme-bg-secondary'
      );
    }

    if (this.config.containerClass) {
      baseClasses.push(this.config.containerClass);
    }

    // Add theme-specific classes
    baseClasses.push(this.themeService.getThemeClasses());

    return baseClasses.join(' ');
  });
}

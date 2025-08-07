import { Routes } from '@angular/router';
import { DashboardComponent } from '../main-panel/pages/dashboard/dashboard.component';
import { GridViewComponent } from '../main-panel/shared/components/data-display/grid-view/grid-view.component';
import { ListViewComponent } from '../main-panel/shared/components/data-display/list-view/list-view.component';
import { PanelViewComponent } from '../main-panel/shared/components/data-display/panel-view/panel-view.component';
import { MultiViewComponent } from '../main-panel/shared/components/data-display/multi-view/multi-view.component';
import { HtmlBlockComponent } from '../main-panel/shared/components/data-display/html-block/html-block.component';
import { TemplateViewComponent } from '../main-panel/shared/components/data-display/template-view/template-view.component';
import { WebComponentComponent } from '../main-panel/shared/components/data-display/web-component/web-component.component';
import { ModelViewComponent } from '../main-panel/shared/components/data-display/model-view/model-view.component';
import { ModelFieldComponent } from '../main-panel/shared/components/data-display/model-field/model-field.component';
import { PreComponentComponent } from '../main-panel/shared/components/data-display/pre-component/pre-component.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'grid-view', component: GridViewComponent },
      { path: 'list-view', component: ListViewComponent },
      { path: 'panel-view', component: PanelViewComponent },
      { path: 'multi-view', component: MultiViewComponent },

      { path: 'html-block', component: HtmlBlockComponent },
      { path: 'template', component: TemplateViewComponent },
      { path: 'web-component', component: WebComponentComponent },
      { path: 'models', component: ModelViewComponent },

      { path: 'form-builder', component: MultiViewComponent },
      { path: 'mode-fields', component: ModelFieldComponent },
      { path: 'pre-component', component: PreComponentComponent },

      { path: 'setting', component: MultiViewComponent },
    ]
  }

];

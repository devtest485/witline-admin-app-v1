import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentBehaviorService } from './component-behavior.service';
import { ComponentContext } from '../interfaces/interfaces';
import { UIComponent } from '../enums/uicomponent';
import { DataDisplay } from '../enums/data-display';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  constructor(
    private http: HttpClient,
    private componentService: ComponentBehaviorService
  ) { }

  // Your existing API calls can now return ComponentContext
  async getReportsData(): Promise<ComponentContext> {
    const data: any = await this.http.get<any[]>('/api/reports').toPromise();

    return this.componentService.renderComponent(
      UIComponent.NewComponent,
      DataDisplay.GridView,
      { categoryId: 'reports', apiEndpoint: '/api/reports' },
      data
    );
  }

  async getUserFormContext(): Promise<ComponentContext> {
    const schema = await this.http.get<any>('/api/user-form-schema').toPromise();

    return this.componentService.renderComponent(
      UIComponent.Popup,
      DataDisplay.Model,
      { categoryId: 'user-form', schema },
      []
    );
  }
}

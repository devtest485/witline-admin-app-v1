import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebComponentService {

  getWebComponentsCardModel(categoryLocator: any, useCache: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!categoryLocator) {
        reject('Category locator is required to fetch web components');
      }

      // Simulate an asynchronous operation to fetch web components
      setTimeout(() => {
        const webComponents = this.generateWebComponents(categoryLocator);
        resolve(webComponents);
      }, 1000);
    });
  }

  private generateWebComponents(categoryLocator: any): any[] {
    // This is a placeholder for actual logic to generate web components based on the category locator
    return [
      {
        id: 'webComponent1',
        name: 'Web Component 1',
        description: 'Description for Web Component 1',
        type: 'type1'
      },
      {
        id: 'webComponent2',
        name: 'Web Component 2',
        description: 'Description for Web Component 2',
        type: 'type2'
      }
    ];
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlBlockService {

  getHtmlBlockTemplate(sortedData: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!sortedData || sortedData.length === 0) {
        reject('No data available to generate HTML block');
      }

      // Simulate an asynchronous operation to fetch HTML content
      setTimeout(() => {
        const htmlContent = this.generateHtmlContent(sortedData);
        resolve(htmlContent);
      }, 1000);
    });

  }
  private generateHtmlContent(data: any[]): string {
    return `
      <div class="tw-space-y-4">
        ${data.map(item => `
          <div class="tw-border tw-border-gray-200 tw-p-4 tw-rounded">
            <h3 class="tw-font-medium">${item.title || item.name || 'Item'}</h3>
            <p class="tw-text-gray-600">${item.description || 'No description'}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

}

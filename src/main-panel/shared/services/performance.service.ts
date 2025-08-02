import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private performanceConfig = {
    enableVirtualScrolling: true,
    enableLazyLoading: true,
    enableMemoization: true,
    chunkSize: 50,
    debounceTime: 300
  };

  constructor() { }

  optimizeDataLoading<T>(data: T[], chunkSize?: number): Observable<T[]> {
    const size = chunkSize || this.performanceConfig.chunkSize;

    return new Observable(observer => {
      let index = 0;

      const loadChunk = () => {
        const chunk = data.slice(index, index + size);
        if (chunk.length > 0) {
          observer.next(chunk);
          index += size;

          // Load next chunk asynchronously
          setTimeout(loadChunk, 0);
        } else {
          observer.complete();
        }
      };

      loadChunk();
    });
  }

  debounceSearch(searchFn: Function, delay?: number): Function {
    const debounceTime = delay || this.performanceConfig.debounceTime;
    let timeoutId: any;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => searchFn.apply(this, args), debounceTime);
    };
  }

  memoize<T>(fn: Function): Function {
    if (!this.performanceConfig.enableMemoization) {
      return fn;
    }

    const cache = new Map();

    return (...args: any[]) => {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = fn.apply(this, args);
      cache.set(key, result);

      return result;
    };
  }

  enableVirtualScrolling(): boolean {
    return this.performanceConfig.enableVirtualScrolling;
  }

  trackByFunction(index: number, item: any): any {
    return item.id || item.name || index;
  }
}
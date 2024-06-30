import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageClient {
  constructor() {
  }

  saveToSession<T>(name: string, value: T): void {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  }

  getFromSession<T>(name: string, defaultValue: T): T {
    try {
      const value: string = window.sessionStorage.getItem(name) ?? '';

      if (value) {
        return JSON.parse(value) as T;
      } else {
        return defaultValue;
      }
    } catch (error: unknown) {
      return defaultValue;
    }
  }

  removeFromSession(name: string): void {
    window.sessionStorage.removeItem(name);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageClient {
  hasInSession(name: string): boolean {
    try {
      const value: string = window.sessionStorage.getItem(name) ?? '';

      return !!value;
    } catch (error: unknown) {
      return false;
    }
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

  saveToSession<T>(name: string, value: T): void {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  }

  removeFromSession(name: string): void {
    window.sessionStorage.removeItem(name);
  }

  hasInLocal(name: string): boolean {
    try {
      const value: string = window.localStorage.getItem(name) ?? '';

      return !!value;
    } catch (error: unknown) {
      return false;
    }
  }

  getFromLocal<T>(name: string, defaultValue: T): T {
    try {
      const value: string = window.localStorage.getItem(name) ?? '';

      if (value) {
        return JSON.parse(value) as T;
      } else {
        return defaultValue;
      }
    } catch (error: unknown) {
      return defaultValue;
    }
  }

  saveToLocal<T>(name: string, value: T): void {
    window.localStorage.setItem(name, JSON.stringify(value));
  }

  removeFromLocal(name: string): void {
    window.localStorage.removeItem(name);
  }
}

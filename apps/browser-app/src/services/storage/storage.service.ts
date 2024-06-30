import { Injectable } from '@angular/core';
import { StorageClient } from '../../clients/storage.client';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private storage: StorageClient
  ) {
  }

  saveToSession<T>(name: string, value: T): void {
    return this.storage.saveToSession<T>(name, value);
  }

  getFromSession<T>(name: string, defaultValue: T): T {
    return this.storage.getFromSession<T>(name, defaultValue);
  }

  removeFromSession(name: string): void {
    return this.storage.removeFromSession(name);
  }
}

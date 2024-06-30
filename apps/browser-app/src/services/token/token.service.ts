import { Injectable } from '@angular/core';
import { filter, fromEvent, map, merge, Observable, Subject } from 'rxjs';
import { StorageClient } from '../../clients/storage/storage.client';
import { ACCESS_TOKEN } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly _isAuthenticated$: Subject<boolean>;

  constructor(
    private storage: StorageClient
  ) {
    this._isAuthenticated$ = new Subject<boolean>();
    this._isAuthenticated$.next(this.storage.hasInLocal(ACCESS_TOKEN));
  }

  get isAuthenticated$(): Observable<boolean> {
    const intrinsic: Observable<boolean> = this._isAuthenticated$.asObservable();
    const extrinsic: Observable<boolean> = fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event: StorageEvent): boolean => event.storageArea === localStorage),
        filter((event: StorageEvent): boolean => event.key === ACCESS_TOKEN),
        map((event: StorageEvent): boolean => (event.newValue || '') !== '')
      );

    return merge(intrinsic, extrinsic);
  }

  get isAuthenticated(): boolean {
    return this.storage.hasInLocal(ACCESS_TOKEN);
  }

  saveToken(token: string): void {
    this.storage.saveToLocal(ACCESS_TOKEN, token);
    this._isAuthenticated$.next(true);
  }

  removeToken(): void {
    this.storage.removeFromLocal(ACCESS_TOKEN);
    this._isAuthenticated$.next(false);
  }
}

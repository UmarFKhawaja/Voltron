import { Injectable } from '@angular/core';
import { filter, fromEvent, map, merge, Observable, Subject } from 'rxjs';
import { constants } from '../../app/app.constants';
import { StorageClient } from '../../clients/storage/storage.client';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly _isAuthenticated$: Subject<boolean>;

  constructor(
    private storage: StorageClient
  ) {
    this._isAuthenticated$ = new Subject<boolean>();
    this._isAuthenticated$.next(this.storage.hasInLocal(constants.ACCESS_TOKEN));
  }

  get isAuthenticated$(): Observable<boolean> {
    const intrinsic: Observable<boolean> = this._isAuthenticated$.asObservable();
    const extrinsic: Observable<boolean> = fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event: StorageEvent): boolean => event.storageArea === localStorage),
        filter((event: StorageEvent): boolean => event.key === constants.ACCESS_TOKEN),
        map((event: StorageEvent): boolean => (event.newValue || '') !== '')
      );

    return merge(intrinsic, extrinsic);
  }

  get isAuthenticated(): boolean {
    return this.storage.hasInLocal(constants.ACCESS_TOKEN);
  }

  saveToken(token: string): void {
    this.storage.saveToLocal(constants.ACCESS_TOKEN, token);
    this._isAuthenticated$.next(true);
  }

  removeToken(): void {
    this.storage.removeFromLocal(constants.ACCESS_TOKEN);
    this._isAuthenticated$.next(false);
  }
}

import { Injectable } from '@angular/core';
import { Session } from '@voltron/common-library';
import { jwtDecode as decode } from 'jwt-decode';
import { filter, fromEvent, map, merge, Observable, Subject } from 'rxjs';
import { constants } from '../../app/app.constants';
import { StorageClient } from '../../clients/storage/storage.client';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly _token$: Subject<string>;

  constructor(
    private storage: StorageClient
  ) {
    this._token$ = new Subject<string>();
    this._token$.next(this.storage.getFromLocal(constants.TOKEN, ''));
  }

  private get token$(): Observable<string> {
    const intrinsic: Observable<string> = this._token$.asObservable();
    const extrinsic: Observable<string> = fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event: StorageEvent): boolean => event.storageArea === localStorage),
        filter((event: StorageEvent): boolean => event.key === constants.TOKEN),
        map((event: StorageEvent): string => (event.newValue || ''))
      );

    return merge(intrinsic, extrinsic);
  }

  get token(): string {
    return this.storage.getFromLocal<string>(constants.TOKEN, '');
  }

  get isAuthenticated(): boolean {
    const token: string = this.storage.getFromLocal<string>(constants.TOKEN, '');

    return !!token;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.token$
      .pipe(
        map((token: string): boolean => {
          return token !== '';
        })
      );
  }

  get session(): Session | null {
    const token: string = this.storage.getFromLocal<string>(constants.TOKEN, '');

    if (!token) {
      return null;
    }

    return decode<Session>(token);
  }

  get session$(): Observable<Session | null> {
    return this.token$
      .pipe(
        map((token: string): Session | null => {
          if (token) {
            return decode<Session>(token);
          } else {
            return null;
          }
        })
      );
  }

  saveToken(token: string): void {
    this.storage.saveToLocal(constants.TOKEN, token);
    this._token$.next(token);
  }

  removeToken(): void {
    this.storage.removeFromLocal(constants.TOKEN);
    this._token$.next('');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result, Token } from '@voltron/common-library';
import { catchError, EMPTY, of, tap } from 'rxjs';
import { StorageClient } from '../../clients/storage.client';
import { ACCESS_TOKEN } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private storage: StorageClient
  ) {
  }

  async register(displayName: string, userName: string, emailAddress: string, password: string) {
    return this.http.post<Result<void>>('/api/auth/register', {
      displayName,
      userName,
      emailAddress,
      password
    }).pipe(
      tap((result: Result<void>) => {
      }),
      catchError((error: unknown) => of<Result<void>>({
        success: false,
        error: error as Error
      }))
    );
  }

  async loginWithPassword(username: string, password: string) {
    return this.http.post<Result<Token>>('/api/auth/login/password', {
      username,
      password
    })
      .pipe(
        tap((result: Result<Token>) => {
          if (result.success) {
            const { access_token: accessToken } = result.data;

            this.storage.saveToSession(ACCESS_TOKEN, accessToken);
          }
        }),
        catchError((error: unknown) => of<Result<Token>>({
          success: false,
          error: error as Error
        }))
      );
  }

  async loginWithMagicLogin(username: string) {
    return this.http.post<Result<void>>('/api/auth/login/magic-login', {
      destination: username
    })
      .pipe(
        tap((result: Result<void>) => {
        }),
        catchError((error: unknown) => of<Result<void>>({
          success: false,
          error: error as Error
        }))
      );
  }

  async logout() {
    this.storage.removeFromSession(ACCESS_TOKEN);

    return EMPTY;
  }
}

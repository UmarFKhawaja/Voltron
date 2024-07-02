import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result, Token, User } from '@voltron/common-library';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) {
  }

  async register(displayName: string, userName: string, emailAddress: string, password: string) {
    return this.http.post<Result<void>>('/api/auth/register', {
      displayName,
      userName,
      emailAddress,
      password
    });
  }

  async loginWithPassword(username: string, password: string) {
    return this.http.post<Result<Token>>('/api/auth/login/password', {
      username,
      password
    });
  }

  async loginWithMagicLogin(username: string) {
    return this.http.post<Result<void>>('/api/auth/login/magic-login', {
      destination: username
    });
  }

  async acceptMagicLogin(token: string) {
    return this.http.get<Result<Token>>('/api/auth/accept/magic-login', {
      params: {
        token
      }
    });
  }

  async logout() {
    return EMPTY;
  }

  async getProfile(token: string) {
    return this.http.get<User>('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

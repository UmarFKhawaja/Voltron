import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result, Token } from '@voltron/common-library';

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

  async activateAccount(activationCode: string) {
    return this.http.post<Result<Token>>('/api/auth/activate-account', {
      activationCode
    });
  }

  async requestActivationCode(username: string) {
    return this.http.post<Result<void>>('/api/auth/request-activation-code', {
      username
    });
  }

  async recoverAccount(username: string) {
    return this.http.post<Result<void>>('/api/auth/recover-account', {
      username
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

  async logout(token: string) {
    return this.http.post<Result<void>>('/api/auth/logout', {}, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async verifySession(token: string) {
    return this.http.get<Result<void>>('/api/auth/verify-session', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async updateProfile(token: string, displayName: string, userName: string) {
    return this.http.post<Result<Token>>('/api/auth/update-profile', {
      displayName,
      userName
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async resetPassword(token: string) {
    return this.http.get<Result<Token>>('/api/auth/reset-password', {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async changePassword(token: string, oldPassword: string, newPassword: string) {
    return this.http.post<Result<Token>>('/api/auth/change-password', {
      oldPassword,
      newPassword
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async setPassword(token: string, newPassword: string) {
    return this.http.post<Result<Token>>('/api/auth/set-password', {
      newPassword
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async unsetPassword(token: string, oldPassword: string) {
    return this.http.post<Result<Token>>('/api/auth/unset-password', {
      oldPassword
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }
}

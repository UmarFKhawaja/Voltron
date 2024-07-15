import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Information, Result, Token } from '@voltron/common-library';

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

  async disconnectFacebook(token: string) {
    return this.http.get<Result<Token>>('/api/auth/disconnect/facebook', {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async disconnectGoogle(token: string) {
    return this.http.get<Result<Token>>('/api/auth/disconnect/google', {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
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
    return this.http.get<Result<boolean>>('/api/auth/verify-session', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async getInformation(token: string) {
    return this.http.get<Result<Information>>('/api/auth/get-information', {
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

  async startEmailAddressChange(token: string, emailAddress: string) {
    return this.http.post<Result<Information>>('/api/auth/start-email-address-change', {
      emailAddress
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async confirmEmailAddressChange(token: string, confirmationCode: string) {
    return this.http.post<Result<Information>>('/api/auth/confirm-email-address-change', {
      confirmationCode
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async completeEmailAddressChange(token: string, confirmationCode: string) {
    return this.http.post<Result<Token>>('/api/auth/complete-email-address-change', {
      confirmationCode
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async cancelEmailAddressChange(token: string, confirmationCode: string) {
    return this.http.post<Result<Information>>('/api/auth/cancel-email-address-change', {
      confirmationCode
    }, {
      ...(token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {})
    });
  }

  async resendEmailAddressChange(token: string) {
    return this.http.post<Result<Information>>('/api/auth/resend-email-address-change', {
    }, {
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

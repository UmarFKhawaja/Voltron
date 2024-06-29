import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) {
  }

  async register(emailAddress: string, userName: string, password: string) {
    console.log(emailAddress, userName, password);
  }

  async login(username: string, password: string) {
    console.log(username, password);
  }

  async logout() {
  }
}

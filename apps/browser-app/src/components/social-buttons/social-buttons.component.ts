import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Session } from '@voltron/common-library';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './social-buttons.component.html',
  styleUrl: './social-buttons.component.scss'
})
export class SocialButtonsComponent implements OnInit, OnDestroy {
  @Input()
  mode: 'login' | 'link' = 'login';

  private _isAuthenticated: boolean = false;

  private _isAuthenticated$: Subscription = new Subscription();

  private _session: Session | null = null;

  private _session$: Subscription = new Subscription();

  constructor(
    private readonly tokenService: TokenService
  ) {
    this._isAuthenticated = this.tokenService.hasToken;
    this._session = this.tokenService.session;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get session(): Session | null {
    return this._session;
  }

  get facebookLink(): string {
    const action: string = this.mode === 'login'
      ? 'login'
      : this.session?.accounts?.social.facebook
        ? 'disconnect'
        : 'connect';

    return `/app/${action}/facebook`;
  }

  get facebookLabel(): string {
    return this.mode === 'login'
      ? 'Continue with Facebook'
      : this.session?.accounts?.social.facebook
        ? 'Disconnect from Facebook'
        : 'Connect with Facebook';
  }

  get googleLink(): string {
    const action: string = this.mode === 'login'
      ? 'login'
      : this.session?.accounts?.social.google
        ? 'disconnect'
        : 'connect';

    return `/app/${action}/google`;
  }

  get googleLabel(): string {
    return this.mode === 'login'
      ? 'Continue with Google'
      : this.session?.accounts?.social.google
        ? 'Disconnect from Google'
        : 'Connect with Google';
  }

  ngOnInit(): void {
    this._isAuthenticated$ = this.tokenService.hasToken$.subscribe((isAuthenticated: boolean): void => {
      this._isAuthenticated = isAuthenticated;
    });
    this._session$ = this.tokenService.session$.subscribe((session: Session | null): void => {
      this._session = session;
    });
  }

  ngOnDestroy(): void {
    this._isAuthenticated$.unsubscribe();
    this._session$.unsubscribe();
  }
}

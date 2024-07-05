import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Session } from '@voltron/common-library';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
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
    this._isAuthenticated = this.tokenService.isAuthenticated;
    this._session = this.tokenService.session;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get session(): Session | null {
    return this._session;
  }

  get githubLink(): string {
    const action: string = this.mode === 'login'
      ? 'login'
      : this.session?.accounts?.social.github
        ? 'disconnect'
        : 'connect';

    return `/app/${action}/github`;
  }

  get githubLabel(): string {
    return this.mode === 'login'
      ? 'Continue'
      : this.session?.accounts?.social.github
        ? 'Disconnect'
        : 'Connect';
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
      ? 'Continue'
      : this.session?.accounts?.social.google
        ? 'Disconnect'
        : 'Connect';
  }

  ngOnInit(): void {
    this._isAuthenticated$ = this.tokenService.isAuthenticated$.subscribe((isAuthenticated: boolean): void => {
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

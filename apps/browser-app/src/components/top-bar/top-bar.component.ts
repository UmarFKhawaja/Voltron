import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { User } from '@voltron/common-library';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme/theme.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit, OnDestroy {
  private readonly _title: string = 'Voltron';

  private _isAuthenticated: boolean = false;

  private _isAuthenticated$: Subscription = new Subscription();

  private _user: User | null = null;

  private _user$: Subscription = new Subscription();

  constructor(
    private readonly themeService: ThemeService,
    private readonly tokenService: TokenService
  ) {
    this._isAuthenticated = this.tokenService.isAuthenticated;
    this._user = this.tokenService.user;
  }

  get title(): string {
    return this._title;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get user(): User | null {
    return this._user;
  }

  ngOnInit(): void {
    this._isAuthenticated$ = this.tokenService.isAuthenticated$.subscribe((isAuthenticated: boolean): void => {
      this._isAuthenticated = isAuthenticated;
    });
    this._user$ = this.tokenService.user$.subscribe((user: User | null): void => {
      this._user = user;
    });
  }

  ngOnDestroy(): void {
    this._isAuthenticated$.unsubscribe();
    this._user$.unsubscribe();
  }

  onSwitchTheme(): void {
    this.themeService.switchTheme();
  }
}

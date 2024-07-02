import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme/theme.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  private readonly _title: string = 'Voltron';

  private _isAuthenticated: boolean = false;

  private _isAuthenticated$: Subscription = new Subscription();

  constructor(
    private readonly themeService: ThemeService,
    private readonly tokenService: TokenService
  ) {
    this._isAuthenticated = this.tokenService.isAuthenticated;
  }

  get title(): string {
    return this._title;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  ngOnInit(): void {
    this._isAuthenticated$ = this.tokenService.isAuthenticated$.subscribe((isAuthenticated: boolean): void => {
      this._isAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this._isAuthenticated$.unsubscribe();
  }

  onSwitchTheme(): void {
    this.themeService.switchTheme();
  }
}

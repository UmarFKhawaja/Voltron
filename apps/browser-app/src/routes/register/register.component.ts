import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    RegisterFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private _isAuthenticated$: Subscription = new Subscription();

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.tokenService.isAuthenticated) {
      await this.routeService.navigate([''], {});
    }

    this._isAuthenticated$ = this.tokenService.isAuthenticated$.subscribe(async (isAuthenticated: boolean): Promise<void> => {
      if (isAuthenticated) {
        await this.routeService.navigate([''], {});
      }
    });
  }

  ngOnDestroy(): void {
    this._isAuthenticated$.unsubscribe();
  }
}

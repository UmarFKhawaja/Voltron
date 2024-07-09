import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
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
    RouterModule,
    MatButtonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    DividerComponent,
    RegisterFormComponent,
    FormsModule
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private _hasToken$: Subscription = new Subscription();

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.tokenService.hasToken) {
      await this.routeService.navigate([''], {});
    }

    this._hasToken$ = this.tokenService.hasToken$.subscribe(async (isAuthenticated: boolean): Promise<void> => {
      if (isAuthenticated) {
        await this.routeService.navigate([''], {});
      }
    });
  }

  ngOnDestroy(): void {
    this._hasToken$.unsubscribe();
  }
}

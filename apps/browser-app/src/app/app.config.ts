import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';

export const config: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch()
    ),
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideAnimationsAsync(),
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
    },
    provideMarkdown(),
    provideRouter(routes)
  ]
};

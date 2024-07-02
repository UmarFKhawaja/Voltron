import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config';
import { RootComponent } from './root/root.component';

bootstrapApplication(RootComponent, config)
  .catch((error) => console.error(error));

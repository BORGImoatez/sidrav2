import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {DatePipe} from "@angular/common";

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule)
  ]
}).catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app/app.component';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routes';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { HttpErrorInterceptor } from './app/interceptors/http-error.interceptor';

registerLocaleData(localeDe);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'de' }, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
});

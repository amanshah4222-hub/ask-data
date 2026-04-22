import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAuth0, AuthHttpInterceptor } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    provideAuth0({
      domain: 'dev-0bbgpca7z0e58380.uk.auth0.com',
      clientId: 'sBPwU8LAqmCFQMOA1aXSwNAkclWqfo03',
      authorizationParams: {
        redirect_uri: 'https://amanshah4222-hub.github.io/ask-data/',
      },

      // Keep this block commented until you create an Auth0 API
      // and want access tokens automatically attached to backend calls.
      /*
      httpInterceptor: {
        allowedList: [
          {
            uri: 'https://ask-data-7zej.onrender.com/*',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://askdata-api'
              }
            }
          }
        ]
      }
      */
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
};
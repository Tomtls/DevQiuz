import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthModalService } from './services/auth-modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const authModalService = inject(AuthModalService)

  if (!auth.isLoggedIn) {
    authModalService.triggerLoginRedirect(state.url);
    return false;
  }
  return true; 
};

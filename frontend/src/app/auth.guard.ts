import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthModalService } from './services/auth-modal.service';

// Route guard to check if the user is logged in
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const authModalService = inject(AuthModalService)

  // If not logged in, trigger login modal and block access
  if (!auth.isLoggedIn) {
    authModalService.triggerLoginRedirect(state.url);
    return false;
  }
  // Allow access
  return true; 
};

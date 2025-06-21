import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AuthPage } from '../auth/auth.page';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {

  //#region Observables

  // Emits the target redirect URL when login is requested externally
  private loginRequestedSubject = new Subject<string>();
  loginRequested$ = this.loginRequestedSubject.asObservable();

  //#endregion

  //#region Constructor
  
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private router: Router
  ) {}
  
  //#endregion

  //#region Public API

  /**
   * Emits a login redirect request with target URL.
   * Used by guards to trigger the modal flow.
   */
  triggerLoginRedirect(redirectUrl: string) {
    this.loginRequestedSubject.next(redirectUrl);
  }
  
  /**
   * Opens the Auth modal and optionally navigates to a redirect
   * URL if the user logs in successfully.
   *
   * @param authMode 'login' or 'register'
   * @param redirect The route to redirect to after login
   */
  async open(authMode: 'login' | 'register', redirect: string) {
    const modal = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode }
    });

    // When modal closes, check login status and navigate if logged in
    modal.onDidDismiss().then(() => {
      if (this.auth.isLoggedIn) {
        this.router.navigateByUrl(redirect || '/');
      }
    });
    await modal.present();
  }

  //#endregion
}

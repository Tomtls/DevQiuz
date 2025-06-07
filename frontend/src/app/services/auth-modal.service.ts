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
  private loginRequestedSubject = new Subject<string>();
  loginRequested$ = this.loginRequestedSubject.asObservable();
  
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private router: Router
  ) {}
  
  triggerLoginRedirect(redirectUrl: string) {
    this.loginRequestedSubject.next(redirectUrl);
  }
  
  async open(authMode: 'login' | 'register', redirect: string) {
    const modal = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode }
    });
    modal.onDidDismiss().then(() => {
      if (this.auth.isLoggedIn) {
        this.router.navigateByUrl(redirect || '/');
      }
    });
    await modal.present();
  }
}

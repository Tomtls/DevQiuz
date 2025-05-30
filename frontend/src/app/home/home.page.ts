import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthPage } from '../auth/auth.page';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class HomePage {
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);

  constructor() {}

  public get isLoggedIn(): boolean { return this.auth.isLoggedIn; }
  public logout() { this.auth.logout(); }

  //#region AuthPage
  public async openAuthModal(mode: 'login' | 'register' = 'login'){
    const modelAuth = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: mode }
    });
    await modelAuth.present();
  }
  //#endregion

}
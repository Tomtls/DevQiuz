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

  //#region Dependencies

  private modalCtrl = inject(ModalController);  // Controls modals (login/register)
  private auth = inject(AuthService);           // Injects auth state and methods

  //#endregion

  //#region Constructor

  constructor() {}

  //#endregion

  //#region Properties

  /**
   * Navigation links for the home screen cards.
   */
  public navLinks = [
    {
      icon: 'clipboard-outline',
      label: 'Fragen zu IT, Web & Programmierung',
      route: '/quiz'
    },
    {
      icon: 'add-circle-outline',
      label: 'Eigene Quizfragen erstellen',
      route: '/create-quiz'
    },
    {
      icon: 'bar-chart-outline',
      label: 'Highscore & Punkte sammeln',
      route: '/highscore'
    },
  ];
  
  //#endregion

  //#region Public Methods

  /**
   * Returns whether a user is currently logged in.
   */
  public get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  /**
   * Logs the user out and resets auth state.
   */
  public logout() { this.auth.logout(); }

  //#endregion

  //#region Modal Handling

  /**
   * Opens the authentication modal for login or registration.
   * @param mode 'login' or 'register'
   */
  public async openAuthModal(mode: 'login' | 'register' = 'login'){
    const modelAuth = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: mode }
    });
    await modelAuth.present();
  }

  //#endregion
}
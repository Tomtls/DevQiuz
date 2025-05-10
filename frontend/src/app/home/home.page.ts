import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthPage } from '../auth/auth.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, RouterModule],
})
export class HomePage {
  private modalCtrl = inject(ModalController);

  constructor() {}

  public startDemoQuiz(){
    console.log("home.page.ts: startDemoQiuz(): Die Methode fehlt")
  }

  //#region Auth
  public async openAuthModal(mode: 'login' | 'register' = 'login'){
    const modelAuth = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: mode }
    });
    await modelAuth.present();
  }
  //#endregion

}
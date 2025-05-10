import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthPage } from './auth/auth.page';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);

  public isLoggedIn = false;

  constructor(){
    this.checkLoginStatus();
  }

  checkLoginStatus(){
    this.isLoggedIn = this.auth.isLoggedIn();
  }
  
  public async openAuthModal(mode: 'login' | 'register' = 'login'){
    const modalAuth = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: mode },
    });
    modalAuth.onDidDismiss().then(() => this.checkLoginStatus());
    await modalAuth.present();
  }
  
  logout() {
    this.auth.logout();
    this.checkLoginStatus();
  }
}

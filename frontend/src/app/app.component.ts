import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthPage } from './auth/auth.page';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);

  constructor() { }

  get isAdmin(): boolean { return this.auth.isAdmin; }
  get adminMode(): boolean { return this.auth.adminMode; }
  get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  public toggleAdminMode(): void { this.auth.adminMode = !this.auth.adminMode; }

  public async openAuthModal(mode: 'login' | 'register' = 'login'){
    const modalAuth = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: mode },
    });
    modalAuth.onDidDismiss();
    await modalAuth.present();
  }

  logout() { this.auth.logout(); }

}

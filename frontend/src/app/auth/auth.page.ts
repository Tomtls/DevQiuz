import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule]
})
export class AuthPage implements OnInit {
  @Input() authMode: 'login' | 'register' = 'login'; // Standard: login 

  public username: string = '';
  public email: string = '';
  public password: string = '';
  public password2: string = '';

  constructor(private auth: AuthService, private http: HttpService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}
  
  ngOnInit() {}

  public toggleAuthMode() { this.authMode = this.authMode === 'login' ? 'register' : 'login'; }

  public submit() {
    if (this.authMode === 'login') { if(this.checkLogin()) this.handleLogin(); } 
    else { if(this.checkRegister()) this.handleRegister(); }
  }

  //#region Login/Register Aktionen
  private handleLogin() {
    this.http.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.auth.login(response.token);
          this.modalCtrl.dismiss({ success: true });
        } else this.showToast('Login fehlgeschlagen')  
      },
      error: (err) => { console.error(err); }
    });
  }

  private handleRegister() {
    this.http.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        if(response.success){
          this.auth.login(response.token);
          this.modalCtrl.dismiss({ success: true });
        } else this.showToast('Registrieren fehlgeschlagen')
      },
      error: (err) => { console.error(err); }
    });
  }
  //#endregion

  //#region  Validierung
  private checkLogin(){
    // Leerer Username
    if (!this.validateRequired(this.username,'Bitte Nutzernamen eingeben!')) return false;

    // Leeres Passwort
    if (!this.validateRequired(this.password,'Bitte Passwort eingeben!')) return false;

    return true;
  }

  private checkRegister(){
    if (!this.checkLogin()) return false;

    // Leere Email
    if (!this.validateRequired(this.email,'Bitte E-Mail-Adresse eingeben!')) return false;

    // Gültige Email
    if(!this.validate(this.isValidEmail(this.email), 'Ungültige E-Mail-Adresse!')) return false;

    // Passwort-Wiederholung
    if (!this.validate(this.password !== this.password2,'Passwörter stimmen nicht überein!')) return false;

    return true;
  }

  private validate(condition: boolean, message: string): boolean {
    if (!condition) {
      this.showToast(message);
      return false;
    }
    return true;
  }

  private validateRequired(value: string, message: string): boolean {
    return this.validate(value.trim().length > 0, message);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  //#endregion

  //#region Feedback
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color: 'danger' });
    await toast.present();
  }
  //#endregion
}

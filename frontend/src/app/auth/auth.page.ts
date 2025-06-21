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
export class AuthPage {

  //#region Properties

  @Input() authMode: 'login' | 'register' = 'login'; // Mode toggles between login and registration

  public username: string = '';
  public email: string = '';
  public password: string = '';
  public password2: string = '';

  //#endregion

  //#region Constructor

  constructor(private auth: AuthService, private http: HttpService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}
  
  //#endregion

  //#region Public Methods

  /** Toggles between login and register mode */
  public toggleAuthMode() { this.authMode = this.authMode === 'login' ? 'register' : 'login'; }

  /** Validates inputs and triggers login/register logic */
  public submit() {
    if (this.authMode === 'login') { if(this.checkLogin()) this.handleLogin(); } 
    else { if(this.checkRegister()) this.handleRegister(); }
  }

  //#endregion

  //#region Private Methods: Login/Register Logic

  /** Handles login HTTP request and state update */
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

  /** Handles registration HTTP request and state update */
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

  //#region  Private Methods: Input Validation

  /** Validates login form */
  private checkLogin(){
    // Empty Username
    if (!this.validateRequired(this.username,'Bitte Nutzernamen eingeben!')) return false;

    // Empty Password
    if (!this.validateRequired(this.password,'Bitte Passwort eingeben!')) return false;

    return true;
  }

  /** Validates registration form */
  private checkRegister(){
    if (!this.checkLogin()) return false;

    // Empty Email
    if (!this.validateRequired(this.email,'Bitte E-Mail-Adresse eingeben!')) return false;

    // Valid Email
    if(!this.validate(this.isValidEmail(this.email), 'Ungültige E-Mail-Adresse!')) return false;

    // Password-repetition
    if (!this.validate(this.password === this.password2,'Passwörter stimmen nicht überein!')) return false;

    return true;
  }

  /** Shows validation error if condition fails */
  private validate(condition: boolean, message: string): boolean {
    if (!condition) {
      this.showToast(message);
      return false;
    }
    return true;
  }

  /** Checks that required value is present */
  private validateRequired(value: string, message: string): boolean {
    return this.validate(value.trim().length > 0, message);
  }

  /** Regex-based email format validation */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  //#endregion

  //#region Private Methods: UI Feedback

  /** Shows error toast */
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color: 'danger' });
    await toast.present();
  }
  
  //#endregion
}

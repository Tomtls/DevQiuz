import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(private auth: AuthService, private modalCtrl: ModalController) {}
  
  ngOnInit() {}

  public toggleAuthMode() { this.authMode = this.authMode === 'login' ? 'register' : 'login'; }

  public submit() {
    if (this.authMode === 'login') { this.handleLogin(); } 
    else { this.handleRegister(); }
  }

  private handleLogin() {
    if(!this.eingabeCheck()) { return; }
    // backend methode fehlt 
    const dummyToken = 'demo-token-123'
    this.auth.login(dummyToken);
    this.modalCtrl.dismiss();
  }

  private handleRegister() {
    if (this.password !== this.password2) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }
    if(!this.eingabeCheck()) { return; }
    // backend methode fehlt 
    const dummyToken = 'demo-token-123'
    this.auth.login(dummyToken);
    this.modalCtrl.dismiss();
  }

  private eingabeCheck(): boolean{
    if (!this.username?.trim()){
      alert('Nutzernamen eingeben!');
      return false;
    }
    if (!this.password?.trim()) {
      alert('Passwort eingeben!');
      return false;
    }
    if (this.authMode === 'register'){
      if (!this.email?.trim()) {
        // weitere Kontrolle fehlt 
        alert('email eingeben!');
        return false;
      }
      if (!this.password2?.trim()){
        alert('Passwort eingeben!');
        return false;
      }
    }
    return true;
  }
}

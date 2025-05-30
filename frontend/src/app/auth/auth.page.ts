import { Component, Input, OnInit, resolveForwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
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

  constructor(private auth: AuthService, private http: HttpService, private modalCtrl: ModalController) {}
  
  ngOnInit() {}

  public toggleAuthMode() { this.authMode = this.authMode === 'login' ? 'register' : 'login'; }

  public submit() {
    if (this.authMode === 'login') { this.handleLogin(); } 
    else { this.handleRegister(); }
  }

  private handleLogin() {
    if(!this.eingabeCheck()) { return; }

    this.http.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        const token = response.token;
        const userId = response.user_id.toString();
        const isAdmin = response.is_admin.valueOf();
        this.auth.login(token, userId, isAdmin);
        this.modalCtrl.dismiss({ success: true });
      }
    });
  }

  private handleRegister() {
    if(!this.eingabeCheck()) { return; }

    this.http.register(this.username, this.email, this.password).subscribe(response => {
      if(response.success){
        const token = response.token;
        const userId = response.user_id.toString();
        this.auth.login(token, userId);
        this.modalCtrl.dismiss({ success: true });
      }
    });
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
      if (this.password !== this.password2) {
        alert('Passwörter stimmen nicht überein!');
        return false;
      }
    }
    return true;
  }
}

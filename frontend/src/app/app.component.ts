import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthModalService } from './services/auth-modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private authModalService = inject(AuthModalService);

  ngOnInit(){
    this.authModalService.loginRequested$.subscribe(redirectUrl => {
      this.authModalService.open('login', redirectUrl);
    });
  }

  get isAdmin(): boolean { return this.auth.isAdmin; }
  get adminMode(): boolean { return this.auth.adminMode; }
  get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  public openAuthModal() { this.authModalService.open('login', '/'); }
  public toggleAdminMode(): void { this.auth.adminMode = !this.auth.adminMode; }
  public logout() { this.auth.logout(); }
}

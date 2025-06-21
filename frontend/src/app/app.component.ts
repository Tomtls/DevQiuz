import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
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
  // Inject services using Angular's `inject` function
  private auth = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private router = inject(Router)

  //#region Lifecycle

  ngOnInit(){
    this.authModalService.loginRequested$.subscribe(redirectUrl => {
      this.authModalService.open('login', redirectUrl);
    });
  }

  //#endregion

  //#region Getters

  // Expose auth state to the template
  get isAdmin(): boolean { return this.auth.isAdmin; }
  get adminMode(): boolean { return this.auth.adminMode; }
  get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  //#endregion

  //#region Public Methods

  // Opens the login modal and passes current route for redirect after login
  public openAuthModal() { this.authModalService.open('login', this.router.url); }

  // Toggles admin mode flag
  public toggleAdminMode(): void { this.auth.adminMode = !this.auth.adminMode; }

  // Logs the user out via AuthService
  public logout() { this.auth.logout(); }

  //#endregion
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private TOKEN_KEY = 'auth_token';
  private USER_ID = 'user_id';

  private _isAdmin: boolean = false; // ist der User admin Berechtigungen?
  private _adminMode: boolean = false;   // ist Admin Modus aktiv?

  public login(token: string, userId: string, isAdmin: boolean = false) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_ID, userId)

    this._isAdmin = isAdmin;
    // Optional: localStorage/sessionStorage speichern
  }

  public logout() {
    localStorage.clear();
    this._isAdmin = this._adminMode = false;
    // Optional: localStorage/sessionStorage löschen
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get Token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  get UserId(): number | null {
    const id = localStorage.getItem(this.USER_ID);
    return id !== null ? Number(id) : null;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }
  
  get adminMode(): boolean {
    return this._adminMode;
  }

  set adminMode(adminMode: boolean) {
    this._adminMode = adminMode;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private TOKEN_KEY = 'jwt-token';
  private USER_ID = 'user_id';

  private _isAdmin: boolean = false;    // ist der User Admin / hat er Berechtigungen?
  private _adminMode: boolean = false;  // ist Admin Modus aktiv?

  constructor() {
    if (this.Token) {
      const payload = this.parseJwt(this.Token);
      this._isAdmin = payload?.is_admin || false;
    }
  }

  public login(token: string, userId: string, isAdmin: boolean = false) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_ID, userId)
    this._isAdmin = isAdmin;
  }

  public logout() {
    localStorage.clear();
    this._isAdmin = this._adminMode = false;
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

  private parseJwt(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) { return null; }
  }

}

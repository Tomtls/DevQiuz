import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private userId: String | null = null; // User ID als number
  private adminStatus: boolean = false;

  login(token: string, userId: String, isAdmin: boolean = false) {
    this.token = token;
    this.userId = userId;
    this.adminStatus = isAdmin;
    // Optional: localStorage/sessionStorage speichern
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.adminStatus = false;
    // Optional: localStorage/sessionStorage löschen
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getUserId(): String | null {
    return this.userId;
  }

  isAdmin(): boolean {
    return this.adminStatus;
  }
}

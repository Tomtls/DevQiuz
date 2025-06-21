import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpService } from './http.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //#region Constants and State

  private readonly TOKEN_KEY = 'jwt-token';   // LocalStorage key for JWT

  private _isAdmin: boolean = false;    // Tracks if user has admin privileges
  private _adminMode: boolean = false;  // Controls if admin mode is toggled

  //#endregion

  //#region Constructor

  constructor(private router: Router, private http: HttpService) {
    // Parse and set admin status on service initialization
    const payload = this.parseJwt(this.token);
    this._isAdmin = payload?.is_admin || false;
  }

  //#endregion

  //#region Public API

  /**
   * Saves JWT to localStorage and extracts user role from it.
   */
  public login(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const payload = this.parseJwt(token);
    this._isAdmin = payload?.is_admin || false;
  }

  /**
   * Clears JWT, resets state, and performs redirect if needed.
   */
  public logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isAdmin = this._adminMode = false;
    
    const currentSnapshot = this.router.routerState.snapshot.root;
    const activeChild = this.getDeepestChild(currentSnapshot);
    const isProtected = activeChild.data?.['protected'];
    const url = this.router.url;

    // Special handling: if leaving a quiz-view route, redirect unless it's a demo
    if (url.startsWith('/quiz-view/')){
      const quizId = activeChild.params?.['id'];
      if (quizId) this.http.isDemoQuiz(quizId).pipe(take(1)).subscribe(
        isDemo => { if(!isDemo) this.router.navigate(['/quiz'])},
      )
    }
    // Fallback redirect if page was protected
    else if (isProtected) { this.router.navigate(['/home']); }
  }

  //#endregion

  //#region Getters / Setters

  /** Returns true if a valid token exists */
  get isLoggedIn(): boolean {
    return !!this.token;
  }

  /** Returns raw JWT token string from localStorage */
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /** Returns user ID parsed from the token */
  get userId(): number | null {
    const payload = this.parseJwt(this.token);
    return payload?.user_id ?? null;
  }

  /** Returns username parsed from the token */
  get username(): string | null {
    const payload = this.parseJwt(this.token);
    return payload?.username || null;
  }

  /** Returns true if user is an admin */
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  /** Getter for admin mode */
  get adminMode(): boolean {
    return this._adminMode;
  }

  /** Setter for admin mode */
  set adminMode(value: boolean) {
    this._adminMode = value;
  }

  //#endregion

  //#region Helpers
  
  /**
   * Decodes a JWT token and returns the payload object.
   * Returns null on failure.
   */
  private parseJwt(token: string | null): any {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if(parts.length != 3) return null;
      const base64Payload = parts[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT konnte nicht gelesen werden:', e);
      return null;
    }
  }

  /**
   * Utility to recursively get the deepest activated route snapshot.
   */
  private getDeepestChild(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (snapshot.firstChild) { snapshot = snapshot.firstChild; }
    return snapshot;
  }

  //#endregion
}

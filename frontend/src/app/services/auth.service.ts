import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpService } from './http.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt-token';

  private _isAdmin: boolean = false;    // ist der User Admin / hat er Berechtigungen?
  private _adminMode: boolean = false;  // ist Admin Modus aktiv?

  constructor(private router: Router, private http: HttpService) {
    const payload = this.parseJwt(this.token);
    this._isAdmin = payload?.is_admin || false;
  }

  public login(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const payload = this.parseJwt(token);
    this._isAdmin = payload?.is_admin || false;
  }

  public logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isAdmin = this._adminMode = false;
    
    const currentSnapshot = this.router.routerState.snapshot.root;
    const activeChild = this.getDeepestChild(currentSnapshot);
    const isProtected = activeChild.data?.['protected'];
    const url = this.router.url;

    if (url.startsWith('/quiz-view/')){
      const quizId = activeChild.params?.['id'];
      if (quizId) this.http.isDemoQuiz(quizId).pipe(take(1)).subscribe(
        isDemo => { if(!isDemo) this.router.navigate(['/quiz'])},
      )
    }
    else if (isProtected) { this.router.navigate(['/home']); }
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  get userId(): number | null {
    const payload = this.parseJwt(this.token);
    return payload?.user_id ?? null;
  }

  get username(): string | null {
    const payload = this.parseJwt(this.token);
    return payload?.username || null;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }
  
  get adminMode(): boolean {
    return this._adminMode;
  }

  set adminMode(value: boolean) {
    this._adminMode = value;
  }

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

  private getDeepestChild(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (snapshot.firstChild) { snapshot = snapshot.firstChild; }
    return snapshot;
  }

}

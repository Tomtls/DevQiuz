import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, catchError, map, of } from "rxjs";
import { AuthService } from "./services/auth.service";
import { HttpService } from "./services/http.service";

@Injectable({
  providedIn: 'root'
})
export class QuizAccessGuard implements CanActivate {

  constructor(private authService: AuthService, private http: HttpService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const quizId = route.params['id'];
    const isDemo = this.router.getCurrentNavigation()?.extras.state?.['isDemo'] ?? false;

    if (isDemo) return of(true);

    return this.http.getQuizById(quizId, isDemo).pipe(
      map(quiz => {
        const hasAccess = quiz.demo || this.authService.isLoggedIn;
        if (!hasAccess) {
          this.router.navigate(['/quiz']);
          console.warn("QuizAccessGuard: Zugriff verweigert – bitte einloggen.");
        }
        return hasAccess;
      }),
      catchError(err => {
        console.error('QuizAccessGuard Fehler:', err);
        this.router.navigate(['/quiz']);
        return of(false);
      })
    );
  }
}

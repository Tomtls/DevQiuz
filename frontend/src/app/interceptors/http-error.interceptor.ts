import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, from, switchMap } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthModalService } from '../services/auth-modal.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toastCtrl: ToastController, private authModalService: AuthModalService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);
        return from(this.showToast(message)).pipe(
          switchMap(() => {
            if (error.status === 401 || error.status === 403){
              const currentUrl = this.router.url;
              this.authModalService.triggerLoginRedirect(currentUrl);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) return error.error.message;
    if (error.status === 0) return 'Server nicht erreichbar';
    if (error.status === 401) return 'Nicht autorisiert';
    if (error.status === 403) return 'Zugriff verweigert';
    if (error.status === 404) return 'Ressource nicht gefunden';
    return `Fehler: ${error.status}`;
  }
}

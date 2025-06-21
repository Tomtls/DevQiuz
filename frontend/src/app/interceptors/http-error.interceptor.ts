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

  //#region Constructor

  constructor(private toastCtrl: ToastController, private authModalService: AuthModalService,private router: Router) { }

  //#endregion

  //#region Interception Logic

  /**
   * Intercepts all HTTP responses to catch and handle errors globally.
   * Shows toast message and optionally triggers login modal on 401/403.
   */
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

  //#endregion

  //#region Helpers

  /**
   * Shows a toast with the provided message.
   */
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }

  /**
   * Maps known HTTP status codes to user-friendly messages.
   * Falls back to raw status code if no match is found.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.error) return error.error.error;
    if (error.error?.message) return error.error.message;
    if (error.status === 0) return 'Server nicht erreichbar';
    if (error.status === 401) return 'Nicht autorisiert';
    if (error.status === 403) return 'Zugriff verweigert';
    if (error.status === 404) return 'Ressource nicht gefunden';
    return `Fehler: ${error.status}`;
  }

  //#endregion
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

//#region Interfaces
interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
}

//#endregion

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //#region Properties
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  //#endregion

  //#region auth

  public register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, { username, email, password });
  }
  public login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { username, password });
  }

  //#endregion

  //#region quiz

  public getQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quizzes`);
  }
  public getQuizById(quizId: number, isDemo: boolean): Observable<any> {
    return isDemo 
    ? this.http.get<any>(`${this.baseUrl}/quizzes/demo/${quizId}`)
    : this.http.get<any>(`${this.baseUrl}/quizzes/${quizId}`)
  }
  public isDemoQuiz(quizId: number): Observable<boolean> {
    return this.http.get<{ demo: boolean }>(`${this.baseUrl}/quizzes/is-demo/${quizId}`).pipe(
      map(response => response.demo),
      catchError(() => of(false))
    )
  }
  public submitQuiz(quizId: number, isDemo: boolean, selectAnswer: any): Observable<any> {
    return isDemo
    ? this.http.post(`${this.baseUrl}/quizzes/demo/${quizId}/submit`, { answer: selectAnswer })
    : this.http.post(`${this.baseUrl}/quizzes/${quizId}/submit`, { answer: selectAnswer })
  }
  public createQuiz(quiz: any): Observable<any> {
   return this.http.post(`${this.baseUrl}/quizzes`, quiz);
  }
  public deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/quizzes/${quizId}`);
  }

  //#endregion

  //#region js quiz

  public getJsQuiz(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jsquiz`);
  }

  public getJsQuizAnswers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jsquiz/answers`);
  }

  public getJsQuizHighscores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jsquiz/highscores`);
  }

  public postJsQuizResults(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jsquiz/results`, payload);
  }

  //#endregion

  //#region HelloWorld!

  public getHelloWorldHighscores(): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/helloworld/highscores`);
  }
  public startHelloWorld(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/helloworld/start`);
  }
  public submitHelloWorld(selectAnswer: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/helloworld`, { option: selectAnswer } );
  }

  //#endregion

}

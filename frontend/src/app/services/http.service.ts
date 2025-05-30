import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user_id: number;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

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
  public createQuiz(quiz: any) {
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

  //#region highscore
  /*public getHighscore(quizId: number, username: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/highscore`, { });
  }*/
  public saveHighscore(quizId: number, username: string, score: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/highscore`, { quizId, username, score });
  }
  
  //#endregion

}

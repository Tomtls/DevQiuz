import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule]
})
export class QuizPage {

  //#region Properties

  /**
   * Array of quizzes fetched from backend
   */
  public quizzes: any[] = [];
  
  //#endregion

  //#region Constructor

  constructor(private http: HttpService, private router: Router, private auth: AuthService,) { }

  //#endregion

  //#region Getters

  /**
   * Indicates whether the current user is logged in
   */
  public get adminMode(): boolean { return this.auth.adminMode; }
  
  /**
   * Indicates whether the admin mode is enabled
   */
  public get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  //#endregion

  //#region Lifecycle

  ionViewWillEnter() {
    this.loadData();
  }

  //#endregion

  //#region Public Methods

  /**
   * Loads quizzes from the backend service
   */
  public loadData(){ 
    this.http.getQuizzes().subscribe({
      next: data => this.quizzes = data,
      error: (err) => console.error(err)
    });
  }

  /**
   * Navigates to the selected quiz view with optional demo flag
   * @param id Quiz ID
   * @param isDemo If true, opens quiz in demo mode
   */
  public openQuiz(id: number, isDemo = false) { 
    this.router.navigate(['/quiz-view', id ], {
      state: { isDemo }
    }); 
  }

  /**
   * Deletes a quiz from backend and updates the local list
   * @param id Quiz ID to delete
   */
  public deleteQuiz(id: number) {
    if(this.auth.isAdmin) {
      this.http.deleteQuiz(id).subscribe({
        next: () => this.quizzes = this.quizzes.filter(q => q.id !== id),
        error: (err) => console.error(err)
      });
    }
  }

  //#endregion
}

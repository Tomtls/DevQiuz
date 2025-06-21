import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-quiz-view',
  templateUrl: './quiz-view.page.html',
  styleUrls: ['./quiz-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizViewPage {

  //#region Properties

  public quiz: any;                               // Loaded quiz object
  public finished = false;                        // Indicates if the quiz has been submitted
  public correctCount = 0;                        // Number of correct answers
  public selectedAnswers: (string | null)[] = []; // Stores selected answers for each question

  private isDemo: boolean = false;                // Indicates if the quiz should be treated as demo

  //#endregion

  //#region Constructor

  constructor( private route: ActivatedRoute, public router: Router, private http: HttpService, private auth: AuthService ) {
    // Extracts "isDemo" flag passed via navigation extras
    const nav = this.router.getCurrentNavigation();
    this.isDemo = nav?.extras.state?.['isDemo'] ?? false;
  }

  //#endregion

  //#region Lifecycle

  ionViewWillEnter() {
    this.loadData();
  }

  //#endregion

  //#region Public Methods

  /**
   * Stores the user's selected answer for a specific question.
   */
  public selectAnswer(questionIndex: number, option: string) {
    this.selectedAnswers[questionIndex] = option;
  }

  /**
   * Checks if a specific option is currently selected for a given question.
   */
  public isSelected(questionIndex: number, option: string): boolean {
    return this.selectedAnswers[questionIndex] === option;
  }

  /**
   * Submits the user's answers to the backend and stores the result.
   */
  public submitQuiz() {
    const treatAsDemo = this.quiz.demo && !this.auth.isLoggedIn;
    this.http.submitQuiz(this.quiz.id, treatAsDemo, this.selectedAnswers).subscribe({
      next: response => this.correctCount = response.correctCount,
      error: err => console.error(err)
    });
    this.finished = true;
  }

  //#endregion

  //#region Private Methods

  /**
   * Loads the quiz data from the backend based on route parameter.
   */
  private loadData(){
    const ParamId = this.route.snapshot.paramMap.get('id');
    const id = Number(ParamId);
    this.http.getQuizById(id, this.isDemo).subscribe({ 
      next: quiz => this.quiz = quiz,
      error: err => {
        console.error(err);
        this.router.navigate(['/quiz']);
      }
    });
  }

  //#endregion
}
import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AuthPage } from '../auth/auth.page';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz-js',
  templateUrl: './quiz-js.page.html',
  styleUrls: ['./quiz-js.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class QuizJsPage {

  //#region Properties

  public current = 0;                              // Current question index
  public showResults: boolean = false;             // Whether to show result screen
  public highscoreNotSaved: boolean = true;        // Tracks whether results have been saved
  public questions: any[] = [];                    // All quiz questions
  public selectedAnswers: number[] = [];           // User-selected answers
  public explanationVisible: boolean[] = [];       // Which answers' explanations are visible

  //#endregion

  //#region Constructor

  constructor(private http: HttpService, private auth: AuthService, private modalCtrl: ModalController) { }

  //#endregion

  //#region Lifecycle

  ionViewWillEnter() {
    this.loadData();
    this.reset();
  }

  //#endregion

  //#region Public Methods

  /**
   * Returns the current score by comparing selected answers to correct answers.
   */
  public get score(): number { return this.questions.filter((q, i) => q.correctAnswer === this.selectedAnswers[i]).length; }

  /**
   * Returns true if the user is logged in.
   */
  public get isLoggedIn(): boolean { return this.auth.isLoggedIn }

  /**
   * Checks if the selected answer at the given index is correct.
   */
  public isCorrect(index: number): boolean { return this.questions[index].correctAnswer === this.selectedAnswers[index]; }
  
  /**
   * Toggles the explanation visibility for a given question index.
   */
  public toggleExplanation(index: number): void { this.explanationVisible[index] = !this.explanationVisible[index]; }

  /**
   * Selects an option and advances to the next question or shows results.
   */
  public selectOption(index: number) {
    this.selectedAnswers[this.current] = index;
    if (this.current + 1 < this.questions.length) { this.current++; } 
    else { this.loadResults(); }
  }

  /**
   * Opens the auth modal and saves results if login was successful.
   */
  public async anmelden() {
    const modal = await this.modalCtrl.create({
      component: AuthPage,
      componentProps: { authMode: 'login' }
    });

    modal.onDidDismiss().then(result => {
      const success = result.data?.success;
      if (success && this.auth.isLoggedIn) {
        this.saveResults();
        this.highscoreNotSaved = false;
      }
    });
    await modal.present();
  }

  /**
   * Resets the quiz state for a new attempt.
   */
  public reset() {
    this.showResults = false;
    this.current = 0;
    this.selectedAnswers = [];
    this.explanationVisible = [];
  }

  //#endregion
  
  //#region Private Methods

  /**
   * Loads the initial quiz questions.
   */
  private loadData(){
    this.http.getJsQuiz().subscribe({
      next: (data) => this.questions = data,
      error: (err) => console.error(err)
    });
  }

  /**
   * Loads correct answers from server and switches to results view.
   */
  private loadResults() {
    this.http.getJsQuizAnswers().subscribe({
      next: (data: any[]) => {
        this.questions = data;
        this.showResults = true;
        this.explanationVisible = Array(data.length).fill(false);
        this.saveResults();
      }, 
      error: (err) => console.error(err)
    });
  }

  /**
   * Sends the user's quiz results to the backend if logged in.
   */
  private saveResults() {
    if(!this.auth.isLoggedIn){ return; }
    if(!this.auth.userId){ return; }
    this.highscoreNotSaved = false;
    const answers = this.questions.map((q, i) => ({
      question_index: q.question_index,
      selected: this.selectedAnswers[i],
      correctAnswer: q.correctAnswer
    }));
    
    const payload = {
      user_id: this.auth.userId,
      score: answers.filter(a => a.selected === a.correctAnswer).length,
      timestamp: new Date().toISOString(),
      answers
    };
    this.http.postJsQuizResults(payload).subscribe({
      next: () => console.log('Ergebnisse gespeichert'),
      error: (err) => console.error('Fehler beim Speichern:', err)
    });
  }

//#endregion

}

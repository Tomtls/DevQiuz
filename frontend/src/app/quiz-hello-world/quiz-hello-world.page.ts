import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../services/http.service';


//#region Interfaces

// Structure of a possible answer
interface Option {
  key: string;
  name: string;
}

// Structure of a question
interface Question {
  snippet: string;
  options: Option[];
}

// Game score and remaining lives
interface GameInfo {
  score: number;
  lives: number;
}

// Server response after submitting an answer
interface AnswerResponse {
  status: string;
  correct: Option;
  game: GameInfo;
  variant: {
    snippet: string;
    options: Option[];
  };
}

//#endregion

//#region Component metadata
@Component({
  selector: 'app-quiz-hello-world',
  templateUrl: './quiz-hello-world.page.html',
  styleUrls: ['./quiz-hello-world.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

//#endregion

export class QuizHelloWorldPage {

  //#region Properties

  public question: Question | null = null;      // current Question
  public selectedOption: string = "";           // selected answer key
  public correctAnswer: Option | null= null;    // correct answer returned by the server
  public score: number = 0;                     // current score
  public lives: number = 5;                     // current remaining lives
  public gameOver: boolean = false;             // indicates whether the game has ended

  private nextQuestion: Question | null = null; // next question (buffered in case the answer was incorrect)

  constructor(private http: HttpService) { }

  //#endregion

  //#region Lifecycle

  /**
   * Ionic lifecycle hook – called when entering the page.
   */
  ionViewWillEnter() {
    this.startGame();
  }

  //#endregion

  //#region Public Methods

  /**
   * Submits an answer to the server and handles the response
   */
  public submitAnswer(option: Option) {
    this.selectedOption = option.key;
    
    this.http.submitHelloWorld(this.selectedOption).subscribe({
      next: (response) => { this.handleAnswerResponse(response); },
      error: (err) => console.error(err)
    });
  }

  /**
   * Moves to the next question, if one is buffered
   */
  public next() {
    if(this.nextQuestion) this.setQuestion(this.nextQuestion);
    this.nextQuestion = null;
    this.correctAnswer = null;
  }

  /**
   * Resets the game state and starts a new game
   */
  public restart() {
    this.score = 0;
    this.lives = 3;
    this.correctAnswer = null;
    this.selectedOption = "";
    this.nextQuestion = null;
    this.gameOver = false;
    this.startGame();
  }

  /**
   * Determines the button color based on selection and correctness
   */
  public getButtonColor(opt: Option): string {
    if (!this.correctAnswer) {
      return this.selectedOption === opt.key ? 'primary' : 'medium';
    }

    if (opt.key === this.correctAnswer.key) return 'success';
    if (this.selectedOption === opt.key) return 'danger';
    return 'medium';
  }

  //#endregion

  //#region Private Methods

  /**
   * Initializes the game by fetching the first question from the server.
   * This method is called once when the game starts.
   */
  private startGame() {
    this.http.startHelloWorld().subscribe({
      next: (response) => this.setQuestion(response.variant),
      error: (err) => console.error(err)
    });
  }

  /**
   * Handles the response after submitting an answer.
   * - If correct: show next question
   * - If incorrect: display solution and wait for "next" click
   */
  private handleAnswerResponse(response: AnswerResponse) {
    this.score = response.game.score;
    this.lives = response.game.lives;
    this.correctAnswer = response.correct;

    // Game ends if status is "died"
    if (response.status === "died") {
      this.gameOver = true;
      return;
    }

    console.log("bool:", !response.correct)
    // Load next question or wait for user to continue
    if (response.correct === null) {              // correct → next question immediately
      this.setQuestion(response.variant);
    } else this.nextQuestion = response.variant;  // incorrect → buffer question and wait for user
  }

  /**
   * Sets the current question and clears the selected option
   */
  private setQuestion(response: Question) {
    this.selectedOption = "";
    this.question = response;
  }

  //#endregion
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.page.html',
  styleUrls: ['./create-quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CreateQuizPage {

  //#region Properties

  /**
   * Holds the data for the quiz being created, including its title and questions.
   */
  public quiz = {
    id: 0,
    title: '',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        answer: ''
      }
    ]
  };

  //#endregion

  //#region Constructor

  constructor(private http: HttpService, private toastCtrl: ToastController, private router: Router) {}

  //#endregion

  //#region Public Methods

  /**
   * Adds a new blank question to the quiz.
   */
  addQuestion() {
    this.quiz.questions.push({
      text: '',
      options: ['', '', '', ''],
      answer: ''
    });
  }

  /**
   * Removes a question from the quiz at the specified index.
   * @param index Index of the question to remove
   */
  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  /**
   * Updates a specific option within a question.
   * @param questionIndex Index of the question
   * @param optionIndex Index of the option within the question
   * @param event DOM event carrying the new input value
   */
  updateOption(questionIndex: number, optionIndex: number, event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.quiz.questions[questionIndex].options[optionIndex] = value;
  }

  /**
   * TrackBy function to optimize rendering of *ngFor loops.
   */
  trackByIndex(index: number, item: any): any {
    return index;
  }


  /**
   * Validates and submits the quiz to the backend.
   * - Requires title and at least one question.
   * - Each question must have at least two non-empty options.
   * - Each question must define a correct answer.
   */
  async submitQuiz() {
    // Title and questions must be filled
    if (!this.quiz.title || this.quiz.questions.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Bitte Titel und mindestens eine Frage angeben.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
    
    // Each question must have at least two valid options
    const invalidQuestion = this.quiz.questions.find(q => {
      const validOptions = q.options.filter(opt => opt && opt.trim() !== '');
      return validOptions.length < 2;
    });
    
    if (invalidQuestion) {
      const toast = await this.toastCtrl.create({
        message: 'Jede Frage muss mindestens zwei Antwortoptionen haben.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }
    
    // Each question must have a defined answer
    const missingAnswer = this.quiz.questions.find(q => !q.answer || q.answer.trim() === '');
    
    if (missingAnswer) {
      const toast = await this.toastCtrl.create({
        message: 'Bitte wähle für jede Frage eine richtige Antwort aus.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }
    
    // Submit quiz to backend
    this.http.createQuiz(this.quiz).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Quiz erfolgreich erstellt!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/quiz']);
      },
      error: (err) => {console.error(err)
      }
    });
  }

  //#endregion
}

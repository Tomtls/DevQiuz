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
  quiz = {
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

  constructor(private http: HttpService, private toastCtrl: ToastController, private router: Router) {}

  addQuestion() {
    this.quiz.questions.push({
      text: '',
      options: ['', '', '', ''],
      answer: ''
    });
  }

  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  updateOption(questionIndex: number, optionIndex: number, event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.quiz.questions[questionIndex].options[optionIndex] = value;
  }
  trackByIndex(index: number, item: any): any {
    return index;
  }


  async submitQuiz() {
    if (!this.quiz.title || this.quiz.questions.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Bitte Titel und mindestens eine Frage angeben.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
    
    // Validierung: Jede Frage braucht mindestens zwei nicht-leere Optionen
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
    
    // Neue Validierung: Jede Frage muss eine richtige Antwort haben
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
    
    // Alles valid — Speichern
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
}

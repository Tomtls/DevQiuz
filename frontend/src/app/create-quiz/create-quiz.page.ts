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
    id: Date.now(), // temporär; könnte Backend auch setzen
    title: '',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        answer: ''
      }
    ]
  };

  constructor(private api: HttpService, private toastCtrl: ToastController, private router: Router) {}

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
    // Optional: Validierung
    if (!this.quiz.title || this.quiz.questions.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Bitte Titel und mindestens eine Frage angeben.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    // 🚀 Speichern via API
    this.api.createQuiz(this.quiz).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Quiz erfolgreich erstellt!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/']); // oder zur Quiz-Übersicht
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Fehler beim Speichern!',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}

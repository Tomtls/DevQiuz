import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { AuthPage } from '../auth/auth.page';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz-js',
  templateUrl: './quiz-js.page.html',
  styleUrls: ['./quiz-js.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class QuizJsPage implements OnInit {
  public current = 0;
  public showResults: boolean = false;
  public highscoreNotSaved: boolean = true;
  public questions: any[] = [];
  public selectedAnswers: number[] = [];
  public explanationVisible: boolean[] = [];


  constructor(private http: HttpService, private auth: AuthService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.http.getJsQuiz().subscribe(data => this.questions = data);
  }

  ionViewWillEnter() {
    this.http.getJsQuiz().subscribe(data => this.questions = data);
    this.reset();
  }

  public get score(): number { return this.questions.filter((q, i) => q.correctAnswer === this.selectedAnswers[i]).length; }
  public get isLoggedIn(): boolean { return this.auth.isLoggedIn }


  public isCorrect(index: number): boolean { return this.questions[index].correctAnswer === this.selectedAnswers[index]; }
  public toggleExplanation(index: number): void { this.explanationVisible[index] = !this.explanationVisible[index]; }

  public selectOption(index: number) {
    this.selectedAnswers[this.current] = index;
    if (this.current + 1 < this.questions.length) { this.current++; } 
    else { this.loadResults(); }
  }

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

  private loadResults() {
    this.http.getJsQuizAnswers().subscribe((data: any[]) => {
      this.questions = data;
      this.showResults = true;
      this.explanationVisible = Array(data.length).fill(false);
      this.saveResults();
    });
  }

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

  public reset() {
    this.showResults = false;
    this.current = 0;
    this.selectedAnswers = [];
    this.explanationVisible = [];
  }

}

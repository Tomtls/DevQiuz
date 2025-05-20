import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quiz-js',
  templateUrl: './quiz-js.page.html',
  styleUrls: ['./quiz-js.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizJsPage implements OnInit {
  public questions: any[] = [];
  public current = 0;
  public selectedAnswers: number[] = [];
  public showResults = false;
  public explanationVisible: boolean[] = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.getJsQuiz().subscribe(data => this.questions = data);
  }

  ionViewWillEnter() {
    this.http.getJsQuiz().subscribe(data => this.questions = data);
    this.reset();
  }

  public get score(): number {
    return this.questions.filter((q, i) => q.correctAnswer === this.selectedAnswers[i]).length;
  }

  public isCorrect(index: number): boolean {
    return this.questions[index].correctAnswer === this.selectedAnswers[index];
  }

  public toggleExplanation(index: number): void {
    this.explanationVisible[index] = !this.explanationVisible[index];
  }

  public selectOption(index: number) {
    this.selectedAnswers[this.current] = index;
    if (this.current + 1 < this.questions.length) { this.current++; } 
    else { this.loadResults(); }
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
    const answers = this.questions.map((q, i) => ({
      question_index: q.question_index,
      selected: this.selectedAnswers[i],
      correctAnswer: q.correctAnswer
    }));
    
    const payload = {
      user_id: 1,//this.getUserId(),
      score: answers.filter(a => a.selected === a.correctAnswer).length,
      timestamp: new Date().toISOString(),
      answers
    };
    this.http.postJsQuizResults(payload).subscribe({
      next: () => console.log('Ergebnisse gespeichert'),
      error: (err) => console.error('Fehler beim Speichern:', err)
    });  
  }

  private reset() {
    this.showResults = false;
    this.current = 0;
    this.selectedAnswers = [];
  }

}

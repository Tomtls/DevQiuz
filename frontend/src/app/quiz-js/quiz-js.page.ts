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
    });
  }

  private reset() {
    this.showResults = false;
    this.current = 0;
    this.selectedAnswers = [];
  }

}

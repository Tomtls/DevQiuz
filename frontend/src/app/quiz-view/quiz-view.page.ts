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
  public quiz: any;
  public finished = false;
  public correctAnswers = 0;
  
  private isDemo: boolean = false;
  private selectedAnswers: string[] = [];

  constructor( private route: ActivatedRoute, public router: Router, private http: HttpService, private auth: AuthService ) {
    const nav = this.router.getCurrentNavigation();
    this.isDemo = nav?.extras.state?.['isDemo'] ?? false;
   }

  ionViewWillEnter() {
    this.loadData();
  }

  public selectAnswer(questionIndex: number, option: string) {
    this.selectedAnswers[questionIndex] = option;
  }

  public isSelected(questionIndex: number, option: string): boolean {
    return this.selectedAnswers[questionIndex] === option;
  }

  public submitQuiz() {
    this.correctAnswers = this.quiz.questions.reduce((acc: number, q: any, i: number) => {
      return acc + (q.answer === this.selectedAnswers[i] ? 1 : 0);
    }, 0);
    this.finished = true;
    this.http.saveHighscore(this.quiz.id, this.auth.Username ?? "", this.correctAnswers).subscribe();
  }

  private loadData(){
    if (this.isDemo) { this.http.getDemoQuiz().subscribe(quiz => { this.quiz = quiz; }); } 
    else {
      const ParamId = this.route.snapshot.paramMap.get('id');
      const id = Number(ParamId);
      this.http.getQuizById(id).subscribe(quiz => { this.quiz = quiz; });
    }
  }

  /* 
  currentIndex = 0;
  selectedAnswer: string | null = null;

  get currentQuestion() { return this.quiz.questions[this.currentIndex]; }

  get isLastQuestion() { return this.currentIndex === this.quiz.questions.length - 1; }

  nextQuestion() {
    if (this.selectedAnswer === this.currentQuestion.answer) {
      this.correctAnswers++;
    }

    this.selectedAnswer = null;

    if (this.isLastQuestion) {
      this.finished = true;
      this.router.navigate(['/quiz/result'], {
        queryParams: {
          correct: this.correctAnswers,
          total: this.quiz.questions.length
        }
      });
    } else { this.currentIndex++; }
  }
  restart() {
    this.currentIndex = 0;
    this.correctAnswers = 0;
    this.selectedAnswer = null;
    this.finished = false;
  } */
}
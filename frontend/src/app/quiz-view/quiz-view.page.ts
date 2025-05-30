import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
@Component({
  selector: 'app-quiz-view',
  templateUrl: './quiz-view.page.html',
  styleUrls: ['./quiz-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizViewPage implements OnInit {
  quiz: any;
  currentIndex = 0;
  selectedAnswer: string | null = null;
  correctAnswers = 0;
  finished = false;

  constructor( private route: ActivatedRoute, public router: Router, private http: HttpService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Quiz-ID: ', id);
    this.http.getQuizzes().subscribe(quizzes => {
      this.quiz = quizzes.find(q => q.id == id);
    });
  }

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
  }
  selectedAnswers: string[] = [];

selectAnswer(questionIndex: number, option: string) {
  this.selectedAnswers[questionIndex] = option;
}

isSelected(questionIndex: number, option: string): boolean {
  return this.selectedAnswers[questionIndex] === option;
}

submitQuiz() {
  this.correctAnswers = this.quiz.questions.reduce((acc: number, q: any, i: number) => {
    return acc + (q.answer === this.selectedAnswers[i] ? 1 : 0);
  }, 0);
  this.finished = true;
  this.http.saveHighscore(this.quiz.id, 'UserXY', this.correctAnswers).subscribe();
}

}
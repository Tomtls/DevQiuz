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
  questions: any[] = [];
  current = 0;
  selectedAnswers: number[] = [];
  showResults = false;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.getJsQuiz().subscribe(data => this.questions = data);
  }
  ionViewWillEnter(){
    this.http.getJsQuiz().subscribe(data => this.questions = data);
    console.log(this.questions);
  }
  selectOption(index: number) {
    this.selectedAnswers[this.current] = index;
    if (this.current + 1 < this.questions.length) {
      this.current++;
    } else { this.showResults = true; }
  }
    
  getCorrectAnswer(index: number) {
    return this.questions[index].options[this.questions[index].answerIndex];
  }

  isCorrect(index: number): boolean {
    return this.questions[index].answerIndex === this.selectedAnswers[index];
  }

  get score(): number {
    return this.questions.filter((q, i) => q.answerIndex === this.selectedAnswers[i]).length;
  }
}

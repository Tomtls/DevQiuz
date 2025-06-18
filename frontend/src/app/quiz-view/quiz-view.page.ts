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
  public correctCount = 0;
  
  private isDemo: boolean = false;
  public selectedAnswers: (string | null)[] = [];

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
    const treatAsDemo = this.quiz.demo && !this.auth.isLoggedIn;
    this.http.submitQuiz(this.quiz.id, treatAsDemo, this.selectedAnswers).subscribe({
      next: response => this.correctCount = response.correctCount,
      error: err => console.error(err)
    });
    this.finished = true;
  }

  private loadData(){
    const ParamId = this.route.snapshot.paramMap.get('id');
    const id = Number(ParamId);
    this.http.getQuizById(id, this.isDemo).subscribe({ 
      next: quiz => this.quiz = quiz,
      error: err => {
        console.error(err);
        this.router.navigate(['/quiz']);
      }
    });
  }

}
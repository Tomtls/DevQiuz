import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule]
})
export class QuizPage {
  quizzes: any[] = [];
  
  constructor(private http: HttpService, private router: Router, private auth: AuthService,) { }

  public get adminMode(): boolean { return this.auth.adminMode; }
  public get isLoggedIn(): boolean { return this.auth.isLoggedIn; }


  ionViewWillEnter() {
    this.loadData();
  }

  public loadData(){ this.http.getQuizzes().subscribe(data => { this.quizzes = data; }); }

  public openQuiz(id: number, isDemo = false) { 
    this.router.navigate(['/quiz-view', id ], {
      state: { isDemo }
    }); 
  }

  public deleteQuiz(id: number) {
    if(this.auth.isAdmin) {
      this.http.deleteQuiz(id).subscribe(() => {
        this.quizzes = this.quizzes.filter(q => q.id !== id);
      });
    }
  }

}

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
export class QuizPage implements OnInit {
  quizzes: any[] = [];
  isAdmin = false;
  adminModeActive = false;

  constructor(private api: HttpService, private router: Router, private auth: AuthService,) { }

  ngOnInit() {
    this.isAdmin = this.auth.isAdmin();
    this.api.getQuizzes().subscribe(data => { this.quizzes = data; });
  }

  openQuiz(id: number) {
    this.router.navigate(['/quiz-view', id]);
  }
  deleteQuiz(id: number) {
    this.api.deleteQuiz(id).subscribe(() => {
      this.quizzes = this.quizzes.filter(q => q.id !== id);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-quiz-hello-world',
  templateUrl: './quiz-hello-world.page.html',
  styleUrls: ['./quiz-hello-world.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizHelloWorldPage {

  question: any = null;
  selectedOption: string = "";
  correctAnswer: any = null;
  score: number = 0;
  lives: number = 3;
  quizzes: any = null

  constructor(private http: HttpService) { }

  ionViewWillEnter() {
    this.loadQuestion();
  }

  loadQuestion(){
    this.http.testHelloworld().subscribe({ // nur test
      next: (response) => this.quizzes = response,
      error: (err) => console.error(err)
    })
    console.log(this.quizzes)
    this.http.startHelloWorld().subscribe({
      next: (data) => this.setQuestion(data),
      error: (err) => console.error(err)
    })
  }

  submitAnswer(option: any) {
    this.selectedOption = option.key;
    
    this.http.submitHelloWorld(this.selectedOption).subscribe({
      next: (response) => {
        this.score = response.game.score;
        this.lives = response.game.lives;
        this.correctAnswer = response.correct;

        this.setQuestion(response);
        this.selectedOption = "";
      },
      error: (err) => console.error(err)
    });
  }
  
  
  private setQuestion(response: any) {
    this.question = {
      snippet: response.variant.snippet,
      options: response.variant.options
    };
  }

}

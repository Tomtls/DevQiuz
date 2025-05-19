import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quiz-hello-world',
  templateUrl: './quiz-hello-world.page.html',
  styleUrls: ['./quiz-hello-world.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizHelloWorldPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  lives = 5;
score = 0;
currentQuestionIndex = 0;

//questions: any = []; // aus Service laden
questions = {
  "id": 1,
  "type": "code",
  "code": "module Main where\n\nmain :: IO ()\nmain = putStrLn \"Hello, World!\"",
  "options": ["Erlang", "Haskell", "Idris"],
  "answer": "Haskell"
}

get currentQuestion() {
  return this.questions;
  //return this.questions[this.currentQuestionIndex];
}

checkAnswer(option: string) {
  if (option === this.questions.answer) {
    this.score++;
  } else {
    this.lives--;
  }

  /*if (this.lives === 0 || this.currentQuestionIndex + 1 === this.questions.length) {
    this.endGame();
  } else {
    this.currentQuestionIndex++;
  }*/
}

endGame(){

}

}

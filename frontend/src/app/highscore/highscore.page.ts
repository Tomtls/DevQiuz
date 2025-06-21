import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.page.html',
  styleUrls: ['./highscore.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule]
})
export class HighscorePage {

  //#region Properties

  /**
   * Highscore data from the "JS is Weird" quiz.
   */
  public jsHighscore: any[] = [];

  /**
   * Highscore data from the "Hello World" quiz.
   */
  public helloHighscore: any[] = [];

  /**
   * Controls whether the full JS highscore list is shown.
   */
  public showFullJS = false;

  /**
   * Controls whether the full Hello World highscore list is shown.
   */
  public showFullHello = false;

  //#endregion

  //#region Constructor

  constructor(private http: HttpService) { }

  //#endregion

  //#region Lifecycle

  ionViewWillEnter(){
    this.loadHighscores();
  }

  //#endregion

  //#region Private Methods

  /**
   * Loads highscore data for both quizzes from the backend.
   */
  private loadHighscores(){
    this.http.getJsQuizHighscores().subscribe({
      next: (data: any[]) => this.jsHighscore = data,
      error: (err) => console.error(err)
    });

    this.http.getHelloWorldHighscores().subscribe({
      next: (data: any[]) => this.helloHighscore = data,
      error: (err) => console.error(err)
    });
  }

  //#endregion
}

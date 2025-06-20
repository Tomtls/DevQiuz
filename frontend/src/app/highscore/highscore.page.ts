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
  public jsHighscore: any[] = [];     // Daten vom JS-Quiz    
  public helloHighscore: any[] = [];  // Daten vom Hello World-Quiz

  public showFullJS = false;          // Steuerung für "Mehr anzeigen"
  public showFullHello = false;       // Steuerung für "Mehr anzeigen"

  constructor(private http: HttpService) { }


  ionViewWillEnter(){
    this.loadHighscores();
  }

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

}

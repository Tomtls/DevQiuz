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
export class HighscorePage implements OnInit {
  public jsHighscore: any[] = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadJsQuizHighscores();
  }
  ionViewWillEnter(){
    this.loadJsQuizHighscores();
  }

  private loadJsQuizHighscores(){
    this.http.getJsQuizHighscores().subscribe((data: any[]) => { this.jsHighscore = data; });
  }

}

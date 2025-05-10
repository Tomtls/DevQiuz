import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.page.html',
  styleUrls: ['./highscore.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule]
})
export class HighscorePage implements OnInit {

  constructor() { }

  ngOnInit() {}

}

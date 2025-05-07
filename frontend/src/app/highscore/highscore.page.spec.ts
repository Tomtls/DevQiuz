import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighscorePage } from './highscore.page';

describe('HighscorePage', () => {
  let component: HighscorePage;
  let fixture: ComponentFixture<HighscorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

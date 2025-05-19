import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizJsPage } from './quiz-js.page';

describe('QuizJsPage', () => {
  let component: QuizJsPage;
  let fixture: ComponentFixture<QuizJsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizJsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

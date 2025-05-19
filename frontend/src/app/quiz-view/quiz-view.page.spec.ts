import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizViewPage } from './quiz-view.page';

describe('QuizViewPage', () => {
  let component: QuizViewPage;
  let fixture: ComponentFixture<QuizViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

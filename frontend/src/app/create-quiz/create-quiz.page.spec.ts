import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateQuizPage } from './create-quiz.page';

describe('CreateQuizPage', () => {
  let component: CreateQuizPage;
  let fixture: ComponentFixture<CreateQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

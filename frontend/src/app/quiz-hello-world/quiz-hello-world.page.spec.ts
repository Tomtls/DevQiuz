import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizHelloWorldPage } from './quiz-hello-world.page';

describe('QuizHelloWorldPage', () => {
  let component: QuizHelloWorldPage;
  let fixture: ComponentFixture<QuizHelloWorldPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizHelloWorldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

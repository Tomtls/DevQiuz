import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { QuizAccessGuard } from './quiz.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./quiz/quiz.page').then( m => m.QuizPage),
  },
  {
    path: 'create-quiz',
    canActivate: [authGuard],
    loadComponent: () => import('./create-quiz/create-quiz.page').then( m => m.CreateQuizPage)
  },
  {
    path: 'highscore',
    loadComponent: () => import('./highscore/highscore.page').then( m => m.HighscorePage)
  },
  {
    path: 'quiz-view/:id',
    canActivate: [QuizAccessGuard],
    loadComponent: () => import('./quiz-view/quiz-view.page').then( m => m.QuizViewPage)
  },
  {
    path: 'quiz-hello-world',
    canActivate: [authGuard],
    loadComponent: () => import('./quiz-hello-world/quiz-hello-world.page').then( m => m.QuizHelloWorldPage)
  },
  {
    path: 'quiz-js',
    canActivate: [authGuard],
    loadComponent: () => import('./quiz-js/quiz-js.page').then( m => m.QuizJsPage)
  },
];

import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

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
    canActivate: [authGuard]
  },
  {
    path: 'create-quiz',
    loadComponent: () => import('./create-quiz/create-quiz.page').then( m => m.CreateQuizPage),
    canActivate: [authGuard]
  },
  {
    path: 'highscore',
    loadComponent: () => import('./highscore/highscore.page').then( m => m.HighscorePage)
  },
];

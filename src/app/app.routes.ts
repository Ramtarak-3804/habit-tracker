import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseListComponent } from './components/expenses/expense-list/expense-list.component';
import { ExpenseFormComponent } from './components/expenses/expense-form/expense-form.component';
import { ExpenseDetailComponent } from './components/expenses/expense-detail/expense-detail.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { GroupFormComponent } from './components/groups/group-form/group-form.component';
import { GroupDetailComponent } from './components/groups/group-detail/group-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

// Modern auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      
      router.navigate(['/login']);
      return false;
    })
  );
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [() => authGuard()] 
  },
  { 
    path: 'expenses',
    canActivate: [() => authGuard()],
    children: [
      { path: '', component: ExpenseListComponent },
      { path: 'new', component: ExpenseFormComponent },
      { path: 'edit/:id', component: ExpenseFormComponent },
      { path: ':id', component: ExpenseDetailComponent }
    ]
  },
  { 
    path: 'groups',
    canActivate: [() => authGuard()],
    children: [
      { path: '', component: GroupListComponent },
      { path: 'new', component: GroupFormComponent },
      { path: 'edit/:id', component: GroupFormComponent },
      { path: ':id', component: GroupDetailComponent }
    ]
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [() => authGuard()] 
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

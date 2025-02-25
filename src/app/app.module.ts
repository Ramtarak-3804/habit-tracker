import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ExpenseListComponent } from './components/expenses/expense-list/expense-list.component';
import { ExpenseFormComponent } from './components/expenses/expense-form/expense-form.component';
import { ExpenseDetailComponent } from './components/expenses/expense-detail/expense-detail.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { GroupFormComponent } from './components/groups/group-form/group-form.component';
import { GroupDetailComponent } from './components/groups/group-detail/group-detail.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthService } from './services/auth.service';
import { ExpenseService } from './services/expense.service';
import { GroupService } from './services/group.service';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'expenses', 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ExpenseListComponent },
      { path: 'new', component: ExpenseFormComponent },
      { path: 'edit/:id', component: ExpenseFormComponent },
      { path: ':id', component: ExpenseDetailComponent }
    ]
  },
  { 
    path: 'groups', 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: GroupListComponent },
      { path: 'new', component: GroupFormComponent },
      { path: 'edit/:id', component: GroupFormComponent },
      { path: ':id', component: GroupDetailComponent }
    ]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    ExpenseListComponent,
    ExpenseFormComponent,
    ExpenseDetailComponent,
    GroupListComponent,
    GroupFormComponent,
    GroupDetailComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    ExpenseService,
    GroupService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'Split Expense Tracker';
  isLoggedIn = false;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }
}

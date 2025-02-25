import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  constructor(private router: Router) {
    // Check local storage for existing login
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.loggedIn.next(true);
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  
  login(email: string, password: string): Observable<any> {
    // This is a mock implementation. In a real app, you would call an API.
    if (email === 'user@example.com' && password === 'password') {
      const user = { 
        id: 1, 
        email, 
        name: 'Demo User',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg' 
      };
      
      return of(user).pipe(
        delay(1000), // Simulate server delay
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
          this.currentUserSubject.next(user);
        })
      );
    } else {
      return of(null).pipe(
        delay(1000),
        tap(() => {
          throw new Error('Invalid credentials');
        })
      );
    }
  }
  
  register(userData: any): Observable<any> {
    // This is a mock implementation
    return of(userData).pipe(
      delay(1000),
      tap(user => {
        this.login(userData.email, userData.password).subscribe();
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}

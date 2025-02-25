import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showRegister = false;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
  
  ngOnInit(): void {
    // Demo credentials for easy testing
    this.loginForm.setValue({
      email: 'user@example.com',
      password: 'password'
    });
  }
  
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }
  
  onLogin() {
    if (this.loginForm.invalid) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
  
  onRegister() {
    if (this.registerForm.invalid) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    const userData = this.registerForm.value;
    
    this.authService.register(userData).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.loading = false;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
  
  toggleForm() {
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
  }
}

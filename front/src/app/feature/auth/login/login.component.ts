import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { AppConfig } from '../../../core/config/app.config';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  loginForm: FormGroup;
  showPassword = false;
  rememberMe = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService
        .login({
          username: this.loginForm.value.email, // Send email as username
          password: this.loginForm.value.password,
        } as LoginRequest)
        .subscribe({
          next: (response) => {
            // AuthService already handles localStorage and state updates
            // Just navigate to home after successful login
            this.router
              .navigate([AppConfig.ROUTES.HOME])
              .then(() => {
                console.log('Navigation to home completed');
              })
              .catch((error) => {
                console.error('Navigation error:', error);
              });
          },
          error: (error) => {
            console.error('Login error:', error);
            if (error?.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error?.message) {
              this.errorMessage = error.message;
            } else {
              this.errorMessage =
                'An error occurred during login. Please try again.';
            }
          },
        });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  // Getter methods for easy access to form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { AppConfig } from '../../../core/config/app.config';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  showPassword = false;
  rememberMe = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: (response) => {
        const { token, user } = response;
        localStorage.setItem(AppConfig.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(AppConfig.STORAGE_KEYS.USER, JSON.stringify(user));
        this.router.navigate([AppConfig.ROUTES.HOME]);
      },
      // Show the message error from the backend
      // Option 1: Set an error message property and display it in the template
      // (Assumes you will add {{ errorMessage }} in the template)
      error: (error) => {
        if (error?.error) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred during login.';
        }
      },
    });
  }
}

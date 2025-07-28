import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../../core/models/auth.model';
import { AppConfig } from '../../../core/config/app.config';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  showPassword = false;

  onRegister() {
    if (this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value as RegisterRequest)
        .subscribe({
          next: (response) => {
            const { token, user } = response;
            localStorage.setItem(AppConfig.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(
              AppConfig.STORAGE_KEYS.USER,
              JSON.stringify(user)
            );
            this.router.navigate([AppConfig.ROUTES.HOME]);
          },
          error: (error) => {
            console.error('Registration error:', error);
            // Handle error (show toast, error message, etc.)
          },
        });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

export class AppConfig {
  // API Configuration
  static readonly API_BASE_URL = 'http://localhost:8080/api';
  static readonly AUTH_ENDPOINTS = {
    LOGIN: `${AppConfig.API_BASE_URL}/auth/login`,
    REGISTER: `${AppConfig.API_BASE_URL}/auth/register`,
    LOGOUT: `${AppConfig.API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${AppConfig.API_BASE_URL}/auth/refresh`,
  };

  // Local Storage Keys
  static readonly STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    REFRESH_TOKEN: 'refreshToken',
  };

  // Route Paths
  static readonly ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    HOME: '/home',
    PROFILE: '/profile',
  };

  // HTTP Configuration
  static readonly HTTP_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
  };

  // Application Settings
  static readonly APP_SETTINGS = {
    NAME: 'LinkUp',
    VERSION: '1.0.0',
    DEFAULT_LANGUAGE: 'en',
  };

  // Validation Rules
  static readonly VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };
}

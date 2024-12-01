import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Obtener el rol del usuario desde el token JWT
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role;
  }

  // Obtener el nombre de usuario desde el token JWT
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.username;
  }

  // Registro de usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Login de usuario (con email y password)
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // Autenticación con Google OAuth
  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google/callback`, { token: idToken });
  }

  // Guardar token en localStorage (tras login exitoso)
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Obtener token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Eliminar token de localStorage (logout)
  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Decodificar el token y verificar si está expirado
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // El tiempo actual en segundos

    // Verificar si el token ha expirado
    return decodedToken.exp > currentTime;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError  } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private sessionExpiringSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationTime: number | null = null;
  private expirationWarningTime = 5 * 60 * 1000;

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

  // Obtener el tiempo restante hasta la expiración del token en milisegundos
  getRemainingTime(): number {
    const token = this.getToken();
    if (!token) return 0;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // tiempo actual en segundos
    const expirationTime = decodedToken.exp * 1000; // expiración en milisegundos

    return expirationTime - currentTime * 1000;
  }

  // Método que verifica si la sesión está por expirar y emite una notificación
  checkSessionExpiration() {
    const remainingTime = this.getRemainingTime();
    
    // Si queda menos de 5 minutos para la expiración, mostrar el mensaje
    if (remainingTime < this.expirationWarningTime && remainingTime > 0) {
      this.sessionExpiringSubject.next(true);
    }

    // Si el tiempo restante es mayor que 0 y menos de 5 minutos, chequeamos continuamente
    setTimeout(() => this.checkSessionExpiration(), 1000); // Verificación cada segundo
  }

   // Iniciar la comprobación de expiración
   startSessionExpirationCheck() {
    this.checkSessionExpiration();
  }

  // Obtener si la sesión está por expirar
  isSessionExpiring(): Observable<boolean> {
    return this.sessionExpiringSubject.asObservable();
  }

  // Extender la sesión (renovar el token)
  extendSession(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      // Si no hay token, no permitimos la acción
      return throwError('No token provided');
    }
  
    // Configuramos las cabeceras correctamente para enviar el token
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    return this.http.post<any>(`${this.apiUrl}/extend-session`, { token }, { headers });
  }
  

  // Eliminar token de localStorage (logout)
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('selectedComponents');
  }

  // Verificar si el token ha expirado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // El tiempo actual en segundos
  
    return decodedToken.exp > currentTime; // Verifica que el token no haya expirado
  }  

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Método para obtener si el usuario es un administrador
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin';
  }

  // Método para obtener si el usuario es un usuario regular
  isUser(): boolean {
    const role = this.getUserRole();
    return role === 'user';
  }

// Obtener el ID del usuario desde el token JWT
getUserId(): string | null {
  const token = this.getToken(); // Asegúrate de tener esta función para obtener el token
  if (!token) return null;

  const decodedToken: any = jwtDecode(token); // Decodifica el JWT
  return decodedToken.userId || null; // Devuelve el userId desde el payload
}

}

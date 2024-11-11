// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; 
  private oauthUrl = `${environment.apiUrl}/auth/google`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  // Actualizar un usuario
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Autenticación con Google OAuth (método para obtener el token de acceso de Google)
  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(this.oauthUrl, { token: idToken });
  }

  // Método para verificar si el usuario está autenticado (si tienes alguna lógica del frontend)
  isAuthenticated(): boolean {
    // Verifica en el almacenamiento local si el usuario tiene un token válido o alguna otra condición
    return !!localStorage.getItem('auth_token');  // Por ejemplo, revisando el token guardado en localStorage
  }

  // Método para obtener el token de autenticación (si se necesita en otras partes del frontend)
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');  // Recupera el token desde localStorage
  }
}

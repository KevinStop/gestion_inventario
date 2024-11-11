// src/app/services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;  // URL base para la API de requests

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes
  getRequests(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener una solicitud por ID
  getRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva solicitud
  createRequest(requestData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, requestData);
  }

  // Actualizar una solicitud
  updateRequest(id: number, requestData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestData);
  }

  // Eliminar una solicitud
  deleteRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Aprobar una solicitud (esto puede ser un cambio de estado)
  approveRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/approve`, {});  // Enviar la solicitud con estado 'approved'
  }

  // Rechazar una solicitud (esto puede ser un cambio de estado)
  rejectRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/reject`, {});  // Enviar la solicitud con estado 'rejected'
  }

  // Cambiar el estado de la solicitud a "loaned" (cuando se aprueba y se realiza el préstamo)
  loanRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/loan`, {});  // Enviar la solicitud con estado 'loaned'
  }

  // Cambiar el estado de la solicitud a "returned" (cuando se devuelve el componente)
  returnRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/return`, {});  // Enviar la solicitud con estado 'returned'
  }
}

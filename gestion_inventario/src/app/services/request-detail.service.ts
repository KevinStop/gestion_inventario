// src/app/services/request-detail.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestDetailService {
  private apiUrl = `${environment.apiUrl}/request-details`;  // URL base para la API de request-details

  constructor(private http: HttpClient) {}

  // Obtener todos los detalles de las solicitudes
  getRequestDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener los detalles de una solicitud por su ID
  getRequestDetailsByRequestId(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/request/${requestId}`);
  }

  // Crear un nuevo detalle de solicitud
  createRequestDetail(requestDetailData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, requestDetailData);
  }

  // Actualizar un detalle de solicitud
  updateRequestDetail(id: number, requestDetailData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestDetailData);
  }

  // Eliminar un detalle de solicitud
  deleteRequestDetail(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

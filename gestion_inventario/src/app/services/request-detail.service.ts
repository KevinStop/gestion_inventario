/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestDetailService {
  private apiUrl = `${environment.apiUrl}/requestDetails`;  // URL base para la API de requestDetails

  constructor(private http: HttpClient) {}

  // Obtener todos los detalles de las solicitudes
  getRequestDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener detalles de solicitud por ID
  getRequestDetailById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un detalle de solicitud (agregar componentes a la solicitud)
  createRequestDetail(requestDetailData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, requestDetailData);
  }

  // Actualizar un detalle de solicitud (modificar cantidad, por ejemplo)
  updateRequestDetail(id: number, requestDetailData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestDetailData);
  }

  // Eliminar un detalle de solicitud
  deleteRequestDetail(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
 */
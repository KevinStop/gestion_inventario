import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademicPeriodsService {

  private apiUrl = `${environment.apiUrl}/academic-periods`;

  constructor(private http: HttpClient) {}

  // Obtener todos los periodos académicos
  getAcademicPeriods(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener un periodo académico por ID
  getAcademicPeriodById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo periodo académico
  createAcademicPeriod(academicPeriod: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, academicPeriod);
  }

  // Actualizar un periodo académico
  updateAcademicPeriod(id: string, academicPeriod: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, academicPeriod);
  }

  // Eliminar un periodo académico
  deleteAcademicPeriod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  activateAcademicPeriod(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/activate`, {});
  }
  
}

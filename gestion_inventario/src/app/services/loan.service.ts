// src/app/services/loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;  // URL base para la API de loans

  constructor(private http: HttpClient) {}

  // Obtener todos los préstamos
  getLoans(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener los préstamos de un usuario específico
  getLoansByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  // Obtener los préstamos de una solicitud específica
  getLoansByRequestId(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/request/${requestId}`);
  }

  // Crear un nuevo préstamo
  createLoan(loanData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loanData);
  }

  // Actualizar un préstamo
  updateLoan(id: number, loanData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, loanData);
  }

  // Eliminar un préstamo
  deleteLoan(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Marcar un préstamo como "devuelto"
  returnLoan(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/return`, {});  // Cambia el estado a 'returned'
  }

  // Marcar un préstamo como "no devuelto"
  markLoanNotReturned(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/not-returned`, {});  // Cambia el estado a 'not_returned'
  }
}

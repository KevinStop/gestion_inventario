import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;  // URL base para la API de requests

  constructor(private http: HttpClient, private userService: UserService) { }

  // Obtener todas las solicitudes
  getRequests(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener una solicitud por ID
  getRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una solicitud
  createRequest(requestData: any, requestDetails: any[]): Observable<any> {
    const userId = this.userService.getUserId();
    if (!userId) {
      console.error('Error: Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
  
    const body = {
      userId,  // Enviar el userId
      requestDetails,
      ...requestData,  // Si hay otros datos de la solicitud
    };
  
    console.log('Payload enviado al backend:', body);
  
    return this.http.post<any>(`${this.apiUrl}/`, body);  // Enviar la solicitud al backend
  }

  // Actualizar una solicitud (aceptar, rechazar)
  updateRequest(id: number, requestData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestData);
  }

  // Eliminar una solicitud
  deleteRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener los componentes seleccionados desde localStorage
  getSelectedComponents(): any {
    const components = localStorage.getItem('selectedComponents');
    return components ? JSON.parse(components) : {};
  }

  // Almacenar los componentes seleccionados en localStorage
  setSelectedComponents(components: any): void {
    localStorage.setItem('selectedComponents', JSON.stringify(components));
  }

  addSelectedComponentToStorage(component: any, quantity: number): void {
    const userId = this.userService.getUserId();  // Verificar si el usuario está autenticado
    if (!userId) {
      console.error('No se puede almacenar en localStorage, el usuario no está autenticado.');
      return;  // Si no está autenticado, no se guarda nada
    }
    let selectedComponents = JSON.parse(localStorage.getItem('selectedComponents') || '[]');
    if (!Array.isArray(selectedComponents)) {
      selectedComponents = [];
    }
    const index = selectedComponents.findIndex((item: any) => item.id === component.id);
    if (index !== -1) {
      selectedComponents[index].quantity = quantity;
    } else {
      selectedComponents.push({ ...component, quantity });
    }
    localStorage.setItem('selectedComponents', JSON.stringify(selectedComponents));
  }
  
}

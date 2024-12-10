import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

interface SelectedComponent {
  id: number;
  quantity: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;

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
  createRequest(requestData: any, requestDetails: any[], file?: File): Observable<any> {
    const userId = Number(this.userService.getUserId());
    if (!userId) {
      console.error('Error: Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
  
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('description', requestData.description || '');
    formData.append('status', requestData.status || 'pendiente');
    
    // Enviar todo el array como un JSON
    formData.append('requestDetails', JSON.stringify(requestDetails));
  
    if (file) {
      formData.append('file', file, file.name);
    }
  
    console.log('Datos enviados al backend:');
    formData.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });
  
    return this.http.post<any>(`${this.apiUrl}/`, formData);
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
  getSelectedComponents(): SelectedComponent[] {
    const components = localStorage.getItem('selectedComponents');
    return components ? JSON.parse(components) : [];
  }

  // Almacenar los componentes seleccionados en localStorage
  setSelectedComponents(components: SelectedComponent[]): void {
    localStorage.setItem('selectedComponents', JSON.stringify(components));
  }  

  // Obtener el número de componentes seleccionados (conteo total)
  getSelectedComponentCount(): number {
    const selectedComponents = this.getSelectedComponents();
    return selectedComponents.reduce((total: number, component: SelectedComponent) => total + component.quantity, 0);
  }

  // Agregar un componente a la lista de seleccionados
  addSelectedComponentToStorage(component: SelectedComponent, quantity: number): void {
    const userId = this.userService.getUserId();  // Verificar si el usuario está autenticado
    if (!userId) {
      console.error('No se puede almacenar en localStorage, el usuario no está autenticado.');
      return;
    }
    let selectedComponents = this.getSelectedComponents();
    const index = selectedComponents.findIndex((item: SelectedComponent) => item.id === component.id);
    if (index !== -1) {
      selectedComponents[index].quantity = quantity;
    } else {
      selectedComponents.push({ ...component, quantity });
    }
    this.setSelectedComponents(selectedComponents);
  }

  // Eliminar un componente de la lista seleccionada
  removeSelectedComponentFromStorage(componentId: number): void {
    let selectedComponents = this.getSelectedComponents();
    selectedComponents = selectedComponents.filter((item: SelectedComponent) => item.id !== componentId);
    this.setSelectedComponents(selectedComponents);
  }
}

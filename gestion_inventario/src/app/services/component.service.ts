// src/app/services/component.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComponentElectronic } from '../models/component-electronic.model';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  private apiUrl = `${environment.apiUrl}/components`;

  constructor(private http: HttpClient) {}

  // Obtener todos los componentes
  getComponents(): Observable<ComponentElectronic[]> {
    return this.http.get<ComponentElectronic[]>(this.apiUrl);
  }

  // Obtener un componente por ID
  getComponentById(id: number): Observable<ComponentElectronic> {
    return this.http.get<ComponentElectronic>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo componente
  createComponent(component: ComponentElectronic): Observable<ComponentElectronic> {
    return this.http.post<ComponentElectronic>(this.apiUrl, component);
  }

  // Actualizar un componente
  updateComponent(id: number, component: ComponentElectronic): Observable<ComponentElectronic> {
    return this.http.put<ComponentElectronic>(`${this.apiUrl}/${id}`, component);
  }

  // Eliminar un componente
  deleteComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

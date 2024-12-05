import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  private apiUrl = `${environment.apiUrl}/components`;

  constructor(private http: HttpClient, private userService: UserService) { }

  // Obtener todos los componentes (sin paginación)
  getComponents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener un componente por ID
  getComponentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo componente
  createComponent(component: any, imageFile?: File): Observable<any> {
    const token = this.userService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('name', component.name);
    formData.append('categoryId', component.categoryId.toString());
    formData.append('quantity', component.quantity.toString());
    if (component.description) formData.append('description', component.description);
    if (imageFile) formData.append('image', imageFile);

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }

  // Actualizar un componente
  updateComponent(id: number, component: any, imageFile?: File): Observable<any> {
    const token = this.userService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('name', component.name);
    formData.append('categoryId', component.categoryId.toString());
    formData.append('quantity', component.quantity.toString());
    if (component.description) formData.append('description', component.description);
    formData.append('isActive', component.isActive.toString());
    if (imageFile) formData.append('image', imageFile);

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  // Eliminar un componente
  deleteComponent(id: number): Observable<any> {
    const token = this.userService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Buscar componentes por nombre
  searchComponentsByName(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Filtrar componentes por categorías
  filterComponentsByCategories(categoryIds: string[]): Observable<any> {
    const params = new HttpParams().set('categoryIds', categoryIds.join(','));
    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }

  // Obtener el conteo total de componentes
  getComponentCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  private apiUrl = `${environment.apiUrl}/components`;

  constructor(private http: HttpClient) { }

  // Obtener todos los componentes
  getComponents(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());  
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener un componente por ID
  getComponentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo componente
createComponent(component: any, imageFile?: File): Observable<any> {
  const formData = new FormData();
  formData.append('name', component.name);
  formData.append('categoryId', component.categoryId.toString());
  formData.append('quantity', component.quantity.toString());
  if (component.description) formData.append('description', component.description);
  formData.append('isActive', component.isActive.toString());
  if (imageFile) formData.append('image', imageFile);

  return this.http.post<any>(this.apiUrl, formData);
}

  // Actualizar un componente
  updateComponent(id: number, component: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', component.name);
    formData.append('categoryId', component.categoryId.toString());
    formData.append('quantity', component.quantity.toString());
    if (component.description) formData.append('description', component.description);
    formData.append('isActive', component.isActive.toString());
    if (imageFile) formData.append('image', imageFile);

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  // Eliminar un componente
  deleteComponent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Buscar componentes por nombre
  searchComponentsByName(name: string): Observable<any> {
    const params = new HttpParams().set('name', name); // Añadir el parámetro de búsqueda
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Filtrar componentes por categorías
  filterComponentsByCategories(categoryIds: string[]): Observable<any> {
    const params = new HttpParams().set('categoryIds', categoryIds.join(','));
    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }
}

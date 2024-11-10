import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users`);
    }

    getUserById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/${id}`);
    }

    createUser(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, userData);
    }

    updateUser(id: string, userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}`, userData);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }

    // Obtener todos los componentes
    getComponents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/components`);
    }

    // Obtener un componente por ID
    getComponentById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/components/${id}`);
    }

    // Crear un nuevo componente
    createComponent(componentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/components`, componentData);
    }

    // Actualizar un componente existente
    updateComponent(id: number, componentData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/components/${id}`, componentData);
    }

    // Cambiar el estado de un componente (activarlo/desactivarlo)
    toggleComponentStatus(id: number, isActive: boolean): Observable<any> {
        return this.http.patch(`${this.apiUrl}/components/${id}`, { is_active: isActive });
    }

    // Eliminar lógicamente un componente (cambiar estado a inactivo)
    softDeleteComponent(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/components/${id}`, { is_active: false });
    }

    // Eliminar permanentemente un componente
    deleteComponentPermanently(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/components/${id}/permanent`);
    }
}
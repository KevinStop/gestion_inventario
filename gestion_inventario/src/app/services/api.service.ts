import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

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
    
}
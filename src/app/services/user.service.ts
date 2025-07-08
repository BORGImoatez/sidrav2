import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserRole, Structure, TypeStructure, Gouvernorat } from '../models/user.model';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Gestion des utilisateurs
  getUsers(structureId?: number): Observable<User[]> {
    let url = `${this.apiUrl}/users`;
    if (structureId) {
      url += `?structureId=${structureId}`;
    }
    
    return this.http.get<User[]>(url, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la modification de l\'utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/users/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  toggleUserStatus(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/toggle-status`, {}, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du changement de statut:', error);
        return throwError(() => error);
      })
    );
  }

  // Gestion des structures
  getStructures(): Observable<Structure[]> {
    return this.http.get<Structure[]>(`${this.apiUrl}/structures`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des structures:', error);
        return throwError(() => error);
      })
    );
  }

  getStructureById(id: number): Observable<Structure | null> {
    return this.http.get<Structure>(`${this.apiUrl}/structures/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement de la structure:', error);
        return throwError(() => error);
      })
    );
  }

  createStructure(structureData: Partial<Structure>): Observable<Structure> {
    return this.http.post<Structure>(`${this.apiUrl}/structures`, structureData, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la création de la structure:', error);
        return throwError(() => error);
      })
    );
  }

  // Données de référence
  getGouvernorats(): Observable<Gouvernorat[]> {
    return this.http.get<Gouvernorat[]>(`${this.apiUrl}/gouvernorats`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des gouvernorats:', error);
        return throwError(() => error);
      })
    );
  }

  // Statistiques pour le dashboard
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques:', error);
        return throwError(() => error);
      })
    );
  }
}
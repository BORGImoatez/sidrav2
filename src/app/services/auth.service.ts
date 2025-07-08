import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, OtpRequest, OtpResponse, UserRole, TypeStructure } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Simulation des données pour le développement
  private mockUsers: User[] = [
    {
      id: 1,
      nom: 'Admin',
      prenom: 'Super',
      telephone: '21612345678',
      email: 'admin@sidra.tn',
      role: UserRole.SUPER_ADMIN,
      actif: true,
      dateCreation: new Date(),
      derniereConnexion: new Date()
    },
    {
      id: 2,
      nom: 'Bouali',
      prenom: 'Ahmed',
      telephone: '21687654321',
      email: 'ahmed.bouali@nicolle.tn',
      role: UserRole.ADMIN_STRUCTURE,
      structureId: 1,
      structure: {
        id: 1,
        nom: 'Hôpital Charles Nicolle',
        type: TypeStructure.PUBLIQUE,
        gouvernoratId: 1,
        secteur: 'Ministère de la Santé',
        actif: true
      },
      actif: true,
      dateCreation: new Date(),
      derniereConnexion: new Date()
    },
    {
      id: 3,
      nom: 'Trabelsi',
      prenom: 'Fatma',
      telephone: '21698765432',
      email: 'fatma.trabelsi@nicolle.tn',
      role: UserRole.UTILISATEUR,
      structureId: 1,
      structure: {
        id: 1,
        nom: 'Hôpital Charles Nicolle',
        type: TypeStructure.PUBLIQUE,
        gouvernoratId: 1,
        secteur: 'Ministère de la Santé',
        actif: true
      },
      actif: true,
      dateCreation: new Date(),
      derniereConnexion: new Date()
    },
    {
      id: 4,
      nom: 'Externe',
      prenom: 'Utilisateur',
      telephone: '21655443322',
      email: 'externe@sidra.tn',
      role: UserRole.EXTERNE,
      structureId: 2,
      structure: {
        id: 2,
        nom: 'Structure Externe',
        type: TypeStructure.ONG,
        gouvernoratId: 1,
        secteur: 'Externe',
        actif: true
      },
      actif: true,
      dateCreation: new Date(),
      derniereConnexion: new Date()
    }
  ];

  private loginAttempts = new Map<string, { count: number; blockedUntil?: Date }>();
  private otpCodes = new Map<number, { code: string; expiresAt: Date; attempts: number }>();

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('sidra_token');
    const userData = localStorage.getItem('sidra_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const { email, motDePasse } = request;
        
        // Vérifier si l'utilisateur est bloqué
        const attemptData = this.loginAttempts.get(email);
        if (attemptData?.blockedUntil && attemptData.blockedUntil > new Date()) {
          observer.next({
            success: false,
            message: `Compte bloqué jusqu'à ${attemptData.blockedUntil.toLocaleTimeString()}`,
            blockedUntil: attemptData.blockedUntil
          });
          observer.complete();
          return;
        }

        // Vérifier les identifiants (pour la démo, mot de passe = "123456")
        const user = this.mockUsers.find(u => u.email === email && u.actif);
        
        if (!user || motDePasse !== '123456') {
          this.handleFailedLogin(email);
          const currentAttempts = this.loginAttempts.get(email);
          
          observer.next({
            success: false,
            message: 'Identifiants invalides',
            remainingAttempts: Math.max(0, 3 - (currentAttempts?.count || 0))
          });
          observer.complete();
          return;
        }

        // Reset des tentatives en cas de succès
        this.loginAttempts.delete(email);

        // Générer le code OTP
        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        
        this.otpCodes.set(user.id, {
          code: otpCode,
          expiresAt,
          attempts: 0
        });

        console.log(`Code OTP pour ${user.prenom} ${user.nom}: ${otpCode}`);

        observer.next({
          success: true,
          message: 'Code OTP envoyé par SMS',
          requiresOtp: true,
          userId: user.id
        });
        observer.complete();
      }, 1000);
    });
  }

  verifyOtp(request: OtpRequest): Observable<OtpResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const { userId, code } = request;
        const user = this.mockUsers.find(u => u.id === userId);
        const otpData = this.otpCodes.get(userId);

        if (!user) {
          observer.next({
            success: false,
            message: 'Utilisateur non trouvé'
          });
          observer.complete();
          return;
        }

        if (!otpData) {
          observer.next({
            success: false,
            message: 'Code OTP expiré ou non généré'
          });
          observer.complete();
          return;
        }

        // Vérifier l'expiration
        if (otpData.expiresAt < new Date()) {
          this.otpCodes.delete(userId);
          observer.next({
            success: false,
            message: 'Code OTP expiré'
          });
          observer.complete();
          return;
        }

        // Vérifier le nombre de tentatives
        if (otpData.attempts >= 3) {
          const blockedUntil = new Date(Date.now() + Math.pow(2, otpData.attempts - 3) * 60 * 1000);
          observer.next({
            success: false,
            message: `Trop de tentatives. Réessayez dans ${Math.pow(2, otpData.attempts - 3)} minute(s)`,
            blockedUntil
          });
          observer.complete();
          return;
        }

        // Vérifier le code
        if (otpData.code !== code) {
          otpData.attempts++;
          this.otpCodes.set(userId, otpData);
          
          observer.next({
            success: false,
            message: 'Code OTP invalide',
            remainingAttempts: Math.max(0, 3 - otpData.attempts)
          });
          observer.complete();
          return;
        }

        // Succès - Nettoyer les données temporaires et authentifier
        this.otpCodes.delete(userId);
        const token = this.generateToken();
        const updatedUser = { ...user, derniereConnexion: new Date() };

        localStorage.setItem('sidra_token', token);
        localStorage.setItem('sidra_user', JSON.stringify(updatedUser));

        this.currentUserSubject.next(updatedUser);
        this.isAuthenticatedSubject.next(true);

        observer.next({
          success: true,
          message: 'Connexion réussie',
          token,
          user: updatedUser
        });
        observer.complete();
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem('sidra_token');
    localStorage.removeItem('sidra_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  canAccessAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN_STRUCTURE;
  }

  private handleFailedLogin(email: string): void {
    const currentAttempts = this.loginAttempts.get(email) || { count: 0 };
    currentAttempts.count++;

    if (currentAttempts.count >= 3) {
      // Blocage progressif: 1min, 2min, 4min, 8min...
      const blockDuration = Math.pow(2, currentAttempts.count - 3) * 60 * 1000;
      currentAttempts.blockedUntil = new Date(Date.now() + blockDuration);
    }

    this.loginAttempts.set(email, currentAttempts);
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9);
  }

  // Méthode pour obtenir un nouveau code OTP (en cas d'expiration)
  resendOtp(userId: number): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        
        if (!user) {
          observer.next({
            success: false,
            message: 'Utilisateur non trouvé'
          });
          observer.complete();
          return;
        }

        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        
        this.otpCodes.set(userId, {
          code: otpCode,
          expiresAt,
          attempts: 0
        });

        console.log(`Nouveau code OTP pour ${user.prenom} ${user.nom}: ${otpCode}`);

        observer.next({
          success: true,
          message: 'Nouveau code OTP envoyé'
        });
        observer.complete();
      }, 1000);
    });
  }
}
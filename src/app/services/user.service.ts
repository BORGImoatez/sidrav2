import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole, Structure, TypeStructure, Gouvernorat } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // Données de référence simulées
  private mockGouvernorats: Gouvernorat[] = [
    { id: 1, nom: 'Tunis', codeIso3: 'TUN' },
    { id: 2, nom: 'Ariana', codeIso3: 'ARI' },
    { id: 3, nom: 'Ben Arous', codeIso3: 'BEN' },
    { id: 4, nom: 'Manouba', codeIso3: 'MAN' },
    { id: 5, nom: 'Nabeul', codeIso3: 'NAB' },
    { id: 6, nom: 'Zaghouan', codeIso3: 'ZAG' },
    { id: 7, nom: 'Bizerte', codeIso3: 'BIZ' },
    { id: 8, nom: 'Béja', codeIso3: 'BEJ' },
    { id: 9, nom: 'Jendouba', codeIso3: 'JEN' },
    { id: 10, nom: 'Kef', codeIso3: 'KEF' },
    { id: 11, nom: 'Siliana', codeIso3: 'SIL' },
    { id: 12, nom: 'Sousse', codeIso3: 'SOU' },
    { id: 13, nom: 'Monastir', codeIso3: 'MON' },
    { id: 14, nom: 'Mahdia', codeIso3: 'MAH' },
    { id: 15, nom: 'Sfax', codeIso3: 'SFX' },
    { id: 16, nom: 'Kairouan', codeIso3: 'KAI' },
    { id: 17, nom: 'Kasserine', codeIso3: 'KAS' },
    { id: 18, nom: 'Sidi Bouzid', codeIso3: 'SID' },
    { id: 19, nom: 'Gabès', codeIso3: 'GAB' },
    { id: 20, nom: 'Médenine', codeIso3: 'MED' },
    { id: 21, nom: 'Tataouine', codeIso3: 'TAT' },
    { id: 22, nom: 'Gafsa', codeIso3: 'GAF' },
    { id: 23, nom: 'Tozeur', codeIso3: 'TOZ' },
    { id: 24, nom: 'Kébili', codeIso3: 'KEB' }
  ];

  private mockStructures: Structure[] = [
    {
      id: 1,
      nom: 'Hôpital Charles Nicolle',
      type: TypeStructure.PUBLIQUE,
      gouvernoratId: 1,
      secteur: 'Ministère de la Santé',
      adresse: 'Boulevard 9 Avril 1938, Tunis',
      telephone: '71663000',
      actif: true
    },
    {
      id: 2,
      nom: 'Hôpital La Rabta',
      type: TypeStructure.PUBLIQUE,
      gouvernoratId: 1,
      secteur: 'Ministère de la Santé',
      adresse: 'Rue Jebel Lakhdhar, Tunis',
      telephone: '71573000',
      actif: true
    },
    {
      id: 3,
      nom: 'Clinique Avicenne',
      type: TypeStructure.PRIVEE,
      gouvernoratId: 1,
      secteur: 'Secteur Privé',
      adresse: 'Avenue Habib Bourguiba, Tunis',
      telephone: '71340000',
      actif: true
    },
    {
      id: 4,
      nom: 'Association Tunisienne de Lutte contre les Drogues',
      type: TypeStructure.ONG,
      gouvernoratId: 1,
      secteur: 'ATLD',
      adresse: 'Rue de la Liberté, Tunis',
      telephone: '71456789',
      actif: true
    }
  ];

  private mockUsers: User[] = [
    {
      id: 1,
      nom: 'Admin',
      prenom: 'Super',
      telephone: '21612345678',
      email: 'admin@sidra.tn',
      role: UserRole.SUPER_ADMIN,
      actif: true,
      dateCreation: new Date('2024-01-01'),
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
      actif: true,
      dateCreation: new Date('2024-01-15'),
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
      actif: true,
      dateCreation: new Date('2024-02-01'),
      derniereConnexion: new Date('2024-12-10')
    },
    {
      id: 4,
      nom: 'Ben Salem',
      prenom: 'Mohamed',
      telephone: '21655443322',
      email: 'mohamed.bensalem@rabta.tn',
      role: UserRole.ADMIN_STRUCTURE,
      structureId: 2,
      actif: true,
      dateCreation: new Date('2024-02-15'),
      derniereConnexion: new Date('2024-12-08')
    },
    {
      id: 5,
      nom: 'Externe',
      prenom: 'Utilisateur',
      telephone: '21655443322',
      email: 'externe@sidra.tn',
      role: UserRole.EXTERNE,
      structureId: 2,
      actif: true,
      dateCreation: new Date('2024-03-01'),
      derniereConnexion: new Date('2024-12-12')
    }
  ];

  constructor() { }

  // Gestion des utilisateurs
  getUsers(structureId?: number): Observable<User[]> {
    return new Observable(observer => {
      setTimeout(() => {
        let users = [...this.mockUsers];
        
        if (structureId) {
          users = users.filter(u => u.structureId === structureId);
        }

        // Ajouter les informations de structure
        users = users.map(user => ({
          ...user,
          structure: user.structureId ? this.mockStructures.find(s => s.id === user.structureId) : undefined
        }));

        observer.next(users);
        observer.complete();
      }, 500);
    });
  }

  getUserById(id: number): Observable<User | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (user && user.structureId) {
          user.structure = this.mockStructures.find(s => s.id === user.structureId);
        }
        observer.next(user || null);
        observer.complete();
      }, 300);
    });
  }

  createUser(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        if (!userData.nom || !userData.prenom || !userData.email || !userData.role) {
          observer.error({ message: 'Données utilisateur incomplètes' });
          return;
        }

        // Vérifier si l'email existe déjà
        if (this.mockUsers.some(u => u.email === userData.email)) {
          observer.error({ message: 'Cette adresse email est déjà utilisée' });
          return;
        }

        // Vérifier si le téléphone existe déjà
        if (userData.telephone && this.mockUsers.some(u => u.telephone === userData.telephone)) {
          observer.error({ message: 'Ce numéro de téléphone est déjà utilisé' });
          return;
        }

        const newUser: User = {
          id: Math.max(...this.mockUsers.map(u => u.id)) + 1,
          nom: userData.nom!,
          prenom: userData.prenom!,
          telephone: userData.telephone || '',
          email: userData.email!,
          role: userData.role!,
          structureId: userData.structureId,
          actif: true,
          dateCreation: new Date(),
          derniereConnexion: undefined
        };

        if (newUser.structureId) {
          newUser.structure = this.mockStructures.find(s => s.id === newUser.structureId);
        }

        this.mockUsers.push(newUser);
        observer.next(newUser);
        observer.complete();
      }, 800);
    });
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const userIndex = this.mockUsers.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          observer.error({ message: 'Utilisateur non trouvé' });
          return;
        }

        // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
        if (userData.email && this.mockUsers.some(u => u.email === userData.email && u.id !== id)) {
          observer.error({ message: 'Cette adresse email est déjà utilisée' });
          return;
        }

        // Vérifier si le téléphone existe déjà (sauf pour cet utilisateur)
        if (userData.telephone && this.mockUsers.some(u => u.telephone === userData.telephone && u.id !== id)) {
          observer.error({ message: 'Ce numéro de téléphone est déjà utilisé' });
          return;
        }

        const updatedUser = {
          ...this.mockUsers[userIndex],
          ...userData,
          id // Assurer que l'ID ne change pas
        };

        if (updatedUser.structureId) {
          updatedUser.structure = this.mockStructures.find(s => s.id === updatedUser.structureId);
        }

        this.mockUsers[userIndex] = updatedUser;
        observer.next(updatedUser);
        observer.complete();
      }, 800);
    });
  }

  deleteUser(id: number): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const userIndex = this.mockUsers.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          observer.error({ message: 'Utilisateur non trouvé' });
          return;
        }

        this.mockUsers.splice(userIndex, 1);
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  toggleUserStatus(id: number): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        
        if (!user) {
          observer.error({ message: 'Utilisateur non trouvé' });
          return;
        }

        user.actif = !user.actif;
        
        if (user.structureId) {
          user.structure = this.mockStructures.find(s => s.id === user.structureId);
        }

        observer.next(user);
        observer.complete();
      }, 500);
    });
  }

  // Gestion des structures
  getStructures(): Observable<Structure[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const structures = this.mockStructures.map(structure => ({
          ...structure,
          gouvernorat: this.mockGouvernorats.find(g => g.id === structure.gouvernoratId)
        }));
        observer.next(structures);
        observer.complete();
      }, 300);
    });
  }

  getStructureById(id: number): Observable<Structure | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const structure = this.mockStructures.find(s => s.id === id);
        if (structure) {
          structure.gouvernorat = this.mockGouvernorats.find(g => g.id === structure.gouvernoratId);
        }
        observer.next(structure || null);
        observer.complete();
      }, 300);
    });
  }

  createStructure(structureData: Partial<Structure>): Observable<Structure> {
    return new Observable(observer => {
      setTimeout(() => {
        if (!structureData.nom || !structureData.type || !structureData.gouvernoratId) {
          observer.error({ message: 'Données structure incomplètes' });
          return;
        }

        const newStructure: Structure = {
          id: Math.max(...this.mockStructures.map(s => s.id)) + 1,
          nom: structureData.nom!,
          type: structureData.type!,
          gouvernoratId: structureData.gouvernoratId!,
          secteur: structureData.secteur || '',
          adresse: structureData.adresse,
          telephone: structureData.telephone,
          actif: true
        };

        newStructure.gouvernorat = this.mockGouvernorats.find(g => g.id === newStructure.gouvernoratId);
        this.mockStructures.push(newStructure);
        observer.next(newStructure);
        observer.complete();
      }, 800);
    });
  }

  // Données de référence
  getGouvernorats(): Observable<Gouvernorat[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([...this.mockGouvernorats]);
        observer.complete();
      }, 200);
    });
  }

  getTypeStructures(): Observable<{ value: TypeStructure; label: string }[]> {
    return of([
      { value: TypeStructure.PUBLIQUE, label: 'Publique' },
      { value: TypeStructure.PRIVEE, label: 'Privée' },
      { value: TypeStructure.ONG, label: 'ONG' }
    ]);
  }

  getUserRoles(): Observable<{ value: UserRole; label: string }[]> {
    return of([
      { value: UserRole.SUPER_ADMIN, label: 'Super Administrateur' },
      { value: UserRole.ADMIN_STRUCTURE, label: 'Administrateur Structure' },
      { value: UserRole.UTILISATEUR, label: 'Utilisateur' }
    ]);
  }

  // Statistiques pour le dashboard
  getStatistics(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const stats = {
          totalUsers: this.mockUsers.length,
          activeUsers: this.mockUsers.filter(u => u.actif).length,
          totalStructures: this.mockStructures.length,
          activeStructures: this.mockStructures.filter(s => s.actif).length,
          usersByRole: {
            [UserRole.SUPER_ADMIN]: this.mockUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length,
            [UserRole.ADMIN_STRUCTURE]: this.mockUsers.filter(u => u.role === UserRole.ADMIN_STRUCTURE).length,
            [UserRole.UTILISATEUR]: this.mockUsers.filter(u => u.role === UserRole.UTILISATEUR).length
          },
          structuresByType: {
            [TypeStructure.PUBLIQUE]: this.mockStructures.filter(s => s.type === TypeStructure.PUBLIQUE).length,
            [TypeStructure.PRIVEE]: this.mockStructures.filter(s => s.type === TypeStructure.PRIVEE).length,
            [TypeStructure.ONG]: this.mockStructures.filter(s => s.type === TypeStructure.ONG).length
          }
        };
        observer.next(stats);
        observer.complete();
      }, 600);
    });
  }
}
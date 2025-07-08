import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OffreDrogues, OffreDroguesListItem } from '../models/offre-drogues.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OffreDroguesService {
  
  private mockData: OffreDrogues[] = [
    {
      id: 1,
      dateSaisie: new Date('2024-12-01'),
      structureId: 1,
      structure: {
        id: 1,
        nom: 'Hôpital Charles Nicolle',
        type: 'Publique'
      },
      utilisateurId: 2,
      utilisateur: {
        id: 2,
        nom: 'Bouali',
        prenom: 'Ahmed'
      },
      quantitesDrogues: {
        cannabis: 15.5,
        comprimesTableauA: 120,
        ecstasyComprime: 45,
        ecstasyPoudre: 2.3,
        subutex: 78,
        cocaine: 1.2,
        heroine: 0.8
      },
      personnesInculpees: {
        consommateur: { nombre: 25, pourcentage: 62.5 },
        vendeur: { nombre: 10, pourcentage: 25.0 },
        trafiquant: { nombre: 5, pourcentage: 12.5 }
      },
      caracteristiquesSociodemographiques: {
        genre: {
          masculin: { nombre: 32, pourcentage: 80.0 },
          feminin: { nombre: 8, pourcentage: 20.0 }
        },
        age: {
          moins12ans: { nombre: 0, pourcentage: 0.0 },
          moins18ans: { nombre: 5, pourcentage: 12.5 },
          entre18et40: { nombre: 30, pourcentage: 75.0 },
          plus40ans: { nombre: 5, pourcentage: 12.5 }
        },
        nationalite: {
          tunisienne: { nombre: 35, pourcentage: 87.5 },
          maghrebine: { nombre: 3, pourcentage: 7.5 },
          autres: { nombre: 2, pourcentage: 5.0 }
        },
        etatCivil: {
          celibataire: { nombre: 28, pourcentage: 70.0 },
          marie: { nombre: 8, pourcentage: 20.0 },
          divorce: { nombre: 3, pourcentage: 7.5 },
          veuf: { nombre: 1, pourcentage: 2.5 }
        },
        etatProfessionnel: {
          eleve: { nombre: 5, pourcentage: 12.5 },
          etudiant: { nombre: 8, pourcentage: 20.0 },
          ouvrier: { nombre: 15, pourcentage: 37.5 },
          fonctionnaire: { nombre: 12, pourcentage: 30.0 }
        },
        niveauSocioeconomique: {
          carteIndigent: { nombre: 10, pourcentage: 25.0 },
          carnetCnamPublique: { nombre: 15, pourcentage: 37.5 },
          carnetCnamFamille: { nombre: 10, pourcentage: 25.0 },
          carnetCnamRemboursement: { nombre: 5, pourcentage: 12.5 }
        }
      },
      dateCreation: new Date('2024-12-01T10:30:00'),
      dateModification: new Date('2024-12-01T10:30:00')
    }
  ];

  constructor(private authService: AuthService) {}

  getOffresDrogues(): Observable<OffreDroguesListItem[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const listItems: OffreDroguesListItem[] = this.mockData.map(item => ({
          id: item.id!,
          dateSaisie: item.dateSaisie,
          structure: item.structure!,
          utilisateur: item.utilisateur!,
          dateCreation: item.dateCreation!
        }));
        observer.next(listItems);
        observer.complete();
      }, 500);
    });
  }

  getOffreDroguesById(id: number): Observable<OffreDrogues | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const item = this.mockData.find(d => d.id === id);
        observer.next(item || null);
        observer.complete();
      }, 300);
    });
  }

  createOffreDrogues(data: Partial<OffreDrogues>): Observable<OffreDrogues> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.authService.getCurrentUser();
        
        const newItem: OffreDrogues = {
          id: Math.max(...this.mockData.map(d => d.id || 0)) + 1,
          dateSaisie: data.dateSaisie!,
          structureId: currentUser?.structureId,
          structure: currentUser?.structure ? {
            id: currentUser.structure.id,
            nom: currentUser.structure.nom,
            type: currentUser.structure.type
          } : undefined,
          utilisateurId: currentUser?.id,
          utilisateur: currentUser ? {
            id: currentUser.id,
            nom: currentUser.nom,
            prenom: currentUser.prenom
          } : undefined,
          quantitesDrogues: data.quantitesDrogues!,
          personnesInculpees: data.personnesInculpees!,
          caracteristiquesSociodemographiques: data.caracteristiquesSociodemographiques!,
          dateCreation: new Date(),
          dateModification: new Date()
        };

        this.mockData.push(newItem);
        observer.next(newItem);
        observer.complete();
      }, 800);
    });
  }

  updateOffreDrogues(id: number, data: Partial<OffreDrogues>): Observable<OffreDrogues> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockData.findIndex(d => d.id === id);
        
        if (index === -1) {
          observer.error({ message: 'Données non trouvées' });
          return;
        }

        const updatedItem = {
          ...this.mockData[index],
          ...data,
          id,
          dateModification: new Date()
        };

        this.mockData[index] = updatedItem;
        observer.next(updatedItem);
        observer.complete();
      }, 800);
    });
  }

  deleteOffreDrogues(id: number): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockData.findIndex(d => d.id === id);
        
        if (index === -1) {
          observer.error({ message: 'Données non trouvées' });
          return;
        }

        this.mockData.splice(index, 1);
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
    return this.http.get<OffreDroguesListItem[]>(`${this.apiUrl}/offre-drogues`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des données:', error);
        return throwError(() => error);
      })
    );
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
    return this.http.get<number>(`${this.apiUrl}/offre-drogues/statistics`, { 
      headers: this.authService.getAuthHeaders() 
    });
    return this.http.get<OffreDrogues>(`${this.apiUrl}/offre-drogues/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des données:', error);
        return throwError(() => error);
      })
    );

  private mapToCreateRequest(data: Partial<OffreDrogues>): any {
    return {
    // Préparer les données pour l'API backend
    const createRequest = this.mapToCreateRequest(data);
    
    return this.http.post<OffreDrogues>(`${this.apiUrl}/offre-drogues`, createRequest, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la création:', error);
        return throwError(() => error);
      })
    );
      tunisienneNombre: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.nombre,
      tunisiennePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.pourcentage,
      maghrebineNombre: data.caracteristiquesSociodemographiques?.nationalite?.maghrebine?.nombre,
    // Préparer les données pour l'API backend
    const updateRequest = this.mapToUpdateRequest(data);
    
    return this.http.put<OffreDrogues>(`${this.apiUrl}/offre-drogues/${id}`, updateRequest, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la modification:', error);
        return throwError(() => error);
      })
    );
      // Niveau socioéconomique
      carteIndigentNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.nombre,
      carteIndigentPourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.pourcentage,
    return this.http.delete<boolean>(`${this.apiUrl}/offre-drogues/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression:', error);
        return throwError(() => error);
      })
    );
  }

  getStatistics(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/offre-drogues/statistics`, { 
      headers: this.authService.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques:', error);
        return throwError(() => error);
      })
    );
  }

  private mapToCreateRequest(data: Partial<OffreDrogues>): any {
    return {
      dateSaisie: data.dateSaisie,
      // Quantités de drogues
      cannabis: data.quantitesDrogues?.cannabis,
      comprimesTableauA: data.quantitesDrogues?.comprimesTableauA,
      ecstasyComprime: data.quantitesDrogues?.ecstasyComprime,
      ecstasyPoudre: data.quantitesDrogues?.ecstasyPoudre,
      subutex: data.quantitesDrogues?.subutex,
      cocaine: data.quantitesDrogues?.cocaine,
      heroine: data.quantitesDrogues?.heroine,
      // Personnes inculpées
      consommateurNombre: data.personnesInculpees?.consommateur?.nombre,
      consommateurPourcentage: data.personnesInculpees?.consommateur?.pourcentage,
      vendeurNombre: data.personnesInculpees?.vendeur?.nombre,
      vendeurPourcentage: data.personnesInculpees?.vendeur?.pourcentage,
      trafiquantNombre: data.personnesInculpees?.trafiquant?.nombre,
      trafiquantPourcentage: data.personnesInculpees?.trafiquant?.pourcentage,
      // Caractéristiques sociodémographiques - Genre
      masculinNombre: data.caracteristiquesSociodemographiques?.genre?.masculin?.nombre,
      masculinPourcentage: data.caracteristiquesSociodemographiques?.genre?.masculin?.pourcentage,
      femininNombre: data.caracteristiquesSociodemographiques?.genre?.feminin?.nombre,
      femininPourcentage: data.caracteristiquesSociodemographiques?.genre?.feminin?.pourcentage,
      // Age
      moins12ansNombre: data.caracteristiquesSociodemographiques?.age?.moins12ans?.nombre,
      moins12ansPourcentage: data.caracteristiquesSociodemographiques?.age?.moins12ans?.pourcentage,
      moins18ansNombre: data.caracteristiquesSociodemographiques?.age?.moins18ans?.nombre,
      moins18ansPourcentage: data.caracteristiquesSociodemographiques?.age?.moins18ans?.pourcentage,
      entre18et40Nombre: data.caracteristiquesSociodemographiques?.age?.entre18et40?.nombre,
      entre18et40Pourcentage: data.caracteristiquesSociodemographiques?.age?.entre18et40?.pourcentage,
      plus40ansNombre: data.caracteristiquesSociodemographiques?.age?.plus40ans?.nombre,
      plus40ansPourcentage: data.caracteristiquesSociodemographiques?.age?.plus40ans?.pourcentage,
      // Nationalité
      tunisienneNombre: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.nombre,
      tunisiennePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.pourcentage,
      maghrebineNombre: data.caracteristiquesSociodemographiques?.nationalite?.maghrebine?.nombre,
      maghrebinePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.maghrebine?.pourcentage,
      autresNationaliteNombre: data.caracteristiquesSociodemographiques?.nationalite?.autres?.nombre,
      autresNationalitePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.autres?.pourcentage,
      // État civil
      celibataireNombre: data.caracteristiquesSociodemographiques?.etatCivil?.celibataire?.nombre,
      celibatairePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.celibataire?.pourcentage,
      marieNombre: data.caracteristiquesSociodemographiques?.etatCivil?.marie?.nombre,
      mariePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.marie?.pourcentage,
      divorceNombre: data.caracteristiquesSociodemographiques?.etatCivil?.divorce?.nombre,
      divorcePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.divorce?.pourcentage,
      veufNombre: data.caracteristiquesSociodemographiques?.etatCivil?.veuf?.nombre,
      veufPourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.veuf?.pourcentage,
      // État professionnel
      eleveNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.eleve?.nombre,
      elevePourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.eleve?.pourcentage,
      etudiantNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.etudiant?.nombre,
      etudiantPourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.etudiant?.pourcentage,
      ouvrierNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.ouvrier?.nombre,
      ouvrierPourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.ouvrier?.pourcentage,
      fonctionnaireNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.fonctionnaire?.nombre,
      fonctionnairePourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.fonctionnaire?.pourcentage,
      // Niveau socioéconomique
      carteIndigentNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.nombre,
      carteIndigentPourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.pourcentage,
      carnetCnamPubliqueNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamPublique?.nombre,
      carnetCnamPubliquePourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamPublique?.pourcentage,
      carnetCnamFamilleNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamFamille?.nombre,
      carnetCnamFamillePourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamFamille?.pourcentage,
      carnetCnamRemboursementNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamRemboursement?.nombre,
      carnetCnamRemboursementPourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamRemboursement?.pourcentage
    };
  }

  private mapToUpdateRequest(data: Partial<OffreDrogues>): any {
    return this.mapToCreateRequest(data); // Même structure pour la mise à jour
  }
}
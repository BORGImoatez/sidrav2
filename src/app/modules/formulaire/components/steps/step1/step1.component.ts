import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 1 : Informations structure/centre & usager SPA</h2>
        <p class="step-description">
          Renseignez les informations sur la structure et l'usager SPA
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Section Structure -->
          <div class="form-section">
            <h3 class="section-title">Informations sur la structure</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Secteur</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.secteur"
                  name="secteur"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner un secteur</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVE">Privé</option>
                  <option value="ONG">ONG</option>
                  <option value="SOCIETE_CIVILE_ONG">Société civile/ONG</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.secteur === 'ONG' || localData.secteur === 'SOCIETE_CIVILE_ONG'">
                <label class="form-label required">Précision ONG</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.ongPrecision"
                  name="ongPrecision"
                  placeholder="Nom de l'ONG"
                  required
                >
              </div>

              <div class="form-group" *ngIf="localData.secteur === 'PUBLIC'">
                <label class="form-label">Ministère</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.ministere"
                  name="ministere"
                >
                  <option value="">Sélectionner un ministère</option>
                  <option value="SANTE">Ministère de la Santé</option>
                  <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                  <option value="EDUCATION">Ministère de l'Éducation</option>
                  <option value="JEUNESSE_SPORT">Ministère de la Jeunesse et du Sport</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Structure</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.structure"
                  name="structure"
                  placeholder="Nom de la structure"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Gouvernorat de la structure</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.gouvernoratStructure"
                  name="gouvernoratStructure"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner un gouvernorat</option>
                  <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section Usager -->
          <div class="form-section">
            <h3 class="section-title">Informations sur l'usager SPA</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Nom</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.nom"
                  name="nom"
                  placeholder="Nom de famille"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Prénom</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.prenom"
                  name="prenom"
                  placeholder="Prénom"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Code patient</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.codePatient"
                  name="codePatient"
                  placeholder="Code d'identification du patient"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Date de consultation</label>
                <input 
                  type="date" 
                  class="form-input"
                  [(ngModel)]="localData.dateConsultation"
                  name="dateConsultation"
                  (change)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Genre</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.genre"
                  name="genre"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Date de naissance</label>
                <input 
                  type="date" 
                  class="form-input"
                  [(ngModel)]="localData.dateNaissance"
                  name="dateNaissance"
                  (change)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Nationalité</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.nationalite"
                  name="nationalite"
                  placeholder="Nationalité"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Résidence</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.residence"
                  name="residence"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="TUNISIE">Tunisie</option>
                  <option value="ETRANGER">Étranger</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.residence === 'TUNISIE'">
                <label class="form-label required">Gouvernorat de résidence</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.gouvernoratResidence"
                  name="gouvernoratResidence"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner un gouvernorat</option>
                  <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.residence === 'TUNISIE' && localData.gouvernoratResidence">
                <label class="form-label">Délégation de résidence</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.delegationResidence"
                  name="delegationResidence"
                  placeholder="Délégation"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group" *ngIf="localData.residence === 'ETRANGER'">
                <label class="form-label required">Pays de résidence</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="localData.paysResidence"
                  name="paysResidence"
                  placeholder="Pays de résidence"
                  (input)="onFieldChange()"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Section Cadre de consultation -->
          <div class="form-section">
            <h3 class="section-title">Cadre de consultation (plusieurs choix possibles)</h3>
            
            <div class="checkbox-grid">
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.cadreConsultation!.addictologie"
                    name="addictologie"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Addictologie</span>
                </label>
                
                <div class="sub-options" *ngIf="localData.cadreConsultation!.addictologie">
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.cadreConsultation!.addictologieType"
                    name="addictologieType"
                    (change)="onFieldChange()"
                  >
                    <option value="">Type d'addictologie</option>
                    <option value="SEVRAGE">Sevrage</option>
                    <option value="GESTION_ADDICTION">Gestion de l'addiction</option>
                    <option value="RISQUE_RECHUTE">Risque de rechute</option>
                  </select>
                </div>
              </div>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.psychiatrie"
                  name="psychiatrie"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Psychiatrie</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.psychologique"
                  name="psychologique"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Psychologique</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.medecineGenerale"
                  name="medecineGenerale"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Médecine générale</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.neurologique"
                  name="neurologique"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Neurologique</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.infectieux"
                  name="infectieux"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Infectieux</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.espaceAmisJeunes"
                  name="espaceAmisJeunes"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Espace amis des jeunes</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.echangeMateriel"
                  name="echangeMateriel"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Échange de matériel</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.rehabilitation"
                  name="rehabilitation"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Réhabilitation</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.urgenceMedicale"
                  name="urgenceMedicale"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Urgence médicale</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.urgenceChirurgicale"
                  name="urgenceChirurgicale"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Urgence chirurgicale</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.cadreConsultation!.depistage"
                  name="depistage"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Dépistage</span>
              </label>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.cadreConsultation!.autre"
                    name="cadreAutre"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Autre</span>
                </label>
                
                <div class="sub-options" *ngIf="localData.cadreConsultation!.autre">
                  <input 
                    type="text" 
                    class="form-input"
                    [(ngModel)]="localData.cadreConsultation!.autrePrecision"
                    name="cadreAutrePrecision"
                    placeholder="Préciser"
                    (input)="onFieldChange()"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Section Origine de la demande -->
          <div class="form-section">
            <h3 class="section-title">Origine de la demande (plusieurs choix possibles)</h3>
            
            <div class="checkbox-grid">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.luiMeme"
                  name="luiMeme"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Lui-même</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.famille"
                  name="famille"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Famille</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.amis"
                  name="amis"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Amis</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.celluleEcoute"
                  name="celluleEcoute"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Cellule d'écoute</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.autreCentre"
                  name="autreCentre"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Autre centre</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.structureSociale"
                  name="structureSociale"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Structure sociale</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.structureJudiciaire"
                  name="structureJudiciaire"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Structure judiciaire</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.origineDemande!.jugeEnfance"
                  name="jugeEnfance"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Juge de l'enfance</span>
              </label>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.origineDemande!.autre"
                    name="origineAutre"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Autre</span>
                </label>
                
                <div class="sub-options" *ngIf="localData.origineDemande!.autre">
                  <input 
                    type="text" 
                    class="form-input"
                    [(ngModel)]="localData.origineDemande!.autrePrecision"
                    name="origineAutrePrecision"
                    placeholder="Préciser"
                    (input)="onFieldChange()"
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .step-container {
      margin-bottom: var(--spacing-6);
    }

    .step-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-2) 0;
    }

    .step-description {
      color: var(--gray-600);
      margin: 0;
    }

    .form-section {
      margin-bottom: var(--spacing-8);
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-6) 0;
      padding-bottom: var(--spacing-3);
      border-bottom: 2px solid var(--primary-200);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-4);
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-4);
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      cursor: pointer;
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease-in-out;
    }

    .checkbox-label:hover {
      background-color: var(--gray-50);
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .checkbox-text {
      font-weight: 500;
      color: var(--gray-700);
    }

    .sub-options {
      margin-left: var(--spacing-6);
      margin-top: var(--spacing-2);
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .checkbox-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Step1Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};

  gouvernorats = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
  ];

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.localData = {
      ...this.data,
      cadreConsultation: this.data.cadreConsultation || {},
      origineDemande: this.data.origineDemande || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    const required = [
      'secteur', 'structure', 'gouvernoratStructure', 'nom', 'prenom',
      'codePatient', 'dateConsultation', 'genre', 'dateNaissance',
      'nationalite', 'residence'
    ];

    // Check conditional required fields
    if (this.localData.secteur === 'ONG' || this.localData.secteur === 'SOCIETE_CIVILE_ONG') {
      required.push('ongPrecision');
    }

    if (this.localData.residence === 'TUNISIE') {
      required.push('gouvernoratResidence');
    }

    if (this.localData.residence === 'ETRANGER') {
      required.push('paysResidence');
    }

    // Check if at least one cadre de consultation is selected
    const cadreSelected = Object.values(this.localData.cadreConsultation || {}).some(value => value === true);
    
    // Check if at least one origine de demande is selected
    const origineSelected = Object.values(this.localData.origineDemande || {}).some(value => value === true);

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    }) && cadreSelected && origineSelected;

    this.validationChange.emit(isValid);
  }
}
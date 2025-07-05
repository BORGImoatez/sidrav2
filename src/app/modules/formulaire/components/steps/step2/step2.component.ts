import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 2 : Consommation tabac & alcool</h2>
        <p class="step-description">
          Renseignez les informations sur la consommation de tabac et d'alcool
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Section Tabac -->
          <div class="form-section">
            <h3 class="section-title">Consommation de tabac</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Statut tabagique</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.consommationTabac"
                  name="consommationTabac"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="FUMEUR">Fumeur</option>
                  <option value="NON_FUMEUR">Non fumeur</option>
                  <option value="EX_FUMEUR">Ex-fumeur</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'FUMEUR' || localData.consommationTabac === 'EX_FUMEUR'">
                <label class="form-label required">Âge de première consommation</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.agePremiereConsommationTabac"
                  name="agePremiereConsommationTabac"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'FUMEUR'">
                <label class="form-label required">Consommation dans les 30 derniers jours</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.consommationTabac30Jours"
                  name="consommationTabac30Jours"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'FUMEUR' && localData.consommationTabac30Jours">
                <label class="form-label required">Fréquence dans les 30 derniers jours</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.frequenceTabac30Jours"
                  name="frequenceTabac30Jours"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="QUOTIDIEN">Quotidien</option>
                  <option value="2_3_JOURS">2-3 jours par semaine</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="OCCASIONNEL">Occasionnel</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'FUMEUR' && localData.frequenceTabac30Jours === 'QUOTIDIEN'">
                <label class="form-label">Nombre de cigarettes par jour</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.nombreCigarettesJour"
                  name="nombreCigarettesJour"
                  placeholder="Nombre de cigarettes"
                  min="1"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'FUMEUR'">
                <label class="form-label">Nombre de paquets-année</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.nombrePaquetsAnnee"
                  name="nombrePaquetsAnnee"
                  placeholder="Paquets-année"
                  min="0"
                  step="0.1"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'EX_FUMEUR'">
                <label class="form-label">Âge d'arrêt du tabac</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.ageArretTabac"
                  name="ageArretTabac"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'EX_FUMEUR'">
                <label class="form-label">Soins de sevrage tabagique</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.soinsSevrageTabac"
                  name="soinsSevrageTabac"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option value="OUI_SATISFAIT">Oui, satisfait</option>
                  <option value="OUI_NON_SATISFAIT">Oui, non satisfait</option>
                  <option value="NON">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationTabac === 'EX_FUMEUR'">
                <label class="form-label">Sevrage assisté</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.sevrageAssiste"
                  name="sevrageAssiste"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section Alcool -->
          <div class="form-section">
            <h3 class="section-title">Consommation d'alcool</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Consommation d'alcool</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.consommationAlcool"
                  name="consommationAlcool"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationAlcool">
                <label class="form-label required">Âge de première consommation</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.agePremiereConsommationAlcool"
                  name="agePremiereConsommationAlcool"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
                  required
                >
              </div>

              <div class="form-group" *ngIf="localData.consommationAlcool">
                <label class="form-label required">Consommation dans les 30 derniers jours</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.consommationAlcool30Jours"
                  name="consommationAlcool30Jours"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationAlcool && localData.consommationAlcool30Jours">
                <label class="form-label required">Fréquence dans les 30 derniers jours</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.frequenceAlcool30Jours"
                  name="frequenceAlcool30Jours"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="QUOTIDIEN">Quotidien</option>
                  <option value="2_3_JOURS">2-3 jours par semaine</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="OCCASIONNEL">Occasionnel</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.consommationAlcool && localData.consommationAlcool30Jours">
                <label class="form-label">Quantité d'alcool prise (en verres)</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.quantiteAlcoolPrise"
                  name="quantiteAlcoolPrise"
                  placeholder="Nombre de verres"
                  min="1"
                  (input)="onFieldChange()"
                >
              </div>
            </div>

            <!-- Types d'alcool -->
            <div class="form-section" *ngIf="localData.consommationAlcool">
              <h4 class="subsection-title">Types d'alcool consommés (plusieurs choix possibles)</h4>
              
              <div class="checkbox-grid">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeAlcool!.biere"
                    name="biere"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Bière</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeAlcool!.liqueurs"
                    name="liqueurs"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Liqueurs</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeAlcool!.alcoolBruler"
                    name="alcoolBruler"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Alcool à brûler</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeAlcool!.legmi"
                    name="legmi"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Legmi</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeAlcool!.boukha"
                    name="boukha"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Boukha</span>
                </label>
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

    .subsection-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 var(--spacing-4) 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-4);
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-3);
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
export class Step2Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.localData = {
      ...this.data,
      typeAlcool: this.data.typeAlcool || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    const required = ['consommationTabac', 'consommationAlcool'];

    // Conditional required fields for tobacco
    if (this.localData.consommationTabac === 'FUMEUR' || this.localData.consommationTabac === 'EX_FUMEUR') {
      required.push('agePremiereConsommationTabac');
    }

    if (this.localData.consommationTabac === 'FUMEUR') {
      required.push('consommationTabac30Jours');
      
      if (this.localData.consommationTabac30Jours) {
        required.push('frequenceTabac30Jours');
      }
    }

    // Conditional required fields for alcohol
    if (this.localData.consommationAlcool) {
      required.push('agePremiereConsommationAlcool', 'consommationAlcool30Jours');
      
      if (this.localData.consommationAlcool30Jours) {
        required.push('frequenceAlcool30Jours');
      }
    }

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    this.validationChange.emit(isValid);
  }
}
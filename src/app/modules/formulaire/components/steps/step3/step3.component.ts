import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 3 : Consommation de substances psychoactives</h2>
        <p class="step-description">
          Informations sur la consommation de SPA (hors tabac et alcool)
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Consommation SPA dans l'entourage -->
          <div class="form-section">
            <h3 class="section-title">Consommation de SPA dans l'entourage</h3>
            
            <div class="form-group">
              <label class="form-label required">Y a-t-il consommation de SPA dans l'entourage ?</label>
              <select 
                class="form-select" 
                [(ngModel)]="localData.consommationSpaEntourage"
                name="consommationSpaEntourage"
                (change)="onFieldChange()"
                required
              >
                <option value="">Sélectionner</option>
                <option [value]="true">Oui</option>
                <option [value]="false">Non</option>
              </select>
            </div>

            <!-- Si oui, préciser l'entourage -->
            <div class="form-subsection" *ngIf="localData.consommationSpaEntourage">
              <h4 class="subsection-title">Dans quel entourage ? (plusieurs choix possibles)</h4>
              
              <div class="checkbox-grid">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.entourageSpa!.membresFamille"
                    name="membresFamille"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Membres de la famille</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.entourageSpa!.amis"
                    name="entourageAmis"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Amis</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.entourageSpa!.milieuProfessionnel"
                    name="milieuProfessionnel"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Milieu professionnel</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.entourageSpa!.milieuSportif"
                    name="milieuSportif"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Milieu sportif</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.entourageSpa!.milieuScolaire"
                    name="milieuScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Milieu scolaire</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.entourageSpa!.autre"
                      name="entourageAutre"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Autre</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.entourageSpa!.autre">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.entourageSpa!.autrePrecision"
                      name="entourageAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>
              </div>

              <!-- Types de SPA dans l'entourage -->
              <h4 class="subsection-title">Types de SPA consommées dans l'entourage (plusieurs choix possibles)</h4>
              
              <div class="spa-types-grid">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.tabac"
                    name="entourageTabac"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Tabac</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.alcool"
                    name="entourageAlcool"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Alcool</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.cannabis"
                    name="entourageCannabis"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Cannabis</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.opium"
                    name="entourageOpium"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Opium</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.typeSpaEntourage!.morphiniques"
                      name="entourageMorphiniques"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Morphiniques</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.typeSpaEntourage!.morphiniques">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.typeSpaEntourage!.morphiniquesPrecision"
                      name="entourageMorphiniquesPrecision"
                      placeholder="Préciser le type"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.heroine"
                    name="entourageHeroine"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Héroïne</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.cocaine"
                    name="entourageCocaine"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Cocaïne</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.typeSpaEntourage!.hypnotiques"
                      name="entourageHypnotiques"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Hypnotiques</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.typeSpaEntourage!.hypnotiques">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.typeSpaEntourage!.hypnotiquesPrecision"
                      name="entourageHypnotiquesPrecision"
                      placeholder="Préciser le type"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.amphetamines"
                    name="entourageAmphetamines"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Amphétamines</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.ecstasy"
                    name="entourageEcstasy"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Ecstasy</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.produitsInhaler"
                    name="entourageProduitsInhaler"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Produits à inhaler</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.pregabaline"
                    name="entouragePregabaline"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Prégabaline</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.ketamines"
                    name="entourageKetamines"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Kétamines</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.typeSpaEntourage!.lsd"
                    name="entourageLsd"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">LSD</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.typeSpaEntourage!.autre"
                      name="entourageSpaAutre"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Autre</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.typeSpaEntourage!.autre">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.typeSpaEntourage!.autrePrecision"
                      name="entourageSpaAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Consommation personnelle de SPA -->
          <div class="form-section">
            <h3 class="section-title">Consommation personnelle de SPA</h3>
            
            <div class="form-group">
              <label class="form-label required">Consommez-vous des substances psychoactives ?</label>
              <select 
                class="form-select" 
                [(ngModel)]="localData.consommationSpaPersonnelle"
                name="consommationSpaPersonnelle"
                (change)="onFieldChange()"
                required
              >
                <option value="">Sélectionner</option>
                <option [value]="true">Oui</option>
                <option [value]="false">Non</option>
              </select>
            </div>

            <!-- Si oui, détails de la consommation -->
            <div class="form-subsection" *ngIf="localData.consommationSpaPersonnelle">
              <!-- Drogues utilisées actuellement -->
              <h4 class="subsection-title">Drogues utilisées actuellement (plusieurs choix possibles)</h4>
              
              <div class="spa-types-grid">
                <!-- Même liste que pour l'entourage mais pour usage personnel -->
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.cannabis"
                    name="actualCannabis"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Cannabis</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.opium"
                    name="actualOpium"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Opium</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.droguesActuelles!.morphiniques"
                      name="actualMorphiniques"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Morphiniques</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.droguesActuelles!.morphiniques">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.droguesActuelles!.morphiniquesPrecision"
                      name="actualMorphiniquesPrecision"
                      placeholder="Préciser le type"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.heroine"
                    name="actualHeroine"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Héroïne</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.cocaine"
                    name="actualCocaine"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Cocaïne</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.droguesActuelles!.hypnotiques"
                      name="actualHypnotiques"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Hypnotiques</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.droguesActuelles!.hypnotiques">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.droguesActuelles!.hypnotiquesPrecision"
                      name="actualHypnotiquesPrecision"
                      placeholder="Préciser le type"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.amphetamines"
                    name="actualAmphetamines"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Amphétamines</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.ecstasy"
                    name="actualEcstasy"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Ecstasy</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.produitsInhaler"
                    name="actualProduitsInhaler"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Produits à inhaler</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.pregabaline"
                    name="actualPregabaline"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Prégabaline</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.ketamines"
                    name="actualKetamines"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Kétamines</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.droguesActuelles!.lsd"
                    name="actualLsd"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">LSD</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.droguesActuelles!.autre"
                      name="actualAutre"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Autre</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.droguesActuelles!.autre">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.droguesActuelles!.autrePrecision"
                      name="actualAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                    >
                  </div>
                </div>
              </div>

              <!-- Âge d'initiation -->
              <div class="form-group">
                <label class="form-label">Âge d'initiation à la première substance</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.ageInitiationPremiere"
                  name="ageInitiationPremiere"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
                >
              </div>
            </div>
          </div>

          <!-- Autres comportements addictifs -->
          <div class="form-section">
            <h3 class="section-title">Autres comportements addictifs</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Troubles alimentaires</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.troublesAlimentaires"
                  name="troublesAlimentaires"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Addiction aux jeux</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.addictionJeux"
                  name="addictionJeux"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Addiction aux écrans</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.addictionEcrans"
                  name="addictionEcrans"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Comportements sexuels compulsifs</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.comportementsSexuels"
                  name="comportementsSexuels"
                  (change)="onFieldChange()"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
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

    .form-subsection {
      margin-top: var(--spacing-6);
      padding: var(--spacing-6);
      background-color: var(--gray-50);
      border-radius: var(--radius-md);
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

    .spa-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--spacing-3);
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
      background-color: var(--gray-100);
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
      
      .checkbox-grid,
      .spa-types-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Step3Component implements OnInit, OnChanges {
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
      entourageSpa: this.data.entourageSpa || {},
      typeSpaEntourage: this.data.typeSpaEntourage || {},
      droguesActuelles: this.data.droguesActuelles || {},
      substanceInitiation: this.data.substanceInitiation || {},
      substancePrincipale: this.data.substancePrincipale || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    const required = [
      'consommationSpaEntourage',
      'consommationSpaPersonnelle',
      'troublesAlimentaires',
      'addictionJeux',
      'addictionEcrans',
      'comportementsSexuels'
    ];

    // If SPA consumption in entourage, at least one entourage type should be selected
    if (this.localData.consommationSpaEntourage) {
      const entourageSelected = Object.values(this.localData.entourageSpa || {}).some(value => value === true);
      const typeSpaSelected = Object.values(this.localData.typeSpaEntourage || {}).some(value => value === true);
      
      if (!entourageSelected || !typeSpaSelected) {
        this.validationChange.emit(false);
        return;
      }
    }

    // If personal SPA consumption, at least one drug should be selected
    if (this.localData.consommationSpaPersonnelle) {
      const drogueSelected = Object.values(this.localData.droguesActuelles || {}).some(value => value === true);
      
      if (!drogueSelected) {
        this.validationChange.emit(false);
        return;
      }
    }

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    this.validationChange.emit(isValid);
  }
}
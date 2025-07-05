import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 4 : Comportements liés à la consommation et tests de dépistage</h2>
        <p class="step-description">
          Informations sur les modes de consommation et les tests de dépistage
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Voie d'administration -->
          <div class="form-section" *ngIf="localData.consommationSpaPersonnelle">
            <h3 class="section-title">Voie d'administration habituelle (substance principale)</h3>
            
            <div class="checkbox-grid">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.voieAdministration!.injectee"
                  name="injectee"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Injectée</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.voieAdministration!.fumee"
                  name="fumee"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Fumée</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.voieAdministration!.ingeree"
                  name="ingeree"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Ingérée</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.voieAdministration!.sniffee"
                  name="sniffee"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Sniffée</span>
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="localData.voieAdministration!.inhalee"
                  name="inhalee"
                  (change)="onFieldChange()"
                >
                <span class="checkbox-text">Inhalée</span>
              </label>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.voieAdministration!.autre"
                    name="voieAutre"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Autre</span>
                </label>
                
                <div class="sub-options" *ngIf="localData.voieAdministration!.autre">
                  <input 
                    type="text" 
                    class="form-input"
                    [(ngModel)]="localData.voieAdministration!.autrePrecision"
                    name="voieAutrePrecision"
                    placeholder="Préciser"
                    (input)="onFieldChange()"
                  >
                </div>
              </div>
            </div>

            <!-- Fréquence de consommation -->
            <div class="form-group">
              <label class="form-label">Fréquence de consommation de la substance principale</label>
              <select 
                class="form-select" 
                [(ngModel)]="localData.frequenceSubstancePrincipale"
                name="frequenceSubstancePrincipale"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner</option>
                <option value="DEUX_FOIS_PLUS_PAR_JOUR">Deux fois ou plus par jour</option>
                <option value="UNE_FOIS_PAR_JOUR">Une fois par jour</option>
                <option value="DEUX_TROIS_JOURS_SEMAINE">2-3 jours par semaine</option>
                <option value="UNE_FOIS_SEMAINE">Une fois par semaine</option>
                <option value="OCCASIONNEL_FESTIF">Occasionnel/festif</option>
              </select>
            </div>

            <!-- Partage de seringues -->
            <div class="form-group" *ngIf="localData.voieAdministration!.injectee">
              <label class="form-label">Notion de partage de seringues</label>
              <select 
                class="form-select" 
                [(ngModel)]="localData.partageSeringues"
                name="partageSeringues"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner</option>
                <option value="JAMAIS_PARTAGE">Jamais partagé</option>
                <option value="INFERIEUR_1_MOIS">Inférieur à 1 mois</option>
                <option value="ENTRE_1_3_MOIS">Entre 1 et 3 mois</option>
                <option value="ENTRE_3_6_MOIS">Entre 3 et 6 mois</option>
                <option value="ENTRE_6_12_MOIS">Entre 6 et 12 mois</option>
                <option value="DOUZE_MOIS_PLUS">12 mois et plus</option>
              </select>
            </div>
          </div>

          <!-- Tests de dépistage -->
          <div class="form-section">
            <h3 class="section-title">Tests de dépistage</h3>
            
            <div class="test-grid">
              <!-- Test VIH -->
              <div class="test-group">
                <h4 class="test-title">Test VIH</h4>
                <div class="form-group">
                  <label class="form-label">Test réalisé</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVih!.realise"
                    name="testVihRealise"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option [value]="true">Oui</option>
                    <option [value]="false">Non</option>
                  </select>
                </div>
                
                <div class="form-group" *ngIf="localData.testVih!.realise">
                  <label class="form-label">Période du dernier test</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVih!.periode"
                    name="testVihPeriode"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="3_MOIS">Moins de 3 mois</option>
                    <option value="6_MOIS">3 à 6 mois</option>
                    <option value="12_MOIS_PLUS">Plus de 6 mois</option>
                  </select>
                </div>
              </div>

              <!-- Test VHC -->
              <div class="test-group">
                <h4 class="test-title">Test VHC (Hépatite C)</h4>
                <div class="form-group">
                  <label class="form-label">Test réalisé</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVhc!.realise"
                    name="testVhcRealise"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option [value]="true">Oui</option>
                    <option [value]="false">Non</option>
                  </select>
                </div>
                
                <div class="form-group" *ngIf="localData.testVhc!.realise">
                  <label class="form-label">Période du dernier test</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVhc!.periode"
                    name="testVhcPeriode"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="3_MOIS">Moins de 3 mois</option>
                    <option value="6_MOIS">3 à 6 mois</option>
                    <option value="12_MOIS_PLUS">Plus de 6 mois</option>
                  </select>
                </div>
              </div>

              <!-- Test VHB -->
              <div class="test-group">
                <h4 class="test-title">Test VHB (Hépatite B)</h4>
                <div class="form-group">
                  <label class="form-label">Test réalisé</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVhb!.realise"
                    name="testVhbRealise"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option [value]="true">Oui</option>
                    <option [value]="false">Non</option>
                  </select>
                </div>
                
                <div class="form-group" *ngIf="localData.testVhb!.realise">
                  <label class="form-label">Période du dernier test</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testVhb!.periode"
                    name="testVhbPeriode"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="3_MOIS">Moins de 3 mois</option>
                    <option value="6_MOIS">3 à 6 mois</option>
                    <option value="12_MOIS_PLUS">Plus de 6 mois</option>
                  </select>
                </div>
              </div>

              <!-- Test Syphilis -->
              <div class="test-group">
                <h4 class="test-title">Test Syphilis</h4>
                <div class="form-group">
                  <label class="form-label">Test réalisé</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testSyphilis!.realise"
                    name="testSyphilisRealise"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option [value]="true">Oui</option>
                    <option [value]="false">Non</option>
                  </select>
                </div>
                
                <div class="form-group" *ngIf="localData.testSyphilis!.realise">
                  <label class="form-label">Période du dernier test</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="localData.testSyphilis!.periode"
                    name="testSyphilisPeriode"
                    (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="3_MOIS">Moins de 3 mois</option>
                    <option value="6_MOIS">3 à 6 mois</option>
                    <option value="12_MOIS_PLUS">Plus de 6 mois</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Accompagnement sevrage -->
          <div class="form-section">
            <h3 class="section-title">Accompagnement et sevrage</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Accompagnement pour le sevrage</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.accompagnementSevrage"
                  name="accompagnementSevrage"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.accompagnementSevrage === false">
                <label class="form-label">Raison de l'absence d'accompagnement</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.accompagnementSevrageNonRaison"
                  name="accompagnementSevrageNonRaison"
                  placeholder="Préciser les raisons"
                  rows="3"
                  (input)="onFieldChange()"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Tentative de sevrage</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.tentativeSevrage"
                  name="tentativeSevrage"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>
            </div>

            <!-- Détails tentative de sevrage -->
            <div class="form-subsection" *ngIf="localData.tentativeSevrage">
              <h4 class="subsection-title">Modalités de la tentative de sevrage (plusieurs choix possibles)</h4>
              
              <div class="checkbox-grid">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.tentativeSevrageDetails!.toutSeul"
                    name="toutSeul"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Tout seul</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.tentativeSevrageDetails!.soutienFamille"
                    name="soutienFamille"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Avec soutien de la famille</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.tentativeSevrageDetails!.soutienAmi"
                    name="soutienAmi"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Avec soutien d'un ami</span>
                </label>

                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="localData.tentativeSevrageDetails!.soutienScolaire"
                    name="soutienScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Avec soutien scolaire</span>
                </label>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.tentativeSevrageDetails!.structureSante"
                      name="structureSante"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">Structure de santé</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.tentativeSevrageDetails!.structureSante">
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.tentativeSevrageDetails!.structureSantePrecision"
                      name="structureSantePrecision"
                      placeholder="Préciser la structure"
                      (input)="onFieldChange()"
                    >
                  </div>
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

    .test-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 var(--spacing-3) 0;
      padding-bottom: var(--spacing-2);
      border-bottom: 1px solid var(--gray-300);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-4);
    }

    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-6);
    }

    .test-group {
      padding: var(--spacing-4);
      background-color: var(--gray-50);
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
      .form-grid,
      .test-grid {
        grid-template-columns: 1fr;
      }
      
      .checkbox-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Step4Component implements OnInit, OnChanges {
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
      voieAdministration: this.data.voieAdministration || {},
      testVih: this.data.testVih || {},
      testVhc: this.data.testVhc || {},
      testVhb: this.data.testVhb || {},
      testSyphilis: this.data.testSyphilis || {},
      tentativeSevrageDetails: this.data.tentativeSevrageDetails || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    // This step has mostly optional fields, so validation is more flexible
    // We only require that if certain options are selected, their sub-fields are filled

    let isValid = true;

    // If injection is selected, partage de seringues should be answered
    if (this.localData.voieAdministration?.injectee && !this.localData.partageSeringues) {
      // This is optional, so we don't invalidate
    }

    // If tests are marked as done, period should be specified
    if (this.localData.testVih?.realise && !this.localData.testVih?.periode) {
      isValid = false;
    }
    if (this.localData.testVhc?.realise && !this.localData.testVhc?.periode) {
      isValid = false;
    }
    if (this.localData.testVhb?.realise && !this.localData.testVhb?.periode) {
      isValid = false;
    }
    if (this.localData.testSyphilis?.realise && !this.localData.testSyphilis?.periode) {
      isValid = false;
    }

    // If tentative sevrage is true, at least one modality should be selected
    if (this.localData.tentativeSevrage) {
      const modalitySelected = Object.values(this.localData.tentativeSevrageDetails || {}).some(value => value === true);
      if (!modalitySelected) {
        isValid = false;
      }
    }

    this.validationChange.emit(isValid);
  }
}
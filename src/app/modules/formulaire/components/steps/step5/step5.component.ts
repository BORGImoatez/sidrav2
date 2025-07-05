import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 5 : Comorbidités</h2>
        <p class="step-description">
          Informations sur les comorbidités et antécédents
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Comorbidités personnelles -->
          <div class="form-section">
            <h3 class="section-title">Comorbidités personnelles</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Comorbidité psychiatrique personnelle</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.comorbiditePsychiatriquePersonnelle"
                  name="comorbiditePsychiatriquePersonnelle"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.comorbiditePsychiatriquePersonnelle">
                <label class="form-label required">Précision comorbidité psychiatrique</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.comorbiditePsychiatriquePersonnellePrecision"
                  name="comorbiditePsychiatriquePersonnellePrecision"
                  placeholder="Préciser le type de comorbidité psychiatrique"
                  rows="3"
                  (input)="onFieldChange()"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Comorbidité somatique personnelle</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.comorbiditeSomatiquePersonnelle"
                  name="comorbiditeSomatiquePersonnelle"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.comorbiditeSomatiquePersonnelle">
                <label class="form-label required">Précision comorbidité somatique</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.comorbiditeSomatiquePersonnellePrecision"
                  name="comorbiditeSomatiquePersonnellePrecision"
                  placeholder="Préciser le type de comorbidité somatique"
                  rows="3"
                  (input)="onFieldChange()"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Comorbidités des partenaires -->
          <div class="form-section">
            <h3 class="section-title">Comorbidités des partenaires</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Comorbidité psychiatrique du/des partenaire(s)</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.comorbiditePsychiatriquePartenaire"
                  name="comorbiditePsychiatriquePartenaire"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.comorbiditePsychiatriquePartenaire">
                <label class="form-label required">Précision comorbidité psychiatrique partenaire</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.comorbiditePsychiatriquePartenairePrecision"
                  name="comorbiditePsychiatriquePartenairePrecision"
                  placeholder="Préciser le type de comorbidité psychiatrique du partenaire"
                  rows="3"
                  (input)="onFieldChange()"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Comorbidité somatique du/des partenaire(s)</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="localData.comorbiditeSomatiquePartenaire"
                  name="comorbiditeSomatiquePartenaire"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner</option>
                  <option [value]="true">Oui</option>
                  <option [value]="false">Non</option>
                </select>
              </div>

              <div class="form-group" *ngIf="localData.comorbiditeSomatiquePartenaire">
                <label class="form-label required">Précision comorbidité somatique partenaire</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.comorbiditeSomatiquePartenairePrecision"
                  name="comorbiditeSomatiquePartenairePrecision"
                  placeholder="Préciser le type de comorbidité somatique du partenaire"
                  rows="3"
                  (input)="onFieldChange()"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Antécédents pénitentiaires -->
          <div class="form-section">
            <h3 class="section-title">Antécédents pénitentiaires</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre de condamnations</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.nombreCondamnations"
                  name="nombreCondamnations"
                  placeholder="Nombre de condamnations"
                  min="0"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Durée de détention (jours)</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.dureeDetentionJours"
                  name="dureeDetentionJours"
                  placeholder="Nombre de jours"
                  min="0"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Durée de détention (mois)</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.dureeDetentionMois"
                  name="dureeDetentionMois"
                  placeholder="Nombre de mois"
                  min="0"
                  (input)="onFieldChange()"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Durée de détention (années)</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.dureeDetentionAnnees"
                  name="dureeDetentionAnnees"
                  placeholder="Nombre d'années"
                  min="0"
                  (input)="onFieldChange()"
                >
              </div>
            </div>

            <div class="info-box">
              <div class="info-icon">ℹ️</div>
              <div class="info-content">
                <h4 class="info-title">Information</h4>
                <p class="info-text">
                  Les informations sur les antécédents pénitentiaires sont facultatives. 
                  Renseignez uniquement les données disponibles et pertinentes pour le suivi médical.
                </p>
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

    .form-input[rows] {
      resize: vertical;
      min-height: 80px;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background-color: var(--primary-50);
      border: 1px solid var(--primary-200);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-6);
    }

    .info-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-800);
      margin: 0 0 var(--spacing-2) 0;
    }

    .info-text {
      font-size: 14px;
      color: var(--primary-700);
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .info-box {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class Step5Component implements OnInit, OnChanges {
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
    this.localData = { ...this.data };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    let isValid = true;

    // If psychiatric comorbidity is selected, precision is required
    if (this.localData.comorbiditePsychiatriquePersonnelle && 
        (!this.localData.comorbiditePsychiatriquePersonnellePrecision || 
         this.localData.comorbiditePsychiatriquePersonnellePrecision.trim() === '')) {
      isValid = false;
    }

    // If somatic comorbidity is selected, precision is required
    if (this.localData.comorbiditeSomatiquePersonnelle && 
        (!this.localData.comorbiditeSomatiquePersonnellePrecision || 
         this.localData.comorbiditeSomatiquePersonnellePrecision.trim() === '')) {
      isValid = false;
    }

    // If partner psychiatric comorbidity is selected, precision is required
    if (this.localData.comorbiditePsychiatriquePartenaire && 
        (!this.localData.comorbiditePsychiatriquePartenairePrecision || 
         this.localData.comorbiditePsychiatriquePartenairePrecision.trim() === '')) {
      isValid = false;
    }

    // If partner somatic comorbidity is selected, precision is required
    if (this.localData.comorbiditeSomatiquePartenaire && 
        (!this.localData.comorbiditeSomatiquePartenairePrecision || 
         this.localData.comorbiditeSomatiquePartenairePrecision.trim() === '')) {
      isValid = false;
    }

    this.validationChange.emit(isValid);
  }
}
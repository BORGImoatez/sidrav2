import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 6 : Décès induit par les SPA dans l'entourage</h2>
        <p class="step-description">
          Informations sur les décès liés aux substances psychoactives dans l'entourage
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <div class="form-section">
            <h3 class="section-title">Décès liés aux SPA dans l'entourage</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre de décès dus aux SPA dans l'entourage</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="localData.nombreDecesSpaDansEntourage"
                  name="nombreDecesSpaDansEntourage"
                  placeholder="Nombre de décès"
                  min="0"
                  (input)="onFieldChange()"
                >
                <div class="field-help">
                  Indiquez le nombre de personnes de votre entourage décédées à cause de la consommation de substances psychoactives
                </div>
              </div>

              <div class="form-group" *ngIf="localData.nombreDecesSpaDansEntourage && localData.nombreDecesSpaDansEntourage > 0">
                <label class="form-label required">Causes des décès liés aux SPA</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.causesDecesSpaDansEntourage"
                  name="causesDecesSpaDansEntourage"
                  placeholder="Décrivez les causes des décès (overdose, complications médicales, accidents, etc.)"
                  rows="4"
                  (input)="onFieldChange()"
                  required
                ></textarea>
                <div class="field-help">
                  Précisez les circonstances et causes des décès (par exemple : overdose, complications médicales, accidents sous influence, etc.)
                </div>
              </div>
            </div>

            <div class="info-box">
              <div class="info-icon">⚠️</div>
              <div class="info-content">
                <h4 class="info-title">Information importante</h4>
                <p class="info-text">
                  Ces informations sont importantes pour comprendre l'impact des substances psychoactives 
                  sur l'entourage et adapter la prise en charge. Toutes les données sont confidentielles 
                  et utilisées uniquement à des fins médicales et statistiques.
                </p>
              </div>
            </div>

            <div class="completion-summary">
              <h4 class="summary-title">Récapitulatif du formulaire</h4>
              <p class="summary-text">
                Vous avez terminé la saisie de toutes les sections du formulaire SIDRA. 
                Vérifiez que toutes les informations sont correctes avant de valider.
              </p>
              
              <div class="summary-sections">
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Informations structure/centre & usager SPA</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Consommation tabac & alcool</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Consommation de substances psychoactives</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Comportements liés à la consommation et tests de dépistage</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Comorbidités</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Décès induit par les SPA dans l'entourage</span>
                </div>
              </div>

              <div class="final-note">
                <p>
                  <strong>Prochaine étape :</strong> Cliquez sur "Valider le formulaire" pour enregistrer 
                  définitivement les données et générer l'IUN (Identifiant Unique National).
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
      grid-template-columns: 1fr;
      gap: var(--spacing-6);
    }

    .form-input[rows] {
      resize: vertical;
      min-height: 100px;
    }

    .field-help {
      font-size: 12px;
      color: var(--gray-500);
      margin-top: var(--spacing-2);
      line-height: 1.4;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background-color: var(--warning-50);
      border: 1px solid var(--warning-200);
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
      color: var(--warning-800);
      margin: 0 0 var(--spacing-2) 0;
    }

    .info-text {
      font-size: 14px;
      color: var(--warning-700);
      margin: 0;
      line-height: 1.5;
    }

    .completion-summary {
      margin-top: var(--spacing-8);
      padding: var(--spacing-6);
      background: linear-gradient(135deg, var(--success-50), var(--primary-50));
      border: 1px solid var(--success-200);
      border-radius: var(--radius-lg);
    }

    .summary-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-3) 0;
    }

    .summary-text {
      color: var(--gray-700);
      margin: 0 0 var(--spacing-6) 0;
      line-height: 1.5;
    }

    .summary-sections {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-6);
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--success-200);
    }

    .summary-icon {
      font-size: 16px;
      color: var(--success-600);
    }

    .summary-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-800);
    }

    .final-note {
      padding: var(--spacing-4);
      background-color: var(--primary-100);
      border-radius: var(--radius-md);
      border: 1px solid var(--primary-300);
    }

    .final-note p {
      margin: 0;
      font-size: 14px;
      color: var(--primary-800);
      line-height: 1.5;
    }

    .final-note strong {
      color: var(--primary-900);
    }

    @media (max-width: 768px) {
      .info-box {
        flex-direction: column;
        text-align: center;
      }
      
      .completion-summary {
        padding: var(--spacing-4);
      }
    }
  `]
})
export class Step6Component implements OnInit, OnChanges {
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

    // If there are deaths reported, causes must be specified
    if (this.localData.nombreDecesSpaDansEntourage && 
        this.localData.nombreDecesSpaDansEntourage > 0 && 
        (!this.localData.causesDecesSpaDansEntourage || 
         this.localData.causesDecesSpaDansEntourage.trim() === '')) {
      isValid = false;
    }

    // This step is generally valid as most fields are optional
    // The main validation is the conditional requirement above
    this.validationChange.emit(isValid);
  }
}
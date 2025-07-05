import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulaireData, FormulaireStep } from '../../models/formulaire.model';
import { Step1Component } from '../steps/step1/step1.component';
import { Step2Component } from '../steps/step2/step2.component';
import { Step3Component } from '../steps/step3/step3.component';
import { Step4Component } from '../steps/step4/step4.component';
import { Step5Component } from '../steps/step5/step5.component';
import { Step6Component } from '../steps/step6/step6.component';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component
  ],
  template: `
    <div class="formulaire-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Nouveau formulaire SIDRA</h1>
          <p class="page-description">
            Saisie des données d'un usager SPA - Étape {{ currentStep }} sur {{ totalSteps }}
          </p>
        </div>
        <button 
          class="btn btn-secondary"
          (click)="goBack()"
          type="button"
        >
          ← Retour
        </button>
      </div>

      <!-- Progress bar -->
      <div class="progress-section card">
        <div class="card-body">
          <div class="progress-header">
            <h3 class="text-lg font-semibold text-gray-900">Progression</h3>
            <span class="progress-text">{{ currentStep }}/{{ totalSteps }} étapes</span>
          </div>
          
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="(currentStep / totalSteps) * 100"
            ></div>
          </div>
          
          <div class="steps-list">
            <div 
              *ngFor="let step of steps; let i = index"
              class="step-item"
              [class.active]="step.id === currentStep"
              [class.completed]="step.isCompleted"
            >
              <div class="step-number">
                <span *ngIf="!step.isCompleted">{{ step.id }}</span>
                <span *ngIf="step.isCompleted">✓</span>
              </div>
              <div class="step-title">{{ step.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form content -->
      <div class="form-content">
        <!-- Step 1: Informations structure/centre & usager SPA -->
        <app-step1 
          *ngIf="currentStep === 1"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(1, $event)"
        ></app-step1>

        <!-- Step 2: Consommation tabac & alcool -->
        <app-step2 
          *ngIf="currentStep === 2"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(2, $event)"
        ></app-step2>

        <!-- Step 3: Consommation de substances psychoactives -->
        <app-step3 
          *ngIf="currentStep === 3"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(3, $event)"
        ></app-step3>

        <!-- Step 4: Comportements liés à la consommation et tests de dépistage -->
        <app-step4 
          *ngIf="currentStep === 4"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(4, $event)"
        ></app-step4>

        <!-- Step 5: Comorbidités -->
        <app-step5 
          *ngIf="currentStep === 5"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(5, $event)"
        ></app-step5>

        <!-- Step 6: Décès induit par les SPA dans l'entourage -->
        <app-step6 
          *ngIf="currentStep === 6"
          [data]="formulaireData"
          (dataChange)="onStepDataChange($event)"
          (validationChange)="onStepValidationChange(6, $event)"
        ></app-step6>
      </div>

      <!-- Navigation buttons -->
      <div class="navigation-section card">
        <div class="card-body">
          <div class="navigation-buttons">
            <button 
              class="btn btn-secondary"
              (click)="previousStep()"
              [disabled]="currentStep === 1 || isSaving"
              type="button"
            >
              ← Précédent
            </button>

            <div class="step-info">
              <span class="current-step-title">{{ getCurrentStepTitle() }}</span>
            </div>

            <button 
              *ngIf="currentStep < totalSteps"
              class="btn btn-primary"
              (click)="nextStep()"
              [disabled]="!isCurrentStepValid() || isSaving"
              type="button"
            >
              Suivant →
            </button>

            <button 
              *ngIf="currentStep === totalSteps"
              class="btn btn-primary"
              (click)="submitForm()"
              [disabled]="!isFormValid() || isSaving"
              type="button"
            >
              <span *ngIf="!isSaving">Valider le formulaire</span>
              <span *ngIf="isSaving" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Validation en cours...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Success modal -->
      <div class="modal-overlay" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">✅ Formulaire validé</h3>
          </div>
          <div class="modal-body">
            <p class="text-center mb-4">
              Le formulaire a été enregistré avec succès.
            </p>
            <div class="success-info">
              <div class="info-item">
                <span class="info-label">IUN généré :</span>
                <span class="info-value">{{ generatedIUN }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date de saisie :</span>
                <span class="info-value">{{ new Date() | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="createNewForm()"
            >
              Nouveau formulaire
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="goToDashboard()"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .formulaire-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-6);
      gap: var(--spacing-4);
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-2) 0;
    }

    .page-description {
      color: var(--gray-600);
      font-size: 16px;
      margin: 0;
    }

    .progress-section {
      margin-bottom: var(--spacing-6);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }

    .progress-text {
      font-size: 14px;
      color: var(--gray-600);
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: var(--gray-200);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: var(--spacing-6);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      transition: width 0.3s ease-in-out;
    }

    .steps-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-3);
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: all 0.2s ease-in-out;
    }

    .step-item.active {
      background-color: var(--primary-50);
      border: 1px solid var(--primary-200);
    }

    .step-item.completed {
      background-color: var(--success-50);
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      background-color: var(--gray-200);
      color: var(--gray-600);
      flex-shrink: 0;
    }

    .step-item.active .step-number {
      background-color: var(--primary-500);
      color: white;
    }

    .step-item.completed .step-number {
      background-color: var(--success-500);
      color: white;
    }

    .step-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--gray-700);
      line-height: 1.3;
    }

    .step-item.active .step-title {
      color: var(--primary-700);
    }

    .step-item.completed .step-title {
      color: var(--success-700);
    }

    .form-content {
      margin-bottom: var(--spacing-6);
    }

    .navigation-section {
      position: sticky;
      bottom: var(--spacing-4);
      z-index: 10;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-4);
    }

    .step-info {
      flex: 1;
      text-align: center;
    }

    .current-step-title {
      font-weight: 600;
      color: var(--gray-900);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-4);
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content.modal-sm {
      max-width: 400px;
    }

    .modal-header {
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      text-align: center;
    }

    .modal-body {
      padding: var(--spacing-6);
    }

    .success-info {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-4);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-2) 0;
    }

    .info-item:not(:last-child) {
      border-bottom: 1px solid var(--gray-200);
    }

    .info-label {
      font-weight: 500;
      color: var(--gray-700);
    }

    .info-value {
      font-weight: 600;
      color: var(--gray-900);
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      border-top: 1px solid var(--gray-200);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .steps-list {
        grid-template-columns: 1fr;
      }
      
      .navigation-buttons {
        flex-direction: column;
        gap: var(--spacing-3);
      }
      
      .step-info {
        order: -1;
      }
      
      .modal-content {
        margin: var(--spacing-2);
        max-width: none;
      }
      
      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FormulaireComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;
  isSaving = false;
  showSuccessModal = false;
  generatedIUN = '';

  formulaireData: Partial<FormulaireData> = {};

  steps: FormulaireStep[] = [
    {
      id: 1,
      title: 'Informations structure/centre & usager SPA',
      isValid: false,
      isCompleted: false
    },
    {
      id: 2,
      title: 'Consommation tabac & alcool',
      isValid: false,
      isCompleted: false
    },
    {
      id: 3,
      title: 'Consommation de substances psychoactives',
      isValid: false,
      isCompleted: false
    },
    {
      id: 4,
      title: 'Comportements liés à la consommation et tests de dépistage',
      isValid: false,
      isCompleted: false
    },
    {
      id: 5,
      title: 'Comorbidités',
      isValid: false,
      isCompleted: false
    },
    {
      id: 6,
      title: 'Décès induit par les SPA dans l\'entourage',
      isValid: false,
      isCompleted: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeFormData();
  }

  private initializeFormData(): void {
    // Initialize with default values
    this.formulaireData = {
      cadreConsultation: {},
      origineDemande: {},
      typeAlcool: {},
      entourageSpa: {},
      typeSpaEntourage: {},
      droguesActuelles: {},
      substanceInitiation: {},
      substancePrincipale: {},
      voieAdministration: {},
      testVih: {},
      testVhc: {},
      testVhb: {},
      testSyphilis: {},
      tentativeSevrageDetails: {}
    };
  }

  onStepDataChange(data: Partial<FormulaireData>): void {
    this.formulaireData = { ...this.formulaireData, ...data };
  }

  onStepValidationChange(stepId: number, isValid: boolean): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.isValid = isValid;
    }
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < this.totalSteps) {
      // Mark current step as completed
      const currentStepObj = this.steps.find(s => s.id === this.currentStep);
      if (currentStepObj) {
        currentStepObj.isCompleted = true;
      }
      
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.isValid : false;
  }

  isFormValid(): boolean {
    return this.steps.every(step => step.isValid);
  }

  getCurrentStepTitle(): string {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.title : '';
  }

  async submitForm(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }

    this.isSaving = true;

    try {
      // Generate IUN
      this.generatedIUN = this.generateIUN();
      this.formulaireData.iun = this.generatedIUN;

      // Simulate API call
      await this.saveFormData();

      // Mark final step as completed
      const finalStep = this.steps.find(s => s.id === this.totalSteps);
      if (finalStep) {
        finalStep.isCompleted = true;
      }

      this.showSuccessModal = true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Handle error (show error message)
    } finally {
      this.isSaving = false;
    }
  }

  private async saveFormData(): Promise<void> {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Données du formulaire sauvegardées:', this.formulaireData);
        resolve();
      }, 2000);
    });
  }

  private generateIUN(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TN${year}${randomNum}`;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  createNewForm(): void {
    this.showSuccessModal = false;
    // Reset form
    this.currentStep = 1;
    this.initializeFormData();
    this.steps.forEach(step => {
      step.isValid = false;
      step.isCompleted = false;
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
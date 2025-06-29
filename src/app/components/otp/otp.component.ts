import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpRequest } from '../../models/user.model';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="otp-container">
      <div class="otp-card card">
        <div class="otp-header">
          <h1 class="text-xl font-semibold text-center text-gray-900 mb-2">
            Vérification OTP
          </h1>
          <p class="text-center text-gray-600 mb-6">
            Un code à 6 chiffres a été envoyé par SMS.<br>
            <span class="text-sm text-gray-500">Saisissez-le ci-dessous pour continuer.</span>
          </p>
        </div>

        <div class="otp-form">
          <div class="otp-inputs">
            <input
              *ngFor="let digit of otpDigits; let i = index"
              type="text"
              maxlength="1"
              class="otp-input"
              [class.error]="showError && !digit"
              [value]="otpDigits[i]"
              (input)="onDigitInput($event, i)"
              (keydown)="onKeyDown($event, i)"
              (paste)="onPaste($event)"
              [disabled]="isLoading"
              #otpInput
            >
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            <span>{{ errorMessage }}</span>
            <div *ngIf="remainingAttempts !== null" class="text-sm mt-1">
              Tentatives restantes: {{ remainingAttempts }}
            </div>
            <div *ngIf="blockedUntil" class="text-sm mt-1">
              Nouveau code disponible dans {{ getBlockedTimeRemaining() }}
            </div>
          </div>

          <div *ngIf="successMessage" class="success-banner">
            {{ successMessage }}
          </div>

          <button
            type="button"
            (click)="verifyOtp()"
            class="btn btn-primary btn-lg w-full"
            [disabled]="isLoading || !isOtpComplete() || isBlocked"
          >
            <span *ngIf="!isLoading">Vérifier</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="loading-spinner-sm"></div>
              Vérification...
            </span>
          </button>

          <div class="otp-actions">
            <button
              type="button"
              (click)="resendCode()"
              class="btn btn-secondary"
              [disabled]="isLoading || canResendIn > 0"
            >
              <span *ngIf="canResendIn === 0">Renvoyer le code</span>
              <span *ngIf="canResendIn > 0">Renvoyer dans {{ canResendIn }}s</span>
            </button>

            <button
              type="button"
              (click)="goBack()"
              class="btn btn-secondary"
              [disabled]="isLoading"
            >
              Retour
            </button>
          </div>

          <div class="timer-info" *ngIf="timeRemaining > 0">
            <div class="timer-bar">
              <div class="timer-progress" [style.width.%]="(timeRemaining / 300) * 100"></div>
            </div>
            <p class="text-xs text-gray-500 text-center mt-2">
              Code expire dans {{ formatTime(timeRemaining) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .otp-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      padding: var(--spacing-4);
    }

    .otp-card {
      width: 100%;
      max-width: 420px;
      padding: var(--spacing-8);
      background: white;
      box-shadow: var(--shadow-xl);
      border: none;
    }

    .otp-header {
      margin-bottom: var(--spacing-6);
    }

    .otp-inputs {
      display: flex;
      gap: var(--spacing-3);
      justify-content: center;
      margin-bottom: var(--spacing-6);
    }

    .otp-input {
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      border: 2px solid var(--gray-300);
      border-radius: var(--radius-md);
      background: white;
      transition: all 0.2s ease-in-out;
    }

    .otp-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
      transform: scale(1.05);
    }

    .otp-input.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .otp-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-banner {
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
      color: var(--error-700);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
      font-size: 14px;
    }

    .success-banner {
      background-color: var(--success-50);
      border: 1px solid var(--success-200);
      color: var(--success-700);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
      font-size: 14px;
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .otp-actions {
      display: flex;
      gap: var(--spacing-3);
      margin-top: var(--spacing-4);
    }

    .otp-actions .btn {
      flex: 1;
    }

    .timer-info {
      margin-top: var(--spacing-6);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--gray-200);
    }

    .timer-bar {
      width: 100%;
      height: 4px;
      background-color: var(--gray-200);
      border-radius: 2px;
      overflow: hidden;
    }

    .timer-progress {
      height: 100%;
      background: linear-gradient(90deg, var(--success-500), var(--warning-500), var(--error-500));
      transition: width 1s linear;
    }

    @media (max-width: 480px) {
      .otp-card {
        padding: var(--spacing-6);
      }
      
      .otp-input {
        width: 45px;
        height: 45px;
        font-size: 16px;
      }
      
      .otp-inputs {
        gap: var(--spacing-2);
      }
    }
  `]
})
export class OtpComponent implements OnInit, OnDestroy {
  otpDigits: string[] = ['', '', '', '', '', ''];
  userId: number = 0;
  isLoading = false;
  showError = false;
  errorMessage = '';
  successMessage = '';
  remainingAttempts: number | null = null;
  blockedUntil: Date | null = null;
  isBlocked = false;
  
  timeRemaining = 300; // 5 minutes
  canResendIn = 0;
  
  private timers: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis les paramètres de requête
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      if (!this.userId) {
        this.router.navigate(['/login']);
        return;
      }
    });

    // Démarrer le timer d'expiration
    this.startExpirationTimer();
    
    // Timer pour les tentatives de renvoi
    this.canResendIn = 30;
    this.startResendTimer();

    // Vérifier les bloquages périodiquement
    const blockTimer = setInterval(() => {
      if (this.blockedUntil && this.blockedUntil <= new Date()) {
        this.blockedUntil = null;
        this.isBlocked = false;
        this.errorMessage = '';
      }
    }, 1000);
    
    this.timers.push(blockTimer);

    // Focus sur le premier input
    setTimeout(() => {
      const firstInput = document.querySelector('.otp-input') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearInterval(timer));
  }

  onDigitInput(event: any, index: number): void {
    const value = event.target.value;
    
    // Nettoyer la valeur - ne garder que le dernier chiffre saisi
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    
    // Mettre à jour le champ actuel
    this.otpDigits[index] = cleanValue;
    
    // Mettre à jour la valeur de l'input pour refléter le changement
    event.target.value = cleanValue;
    
    // Si un chiffre valide a été saisi, passer au champ suivant
    if (cleanValue && index < 5) {
      const nextInput = event.target.parentElement.children[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    this.clearMessages();
  }

  onKeyDown(event: any, index: number): void {
    // Gérer la touche Backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      
      // Si le champ actuel est vide, aller au champ précédent
      if (!this.otpDigits[index] && index > 0) {
        const prevInput = event.target.parentElement.children[index - 1] as HTMLInputElement;
        if (prevInput) {
          this.otpDigits[index - 1] = '';
          prevInput.value = '';
          prevInput.focus();
        }
      } else {
        // Sinon, vider le champ actuel
        this.otpDigits[index] = '';
        event.target.value = '';
      }
    }
    
    // Empêcher la saisie de caractères non numériques
    if (!/[0-9]/.test(event.key) && 
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: any): void {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedText.length === 6) {
      for (let i = 0; i < 6; i++) {
        this.otpDigits[i] = pastedText[i] || '';
        const input = event.target.parentElement.children[i] as HTMLInputElement;
        if (input) {
          input.value = this.otpDigits[i];
        }
      }
      
      // Focus sur le dernier champ rempli
      const lastInput = event.target.parentElement.children[5] as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    }
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit.length === 1 && /^\d$/.test(digit));
  }

  verifyOtp(): void {
    if (!this.isOtpComplete()) {
      this.showError = true;
      this.errorMessage = 'Veuillez saisir le code complet';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const otpCode = this.otpDigits.join('');
    const otpRequest: OtpRequest = {
      userId: this.userId,
      code: otpCode
    };

    this.authService.verifyOtp(otpRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Connexion réussie !';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = response.message;
          this.remainingAttempts = response.remainingAttempts || null;
          
          if (response.blockedUntil) {
            this.blockedUntil = response.blockedUntil;
            this.isBlocked = true;
          }
          
          // Réinitialiser les champs en cas d'erreur
          this.resetOtpFields();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        console.error('Erreur de vérification OTP:', error);
        this.resetOtpFields();
      }
    });
  }

  private resetOtpFields(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    
    // Réinitialiser les valeurs des inputs
    setTimeout(() => {
      const inputs = document.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
      inputs.forEach(input => {
        input.value = '';
      });
      
      // Focus sur le premier input
      const firstInput = inputs[0];
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  resendCode(): void {
    if (this.canResendIn > 0) return;

    this.isLoading = true;
    this.clearMessages();

    this.authService.resendOtp(this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = response.message;
          this.canResendIn = 30;
          this.startResendTimer();
          
          // Réinitialiser le timer d'expiration
          this.timeRemaining = 300;
          this.startExpirationTimer();
          
          // Réinitialiser les champs
          this.resetOtpFields();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du renvoi du code.';
        console.error('Erreur de renvoi OTP:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  private startExpirationTimer(): void {
    // Nettoyer le timer précédent s'il existe
    this.timers.forEach(timer => {
      if (timer.type === 'expiration') {
        clearInterval(timer.id);
      }
    });
    
    const timer = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        clearInterval(timer);
        this.errorMessage = 'Le code OTP a expiré. Veuillez en demander un nouveau.';
      }
    }, 1000);
    
    this.timers.push({ id: timer, type: 'expiration' });
  }

  private startResendTimer(): void {
    // Nettoyer le timer précédent s'il existe
    this.timers.forEach(timer => {
      if (timer.type === 'resend') {
        clearInterval(timer.id);
      }
    });
    
    const timer = setInterval(() => {
      this.canResendIn--;
      
      if (this.canResendIn <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    this.timers.push({ id: timer, type: 'resend' });
  }

  private clearMessages(): void {
    this.showError = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getBlockedTimeRemaining(): string {
    if (!this.blockedUntil) return '';
    
    const remaining = Math.ceil((this.blockedUntil.getTime() - Date.now()) / 1000);
    if (remaining <= 0) return '';
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
}
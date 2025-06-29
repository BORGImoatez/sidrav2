import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { FormulaireData, FormulaireStep, ValidationError } from '../../models/formulaire.model';
import { User, UserRole, Structure, Gouvernorat } from '../../../../models/user.model';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="formulaire-container">
      <!-- En-tête avec progression -->
      <div class="formulaire-header">
        <div class="header-content">
          <h1 class="page-title">Nouveau formulaire SIDRA</h1>
          <p class="page-description">
            Saisie des données d'un usager de substances psychoactives (SPA)
          </p>
        </div>
        
        <!-- Barre de progression -->
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
        </div>
        
        <!-- Étapes -->
        <div class="steps-nav">
          <div 
            *ngFor="let step of steps" 
            class="step-item"
            [class.active]="step.id === currentStep"
            [class.completed]="step.isCompleted"
            [class.valid]="step.isValid"
            (click)="goToStep(step.id)"
          >
            <div class="step-number">
              <span *ngIf="!step.isCompleted">{{ step.id }}</span>
              <span *ngIf="step.isCompleted">✓</span>
            </div>
            <div class="step-title">{{ step.title }}</div>
          </div>
        </div>
      </div>

      <!-- Contenu du formulaire -->
      <div class="formulaire-content">
        <form #formulaireForm="ngForm" class="formulaire-form">
          
          <!-- Étape 1: Informations structure/centre & usager SPA -->
          <div *ngIf="currentStep === 1" class="step-content">
            <h2 class="step-heading">Informations structure/centre & usager SPA</h2>
            
            <div class="form-section">
              <h3 class="section-title">Structure et Centre</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Secteur</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="secteur" 
                        value="PUBLIC"
                        [(ngModel)]="formData.secteur"
                        [class.error]="hasError('secteur')"
                        required
                      >
                      <span>Public</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="secteur" 
                        value="PRIVE"
                        [(ngModel)]="formData.secteur"
                        [class.error]="hasError('secteur')"
                        required
                      >
                      <span>Privé</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="secteur" 
                        value="ONG"
                        [(ngModel)]="formData.secteur"
                        [class.error]="hasError('secteur')"
                        required
                      >
                      <span>Société civile (ONG)</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('secteur')" class="form-error">
                    {{ getError('secteur') }}
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.secteur === 'ONG'">
                <div class="form-group">
                  <label class="form-label required">Si ONG, préciser</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.ongPrecision"
                    name="ongPrecision"
                    [class.error]="hasError('ongPrecision')"
                    [required]="formData.secteur === 'ONG'"
                  >
                    <option value="">Sélectionner une ONG</option>
                    <option value="ATIOST">ATIOST</option>
                    <option value="ATL_TUNIS">ATL Tunis</option>
                    <option value="ATL_SFAX">ATL Sfax</option>
                    <option value="ATUPRET">ATUPRET</option>
                    <option value="ATP_PLUS">ATP+</option>
                    <option value="ATSR">ATSR</option>
                    <option value="STADD">STADD</option>
                  </select>
                  <div *ngIf="hasError('ongPrecision')" class="form-error">
                    {{ getError('ongPrecision') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Ministère</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.ministere"
                    name="ministere"
                    [class.error]="hasError('ministere')"
                    required
                  >
                    <option value="">Sélectionner un ministère</option>
                    <option value="SANTE">Ministère de la Santé</option>
                    <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                    <option value="JUSTICE">Ministère de la Justice</option>
                    <option value="INTERIEUR">Ministère de l'Intérieur</option>
                    <option value="EDUCATION">Ministère de l'Éducation</option>
                    <option value="ENSEIGNEMENT_SUPERIEUR">Ministère de l'Enseignement Supérieur</option>
                  </select>
                  <div *ngIf="hasError('ministere')" class="form-error">
                    {{ getError('ministere') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Structure / Centre</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.structure"
                    name="structure"
                    [class.error]="hasError('structure')"
                    required
                  >
                    <option value="">Sélectionner une structure</option>
                    <option value="CONSULTATION_ADDICTOLOGIE">Consultation d'Addictologie</option>
                    <option value="CONSULTATION_PSYCHIATRIE">Consultation de psychiatrie</option>
                    <option value="HOPITAL_JOUR">Hôpital de jour</option>
                    <option value="SERVICE_REANIMATION">Service de réanimation</option>
                    <option value="SERVICE_PSYCHIATRIE">Service de psychiatrie</option>
                    <option value="COMMUNAUTE_THERAPEUTIQUE">Communauté thérapeutique</option>
                    <option value="CMSU">CMSU</option>
                    <option value="ESPACE_AMI_JEUNES">Espace ami des Jeunes</option>
                    <option value="SERVICE_NEUROLOGIE">Service de neurologie</option>
                    <option value="SERVICE_INFECTIEUX">Service infectieux</option>
                    <option value="SERVICE_URGENCE">Service d'urgence</option>
                    <option value="CSSB">CSSB</option>
                  </select>
                  <div *ngIf="hasError('structure')" class="form-error">
                    {{ getError('structure') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Gouvernorat de la Structure/Centre</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.gouvernoratStructure"
                    name="gouvernoratStructure"
                    [class.error]="hasError('gouvernoratStructure')"
                    required
                  >
                    <option value="">Sélectionner un gouvernorat</option>
                    <option *ngFor="let gov of gouvernorats" [value]="gov.nom">{{ gov.nom }}</option>
                  </select>
                  <div *ngIf="hasError('gouvernoratStructure')" class="form-error">
                    {{ getError('gouvernoratStructure') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Informations Patient</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Nom</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nom"
                    name="nom"
                    [class.error]="hasError('nom')"
                    required
                  >
                  <div *ngIf="hasError('nom')" class="form-error">
                    {{ getError('nom') }}
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Prénom</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.prenom"
                    name="prenom"
                    [class.error]="hasError('prenom')"
                    required
                  >
                  <div *ngIf="hasError('prenom')" class="form-error">
                    {{ getError('prenom') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Code du patient</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.codePatient"
                    name="codePatient"
                    [class.error]="hasError('codePatient')"
                    required
                  >
                  <div *ngIf="hasError('codePatient')" class="form-error">
                    {{ getError('codePatient') }}
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Date de la consultation/entretien</label>
                  <input 
                    type="date"
                    class="form-input"
                    [(ngModel)]="formData.dateConsultation"
                    name="dateConsultation"
                    [class.error]="hasError('dateConsultation')"
                    required
                  >
                  <div *ngIf="hasError('dateConsultation')" class="form-error">
                    {{ getError('dateConsultation') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Genre</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="genre" 
                        value="HOMME"
                        [(ngModel)]="formData.genre"
                        [class.error]="hasError('genre')"
                        required
                      >
                      <span>Homme</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="genre" 
                        value="FEMME"
                        [(ngModel)]="formData.genre"
                        [class.error]="hasError('genre')"
                        required
                      >
                      <span>Femme</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('genre')" class="form-error">
                    {{ getError('genre') }}
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Date de naissance</label>
                  <input 
                    type="date"
                    class="form-input"
                    [(ngModel)]="formData.dateNaissance"
                    name="dateNaissance"
                    [class.error]="hasError('dateNaissance')"
                    required
                  >
                  <div *ngIf="hasError('dateNaissance')" class="form-error">
                    {{ getError('dateNaissance') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Nationalité</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.nationalite"
                    name="nationalite"
                    [class.error]="hasError('nationalite')"
                    required
                  >
                    <option value="">Sélectionner une nationalité</option>
                    <option value="TUNISIENNE">Tunisienne</option>
                    <option value="ALGERIENNE">Algérienne</option>
                    <option value="MAROCAINE">Marocaine</option>
                    <option value="LIBYENNE">Libyenne</option>
                    <option value="FRANCAISE">Française</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                  <div *ngIf="hasError('nationalite')" class="form-error">
                    {{ getError('nationalite') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Résidence</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="residence" 
                        value="TUNISIE"
                        [(ngModel)]="formData.residence"
                        [class.error]="hasError('residence')"
                        required
                      >
                      <span>En Tunisie</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="residence" 
                        value="ETRANGER"
                        [(ngModel)]="formData.residence"
                        [class.error]="hasError('residence')"
                        required
                      >
                      <span>À l'étranger</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('residence')" class="form-error">
                    {{ getError('residence') }}
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.residence === 'TUNISIE'">
                <div class="form-group">
                  <label class="form-label required">Gouvernorat</label>
                  <select 
                    class="form-select"
                    [(ngModel)]="formData.gouvernoratResidence"
                    name="gouvernoratResidence"
                    [class.error]="hasError('gouvernoratResidence')"
                    [required]="formData.residence === 'TUNISIE'"
                  >
                    <option value="">Sélectionner un gouvernorat</option>
                    <option *ngFor="let gov of gouvernorats" [value]="gov.nom">{{ gov.nom }}</option>
                  </select>
                  <div *ngIf="hasError('gouvernoratResidence')" class="form-error">
                    {{ getError('gouvernoratResidence') }}
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Délégation</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.delegationResidence"
                    name="delegationResidence"
                    [class.error]="hasError('delegationResidence')"
                    [required]="formData.residence === 'TUNISIE'"
                  >
                  <div *ngIf="hasError('delegationResidence')" class="form-error">
                    {{ getError('delegationResidence') }}
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.residence === 'ETRANGER'">
                <div class="form-group">
                  <label class="form-label required">Pays</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.paysResidence"
                    name="paysResidence"
                    [class.error]="hasError('paysResidence')"
                    [required]="formData.residence === 'ETRANGER'"
                  >
                  <div *ngIf="hasError('paysResidence')" class="form-error">
                    {{ getError('paysResidence') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Cadre de consultation -->
            <div class="form-section">
              <h3 class="section-title">Cadre de la consultation/entretien</h3>
              
              <div class="checkbox-grid">
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.addictologie"
                    name="cadreAddictologie"
                  >
                  <span>Consultation d'addictologie demande de sevrage ou autre</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.psychiatrie"
                    name="cadrePsychiatrie"
                  >
                  <span>Psychiatrie (troubles mentaux)</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.psychologique"
                    name="cadrePsychologique"
                  >
                  <span>Consultation psychologique</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.medecineGenerale"
                    name="cadreMedecineGenerale"
                  >
                  <span>Médecine générale, médecine interne</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.neurologique"
                    name="cadreNeurologique"
                  >
                  <span>Troubles neurologiques</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.infectieux"
                    name="cadreInfectieux"
                  >
                  <span>Problèmes infectieux</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.espaceAmisJeunes"
                    name="cadreEspaceAmisJeunes"
                  >
                  <span>Centre amis des jeunes</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.echangeMateriel"
                    name="cadreEchangeMateriel"
                  >
                  <span>Échange/approvisionnement de matériels à usage unique</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.rehabilitation"
                    name="cadreRehabilitation"
                  >
                  <span>Réhabilitation</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.urgenceMedicale"
                    name="cadreUrgenceMedicale"
                  >
                  <span>Urgence médicale</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.urgenceChirurgicale"
                    name="cadreUrgenceChirurgicale"
                  >
                  <span>Urgence chirurgicale</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.autre"
                    name="cadreAutre"
                  >
                  <span>Autre</span>
                </label>
              </div>

              <div class="form-row" *ngIf="formData.cadreConsultation.autre">
                <div class="form-group">
                  <label class="form-label required">Si autre, préciser</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.cadreConsultation.autrePrecision"
                    name="cadreAutrePrecision"
                    [class.error]="hasError('cadreAutrePrecision')"
                    [required]="formData.cadreConsultation.autre"
                  >
                  <div *ngIf="hasError('cadreAutrePrecision')" class="form-error">
                    {{ getError('cadreAutrePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Origine de la demande -->
            <div class="form-section">
              <h3 class="section-title">Origine de la demande</h3>
              
              <div class="checkbox-grid">
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.luiMeme"
                    name="origineLuiMeme"
                  >
                  <span>Lui-même</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.famille"
                    name="origineFamille"
                  >
                  <span>Famille</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.amis"
                    name="origineAmis"
                  >
                  <span>Amis</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.celluleEcoute"
                    name="origineCelluleEcoute"
                  >
                  <span>Cellule d'écoute de médecine scolaire et universitaire</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.autreCentre"
                    name="origineAutreCentre"
                  >
                  <span>Adressé par un autre centre</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.structureSociale"
                    name="origineStructureSociale"
                  >
                  <span>Structure sociale</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.structureJudiciaire"
                    name="origineStructureJudiciaire"
                  >
                  <span>Structure judiciaire</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.autre"
                    name="origineAutre"
                  >
                  <span>Autre</span>
                </label>
              </div>

              <div class="form-row" *ngIf="formData.origineDemande.autre">
                <div class="form-group">
                  <label class="form-label required">Si autre, préciser</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.origineDemande.autrePrecision"
                    name="origineAutrePrecision"
                    [class.error]="hasError('origineAutrePrecision')"
                    [required]="formData.origineDemande.autre"
                  >
                  <div *ngIf="hasError('origineAutrePrecision')" class="form-error">
                    {{ getError('origineAutrePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Consultation antérieure -->
            <div class="form-section">
              <h3 class="section-title">Consultation antérieure</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Consultation antérieure</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consultationAnterieure" 
                        [value]="true"
                        [(ngModel)]="formData.consultationAnterieure"
                        [class.error]="hasError('consultationAnterieure')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consultationAnterieure" 
                        [value]="false"
                        [(ngModel)]="formData.consultationAnterieure"
                        [class.error]="hasError('consultationAnterieure')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('consultationAnterieure')" class="form-error">
                    {{ getError('consultationAnterieure') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consultationAnterieure === true">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Date de la consultation antérieure (mois/année)</label>
                    <input 
                      type="month"
                      class="form-input"
                      [(ngModel)]="formData.dateConsultationAnterieure"
                      name="dateConsultationAnterieure"
                      [class.error]="hasError('dateConsultationAnterieure')"
                      [required]="formData.consultationAnterieure === true"
                    >
                    <div *ngIf="hasError('dateConsultationAnterieure')" class="form-error">
                      {{ getError('dateConsultationAnterieure') }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Motif de la consultation antérieure</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.motifConsultationAnterieure"
                      name="motifConsultationAnterieure"
                      [class.error]="hasError('motifConsultationAnterieure')"
                      [required]="formData.consultationAnterieure === true"
                    >
                      <option value="">Sélectionner un motif</option>
                      <option value="OVERDOSE">Overdose</option>
                      <option value="TENTATIVE_SUICIDE">Tentative de suicide</option>
                      <option value="SEVRAGE">Sevrage</option>
                      <option value="TROUBLES_MENTAUX">Troubles mentaux</option>
                      <option value="RECIDIVES">Récidives</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                    <div *ngIf="hasError('motifConsultationAnterieure')" class="form-error">
                      {{ getError('motifConsultationAnterieure') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.motifConsultationAnterieure === 'RECIDIVES'">
                  <div class="form-group">
                    <label class="form-label required">Cause de récidive</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.causeRecidive"
                      name="causeRecidive"
                      [class.error]="hasError('causeRecidive')"
                      [required]="formData.motifConsultationAnterieure === 'RECIDIVES'"
                    >
                      <option value="">Sélectionner une cause</option>
                      <option value="MAUVAISE_GESTION_EMOTIONS">Mauvaise gestion des émotions</option>
                      <option value="CRAVING">Craving</option>
                      <option value="INFLUENCE_PAIRS">Influence des pairs</option>
                      <option value="CHOMAGE_INACTIVITE">Chômage et défaut d'occupation</option>
                    </select>
                    <div *ngIf="hasError('causeRecidive')" class="form-error">
                      {{ getError('causeRecidive') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.motifConsultationAnterieure === 'SEVRAGE'">
                  <div class="form-group">
                    <label class="form-label required">Cause de l'échec de sevrage</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.causeEchecSevrage"
                      name="causeEchecSevrage"
                      [class.error]="hasError('causeEchecSevrage')"
                      [required]="formData.motifConsultationAnterieure === 'SEVRAGE'"
                    >
                      <option value="">Sélectionner une cause</option>
                      <option value="NON_OBSERVANCE">Non-observance du traitement</option>
                      <option value="SUIVI_INTERROMPU">Suivi interrompu</option>
                      <option value="NON_CONVAINCU">Non convaincu de l'approche thérapeutique</option>
                      <option value="SEJOUR_INTERROMPU">Séjour interrompu</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                    <div *ngIf="hasError('causeEchecSevrage')" class="form-error">
                      {{ getError('causeEchecSevrage') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Situation familiale -->
            <div class="form-section">
              <h3 class="section-title">Situation familiale</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Situation familiale</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="CELIBATAIRE"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Célibataire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="MARIE"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Marié(e)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="DIVORCE"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Divorcé(e)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="SEPARE"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Séparé(e)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="VEUF"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Veuf(ve)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="situationFamiliale" 
                        value="AUTRE"
                        [(ngModel)]="formData.situationFamiliale"
                        [class.error]="hasError('situationFamiliale')"
                        required
                      >
                      <span>Autre</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('situationFamiliale')" class="form-error">
                    {{ getError('situationFamiliale') }}
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.situationFamiliale === 'AUTRE'">
                <div class="form-group">
                  <label class="form-label required">Si autre, préciser</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.situationFamilialeAutre"
                    name="situationFamilialeAutre"
                    [class.error]="hasError('situationFamilialeAutre')"
                    [required]="formData.situationFamiliale === 'AUTRE'"
                  >
                  <div *ngIf="hasError('situationFamilialeAutre')" class="form-error">
                    {{ getError('situationFamilialeAutre') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Logement 30 derniers jours -->
            <div class="form-section">
              <h3 class="section-title">Logement durant les 30 derniers jours</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Durant les 30 derniers jours précédant la consultation, le patient vivait principalement</label>
                  <div class="radio-group vertical">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="SEUL"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Seul(e)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="FAMILLE_ORIGINE"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Avec sa famille d'origine (parents, etc.)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="PARTENAIRE"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Avec son partenaire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="ENFANTS"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Avec ses enfants</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="AMIS"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Avec des amis ou d'autres personnes (sans relation familiale)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="INTERNAT"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Dans un Internat</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="COLOCATION"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>En colocation</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="FOYER"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Dans un foyer universitaire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="DETENTION"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>En détention</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="CENTRE_JEUNESSE"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Dans un centre intégré de la jeunesse</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="INSTITUTION"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>En institution/refuge (pas de détention)</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="logement30Jours" 
                        value="AUTRE"
                        [(ngModel)]="formData.logement30Jours"
                        [class.error]="hasError('logement30Jours')"
                        required
                      >
                      <span>Autre</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('logement30Jours')" class="form-error">
                    {{ getError('logement30Jours') }}
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.logement30Jours === 'AUTRE'">
                <div class="form-group">
                  <label class="form-label required">Si autre, préciser</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.logement30JoursAutre"
                    name="logement30JoursAutre"
                    [class.error]="hasError('logement30JoursAutre')"
                    [required]="formData.logement30Jours === 'AUTRE'"
                  >
                  <div *ngIf="hasError('logement30JoursAutre')" class="form-error">
                    {{ getError('logement30JoursAutre') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Nature de logement -->
            <div class="form-section">
              <h3 class="section-title">Nature de logement</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Nature de logement</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="natureLogement" 
                        value="STABLE"
                        [(ngModel)]="formData.natureLogement"
                        [class.error]="hasError('natureLogement')"
                        required
                      >
                      <span>Logement stable</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="natureLogement" 
                        value="PRECAIRE"
                        [(ngModel)]="formData.natureLogement"
                        [class.error]="hasError('natureLogement')"
                        required
                      >
                      <span>Logement précaire/sans abri</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('natureLogement')" class="form-error">
                    {{ getError('natureLogement') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Profession -->
            <div class="form-section">
              <h3 class="section-title">Profession</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Profession</label>
                  <div class="radio-group vertical">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="EMPLOYE"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Employé</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="COMPTE_PROPRE"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Travaille pour son propre compte</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="JOURNALIER"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Journalier/travail irrégulier</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="SPORTIF"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Sportif professionnel</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="CHOMAGE"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>En chômage</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="ELEVE"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Élève</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="ETUDIANT"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Étudiant</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="FORMATION"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>En formation professionnelle</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="RETRAITE"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Retraité</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="profession" 
                        value="SANS_RESSOURCES"
                        [(ngModel)]="formData.profession"
                        [class.error]="hasError('profession')"
                        required
                      >
                      <span>Sans ressources</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('profession')" class="form-error">
                    {{ getError('profession') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Niveau scolaire -->
            <div class="form-section">
              <h3 class="section-title">Niveau scolaire</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Niveau scolaire</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="ANALPHABETE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Analphabète</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="PRESCOLAIRE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Préscolaire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="PRIMAIRE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Primaire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="COLLEGE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Collège</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="SECONDAIRE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Secondaire</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="FORMATION_PROF"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Formation professionnelle</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="niveauScolaire" 
                        value="UNIVERSITAIRE"
                        [(ngModel)]="formData.niveauScolaire"
                        [class.error]="hasError('niveauScolaire')"
                        required
                      >
                      <span>Universitaire</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('niveauScolaire')" class="form-error">
                    {{ getError('niveauScolaire') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Activité sportive -->
            <div class="form-section">
              <h3 class="section-title">Activité sportive</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Est-ce que vous pratiquez une activité sportive ?</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="activiteSportive" 
                        [value]="true"
                        [(ngModel)]="formData.activiteSportive"
                        [class.error]="hasError('activiteSportive')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="activiteSportive" 
                        [value]="false"
                        [(ngModel)]="formData.activiteSportive"
                        [class.error]="hasError('activiteSportive')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('activiteSportive')" class="form-error">
                    {{ getError('activiteSportive') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.activiteSportive === true">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Vous pratiquez une activité sportive de façon</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="activiteSportiveFrequence" 
                          value="REGULIERE"
                          [(ngModel)]="formData.activiteSportiveFrequence"
                          [class.error]="hasError('activiteSportiveFrequence')"
                          [required]="formData.activiteSportive === true"
                        >
                        <span>Régulière</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="activiteSportiveFrequence" 
                          value="IRREGULIERE"
                          [(ngModel)]="formData.activiteSportiveFrequence"
                          [class.error]="hasError('activiteSportiveFrequence')"
                          [required]="formData.activiteSportive === true"
                        >
                        <span>Irrégulière</span>
                      </label>
                    </div>
                    <div *ngIf="hasError('activiteSportiveFrequence')" class="form-error">
                      {{ getError('activiteSportiveFrequence') }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Vous pratiquez une activité sportive</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="activiteSportiveType" 
                          value="COMPETITION"
                          [(ngModel)]="formData.activiteSportiveType"
                          [class.error]="hasError('activiteSportiveType')"
                          [required]="formData.activiteSportive === true"
                        >
                        <span>De compétition</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="activiteSportiveType" 
                          value="LOISIR"
                          [(ngModel)]="formData.activiteSportiveType"
                          [class.error]="hasError('activiteSportiveType')"
                          [required]="formData.activiteSportive === true"
                        >
                        <span>De loisir</span>
                      </label>
                    </div>
                    <div *ngIf="hasError('activiteSportiveType')" class="form-error">
                      {{ getError('activiteSportiveType') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.activiteSportiveType === 'COMPETITION'">
                  <div class="form-group">
                    <label class="form-label required">Dopage</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="dopage" 
                          [value]="true"
                          [(ngModel)]="formData.dopage"
                          [class.error]="hasError('dopage')"
                          [required]="formData.activiteSportiveType === 'COMPETITION'"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="dopage" 
                          [value]="false"
                          [(ngModel)]="formData.dopage"
                          [class.error]="hasError('dopage')"
                          [required]="formData.activiteSportiveType === 'COMPETITION'"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                    <div *ngIf="hasError('dopage')" class="form-error">
                      {{ getError('dopage') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Consommation tabac & alcool -->
          <div *ngIf="currentStep === 2" class="step-content">
            <h2 class="step-heading">Consommation de tabac/produits tabagiques & alcool</h2>
            
            <!-- Consommation de tabac -->
            <div class="form-section">
              <h3 class="section-title">Consommation de tabac/produits nicotiniques</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Consommation de tabac/produits nicotiniques</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationTabac" 
                        value="FUMEUR"
                        [(ngModel)]="formData.consommationTabac"
                        [class.error]="hasError('consommationTabac')"
                        required
                      >
                      <span>Fumeur</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationTabac" 
                        value="NON_FUMEUR"
                        [(ngModel)]="formData.consommationTabac"
                        [class.error]="hasError('consommationTabac')"
                        required
                      >
                      <span>Non-fumeur</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationTabac" 
                        value="EX_FUMEUR"
                        [(ngModel)]="formData.consommationTabac"
                        [class.error]="hasError('consommationTabac')"
                        required
                      >
                      <span>Ex-fumeur</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('consommationTabac')" class="form-error">
                    {{ getError('consommationTabac') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationTabac === 'FUMEUR' || formData.consommationTabac === 'EX_FUMEUR'">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Âge lors de la première consommation de tabac</label>
                    <input 
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.agePremiereConsommationTabac"
                      name="agePremiereConsommationTabac"
                      [class.error]="hasError('agePremiereConsommationTabac')"
                      [required]="formData.consommationTabac === 'FUMEUR' || formData.consommationTabac === 'EX_FUMEUR'"
                      min="1"
                      max="100"
                    >
                    <div *ngIf="hasError('agePremiereConsommationTabac')" class="form-error">
                      {{ getError('agePremiereConsommationTabac') }}
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationTabac === 'FUMEUR'">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Consommation de tabac/produits tabagiques durant les 30 derniers jours</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="consommationTabac30Jours" 
                          [value]="true"
                          [(ngModel)]="formData.consommationTabac30Jours"
                          [class.error]="hasError('consommationTabac30Jours')"
                          [required]="formData.consommationTabac === 'FUMEUR'"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="consommationTabac30Jours" 
                          [value]="false"
                          [(ngModel)]="formData.consommationTabac30Jours"
                          [class.error]="hasError('consommationTabac30Jours')"
                          [required]="formData.consommationTabac === 'FUMEUR'"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                    <div *ngIf="hasError('consommationTabac30Jours')" class="form-error">
                      {{ getError('consommationTabac30Jours') }}
                    </div>
                  </div>
                </div>

                <div *ngIf="formData.consommationTabac30Jours === true">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label required">Fréquence de consommation de tabac/produits tabagiques durant les 30 derniers jours</label>
                      <div class="radio-group vertical">
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceTabac30Jours" 
                            value="QUOTIDIEN"
                            [(ngModel)]="formData.frequenceTabac30Jours"
                            [class.error]="hasError('frequenceTabac30Jours')"
                            [required]="formData.consommationTabac30Jours === true"
                          >
                          <span>Quotidiennement</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceTabac30Jours" 
                            value="2_3_JOURS"
                            [(ngModel)]="formData.frequenceTabac30Jours"
                            [class.error]="hasError('frequenceTabac30Jours')"
                            [required]="formData.consommationTabac30Jours === true"
                          >
                          <span>2 à 3 jours par semaine</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceTabac30Jours" 
                            value="HEBDOMADAIRE"
                            [(ngModel)]="formData.frequenceTabac30Jours"
                            [class.error]="hasError('frequenceTabac30Jours')"
                            [required]="formData.consommationTabac30Jours === true"
                          >
                          <span>Une fois par semaine ou moins</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceTabac30Jours" 
                            value="OCCASIONNEL"
                            [(ngModel)]="formData.frequenceTabac30Jours"
                            [class.error]="hasError('frequenceTabac30Jours')"
                            [required]="formData.consommationTabac30Jours === true"
                          >
                          <span>Occasionnellement</span>
                        </label>
                      </div>
                      <div *ngIf="hasError('frequenceTabac30Jours')" class="form-error">
                        {{ getError('frequenceTabac30Jours') }}
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Nombre de cigarettes/paquets par jour</label>
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.nombreCigarettesJour"
                        name="nombreCigarettesJour"
                        min="0"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Nombre de paquets/année</label>
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.nombrePaquetsAnnee"
                        name="nombrePaquetsAnnee"
                        min="0"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationTabac === 'EX_FUMEUR'">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Âge de l'arrêt de la consommation de tabac</label>
                    <input 
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.ageArretTabac"
                      name="ageArretTabac"
                      [class.error]="hasError('ageArretTabac')"
                      [required]="formData.consommationTabac === 'EX_FUMEUR'"
                      min="1"
                      max="100"
                    >
                    <div *ngIf="hasError('ageArretTabac')" class="form-error">
                      {{ getError('ageArretTabac') }}
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationTabac === 'FUMEUR' || formData.consommationTabac === 'EX_FUMEUR'">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">A-t-il demandé des soins de sevrage</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="soinsSevrageTabac" 
                          value="OUI_SATISFAIT"
                          [(ngModel)]="formData.soinsSevrageTabac"
                        >
                        <span>Oui, satisfait</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="soinsSevrageTabac" 
                          value="OUI_NON_SATISFAIT"
                          [(ngModel)]="formData.soinsSevrageTabac"
                        >
                        <span>Oui, non satisfait</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="soinsSevrageTabac" 
                          value="NON"
                          [(ngModel)]="formData.soinsSevrageTabac"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">A-t-il fait un sevrage médicalement assisté ?</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="sevrageAssiste" 
                          [value]="true"
                          [(ngModel)]="formData.sevrageAssiste"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="sevrageAssiste" 
                          [value]="false"
                          [(ngModel)]="formData.sevrageAssiste"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Consommation d'alcool -->
            <div class="form-section">
              <h3 class="section-title">Consommation d'alcool</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Consommation d'alcool</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationAlcool" 
                        [value]="true"
                        [(ngModel)]="formData.consommationAlcool"
                        [class.error]="hasError('consommationAlcool')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationAlcool" 
                        [value]="false"
                        [(ngModel)]="formData.consommationAlcool"
                        [class.error]="hasError('consommationAlcool')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('consommationAlcool')" class="form-error">
                    {{ getError('consommationAlcool') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationAlcool === true">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Âge lors de la première consommation d'alcool</label>
                    <input 
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.agePremiereConsommationAlcool"
                      name="agePremiereConsommationAlcool"
                      [class.error]="hasError('agePremiereConsommationAlcool')"
                      [required]="formData.consommationAlcool === true"
                      min="1"
                      max="100"
                    >
                    <div *ngIf="hasError('agePremiereConsommationAlcool')" class="form-error">
                      {{ getError('agePremiereConsommationAlcool') }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Consommation d'alcool durant les 30 derniers jours</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="consommationAlcool30Jours" 
                          [value]="true"
                          [(ngModel)]="formData.consommationAlcool30Jours"
                          [class.error]="hasError('consommationAlcool30Jours')"
                          [required]="formData.consommationAlcool === true"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="consommationAlcool30Jours" 
                          [value]="false"
                          [(ngModel)]="formData.consommationAlcool30Jours"
                          [class.error]="hasError('consommationAlcool30Jours')"
                          [required]="formData.consommationAlcool === true"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                    <div *ngIf="hasError('consommationAlcool30Jours')" class="form-error">
                      {{ getError('consommationAlcool30Jours') }}
                    </div>
                  </div>
                </div>

                <div *ngIf="formData.consommationAlcool30Jours === true">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label required">Fréquence de consommation d'alcool durant les 30 derniers jours</label>
                      <div class="radio-group vertical">
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceAlcool30Jours" 
                            value="QUOTIDIEN"
                            [(ngModel)]="formData.frequenceAlcool30Jours"
                            [class.error]="hasError('frequenceAlcool30Jours')"
                            [required]="formData.consommationAlcool30Jours === true"
                          >
                          <span>Quotidiennement</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceAlcool30Jours" 
                            value="2_3_JOURS"
                            [(ngModel)]="formData.frequenceAlcool30Jours"
                            [class.error]="hasError('frequenceAlcool30Jours')"
                            [required]="formData.consommationAlcool30Jours === true"
                          >
                          <span>2 à 3 jours par semaine</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceAlcool30Jours" 
                            value="HEBDOMADAIRE"
                            [(ngModel)]="formData.frequenceAlcool30Jours"
                            [class.error]="hasError('frequenceAlcool30Jours')"
                            [required]="formData.consommationAlcool30Jours === true"
                          >
                          <span>Une fois par semaine ou moins</span>
                        </label>
                        <label class="radio-item">
                          <input 
                            type="radio" 
                            name="frequenceAlcool30Jours" 
                            value="OCCASIONNEL"
                            [(ngModel)]="formData.frequenceAlcool30Jours"
                            [class.error]="hasError('frequenceAlcool30Jours')"
                            [required]="formData.consommationAlcool30Jours === true"
                          >
                          <span>Occasionnellement</span>
                        </label>
                      </div>
                      <div *ngIf="hasError('frequenceAlcool30Jours')" class="form-error">
                        {{ getError('frequenceAlcool30Jours') }}
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Quantité d'alcool consommé (nombre de verres/prise)</label>
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.quantiteAlcoolPrise"
                        name="quantiteAlcoolPrise"
                        min="0"
                      >
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Quel type d'alcool consommé :</label>
                      <div class="checkbox-grid">
                        <label class="checkbox-item">
                          <input 
                            type="checkbox"
                            [(ngModel)]="formData.typeAlcool.biere"
                            name="typeAlcoolBiere"
                          >
                          <span>Bière</span>
                        </label>
                        
                        <label class="checkbox-item">
                          <input 
                            type="checkbox"
                            [(ngModel)]="formData.typeAlcool.liqueurs"
                            name="typeAlcoolLiqueurs"
                          >
                          <span>Liqueurs</span>
                        </label>
                        
                        <label class="checkbox-item">
                          <input 
                            type="checkbox"
                            [(ngModel)]="formData.typeAlcool.alcoolBruler"
                            name="typeAlcoolAlcoolBruler"
                          >
                          <span>Alcool à brûler</span>
                        </label>
                        
                        <label class="checkbox-item">
                          <input 
                            type="checkbox"
                            [(ngModel)]="formData.typeAlcool.legmi"
                            name="typeAlcoolLegmi"
                          >
                          <span>Legmi</span>
                        </label>
                        
                        <label class="checkbox-item">
                          <input 
                            type="checkbox"
                            [(ngModel)]="formData.typeAlcool.boukha"
                            name="typeAlcoolBoukha"
                          >
                          <span>Boukha</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Consommation de substances psychoactives -->
          <div *ngIf="currentStep === 3" class="step-content">
            <h2 class="step-heading">Consommation de substances psychoactives (en dehors de tabac et l'alcool) et autres comportements addictifs</h2>
            
            <!-- Consommation de SPA dans l'entourage -->
            <div class="form-section">
              <h3 class="section-title">Consommation de SPA dans l'entourage</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Consommation de SPA dans l'entourage</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationSpaEntourage" 
                        [value]="true"
                        [(ngModel)]="formData.consommationSpaEntourage"
                        [class.error]="hasError('consommationSpaEntourage')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationSpaEntourage" 
                        [value]="false"
                        [(ngModel)]="formData.consommationSpaEntourage"
                        [class.error]="hasError('consommationSpaEntourage')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('consommationSpaEntourage')" class="form-error">
                    {{ getError('consommationSpaEntourage') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationSpaEntourage === true">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Si consommation de SPA dans l'entourage oui</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.membresFamille"
                          name="entourageMembresFamille"
                        >
                        <span>Membre(s) de la famille</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.amis"
                          name="entourageAmis"
                        >
                        <span>Ami(e)s</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.milieuProfessionnel"
                          name="entourageMilieuProfessionnel"
                        >
                        <span>Milieu professionnel</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.milieuSportif"
                          name="entourageMilieuSportif"
                        >
                        <span>Milieu sportif</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.milieuScolaire"
                          name="entourageMilieuScolaire"
                        >
                        <span>Milieu scolaire et universitaire</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.entourageSpa.autre"
                          name="entourageAutre"
                        >
                        <span>Autre</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.entourageSpa.autre">
                  <div class="form-group">
                    <label class="form-label required">Si autre, préciser</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.entourageSpa.autrePrecision"
                      name="entourageAutrePrecision"
                      [class.error]="hasError('entourageAutrePrecision')"
                      [required]="!!formData.entourageSpa.autre"
                    >
                    <div *ngIf="hasError('entourageAutrePrecision')" class="form-error">
                      {{ getError('entourageAutrePrecision') }}
                    </div>
                  </div>
                </div>

                <!-- Types de SPA consommées dans l'entourage -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Type de SPA consommées dans l'entourage</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.tabac"
                          name="typeSpaEntourageTabac"
                        >
                        <span>Tabac</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.alcool"
                          name="typeSpaEntourageAlcool"
                        >
                        <span>Alcool</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.cannabis"
                          name="typeSpaEntourageCannabis"
                        >
                        <span>Cannabis</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.opium"
                          name="typeSpaEntourageOpium"
                        >
                        <span>Opium</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.morphiniques"
                          name="typeSpaEntourageMorphiniques"
                        >
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.heroine"
                          name="typeSpaEntourageHeroine"
                        >
                        <span>Héroïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.cocaine"
                          name="typeSpaEntourageCocaine"
                        >
                        <span>Cocaïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.hypnotiques"
                          name="typeSpaEntourageHypnotiques"
                        >
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.amphetamines"
                          name="typeSpaEntourageAmphetamines"
                        >
                        <span>Amphétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.ecstasy"
                          name="typeSpaEntourageEcstasy"
                        >
                        <span>Ecstasy</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.produitsInhaler"
                          name="typeSpaEntourageProduitsInhaler"
                        >
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.pregabaline"
                          name="typeSpaEntouragePregabaline"
                        >
                        <span>Prégabaline</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.ketamines"
                          name="typeSpaEntourageKetamines"
                        >
                        <span>Kétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.lsd"
                          name="typeSpaEntourageLsd"
                        >
                        <span>LSD</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.typeSpaEntourage.autre"
                          name="typeSpaEntourageAutre"
                        >
                        <span>Autre</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.typeSpaEntourage.morphiniques">
                  <div class="form-group">
                    <label class="form-label required">Si morphiniques oui, préciser la substance</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.typeSpaEntourage.morphiniquesPrecision"
                      name="typeSpaEntourageMorphiniquesPrecision"
                      [class.error]="hasError('typeSpaEntourageMorphiniquesPrecision')"
                      [required]="!!formData.typeSpaEntourage.morphiniques"
                    >
                      <option value="">Sélectionner une substance</option>
                      <option value="SUBUTEX">Subutex</option>
                      <option value="METHADONE">Méthadone</option>
                      <option value="TRAMAL">Tramal</option>
                      <option value="COALGESIC">Coalgésic</option>
                      <option value="FENTANYL">Fentanyl</option>
                    </select>
                    <div *ngIf="hasError('typeSpaEntourageMorphiniquesPrecision')" class="form-error">
                      {{ getError('typeSpaEntourageMorphiniquesPrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.typeSpaEntourage.hypnotiques">
                  <div class="form-group">
                    <label class="form-label">Préciser les hypnotiques & sédatifs</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.typeSpaEntourage.hypnotiquesPrecision"
                      name="typeSpaEntourageHypnotiquesPrecision"
                      placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                    >
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.typeSpaEntourage.autre">
                  <div class="form-group">
                    <label class="form-label required">Si autre, préciser</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.typeSpaEntourage.autrePrecision"
                      name="typeSpaEntourageAutrePrecision"
                      [class.error]="hasError('typeSpaEntourageAutrePrecision')"
                      [required]="!!formData.typeSpaEntourage.autre"
                    >
                    <div *ngIf="hasError('typeSpaEntourageAutrePrecision')" class="form-error">
                      {{ getError('typeSpaEntourageAutrePrecision') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Consommation personnelle de SPA -->
            <div class="form-section">
              <h3 class="section-title">Consommation personnelle de SPA</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Consommez-vous des SPA en dehors de l'alcool et tabac</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationSpaPersonnelle" 
                        [value]="true"
                        [(ngModel)]="formData.consommationSpaPersonnelle"
                        [class.error]="hasError('consommationSpaPersonnelle')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="consommationSpaPersonnelle" 
                        [value]="false"
                        [(ngModel)]="formData.consommationSpaPersonnelle"
                        [class.error]="hasError('consommationSpaPersonnelle')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('consommationSpaPersonnelle')" class="form-error">
                    {{ getError('consommationSpaPersonnelle') }}
                  </div>
                </div>
              </div>

              <div *ngIf="formData.consommationSpaPersonnelle === true">
                <!-- Drogues utilisées actuellement -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Quelle(s) est/sont la/les drogue(s) utilisée(s) actuellement chez le patient</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.cannabis"
                          name="droguesActuellesCannabis"
                        >
                        <span>Cannabis</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.opium"
                          name="droguesActuellesOpium"
                        >
                        <span>Opium</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.morphiniques"
                          name="droguesActuellesMorphiniques"
                        >
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.heroine"
                          name="droguesActuellesHeroine"
                        >
                        <span>Héroïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.cocaine"
                          name="droguesActuellesCocaine"
                        >
                        <span>Cocaïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.hypnotiques"
                          name="droguesActuellesHypnotiques"
                        >
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.amphetamines"
                          name="droguesActuellesAmphetamines"
                        >
                        <span>Amphétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.ecstasy"
                          name="droguesActuellesEcstasy"
                        >
                        <span>Ecstasy</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.produitsInhaler"
                          name="droguesActuellesProduitsInhaler"
                        >
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.pregabaline"
                          name="droguesActuellesPregabaline"
                        >
                        <span>Prégabaline</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.ketamines"
                          name="droguesActuellesKetamines"
                        >
                        <span>Kétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.lsd"
                          name="droguesActuellesLsd"
                        >
                        <span>LSD</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.droguesActuelles.autre"
                          name="droguesActuellesAutre"
                        >
                        <span>Autre</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.droguesActuelles.morphiniques">
                  <div class="form-group">
                    <label class="form-label required">Si morphiniques oui, préciser la substance</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.droguesActuelles.morphiniquesPrecision"
                      name="droguesActuellesMorphiniquesPrecision"
                      [class.error]="hasError('droguesActuellesMorphiniquesPrecision')"
                      [required]="!!formData.droguesActuelles.morphiniques"
                    >
                      <option value="">Sélectionner une substance</option>
                      <option value="SUBUTEX">Subutex</option>
                      <option value="METHADONE">Méthadone</option>
                      <option value="TRAMAL">Tramal</option>
                      <option value="COALGESIC">Coalgésic</option>
                      <option value="FENTANYL">Fentanyl</option>
                    </select>
                    <div *ngIf="hasError('droguesActuellesMorphiniquesPrecision')" class="form-error">
                      {{ getError('droguesActuellesMorphiniquesPrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.droguesActuelles.hypnotiques">
                  <div class="form-group">
                    <label class="form-label">Préciser les hypnotiques & sédatifs</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.droguesActuelles.hypnotiquesPrecision"
                      name="droguesActuellesHypnotiquesPrecision"
                      placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                    >
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.droguesActuelles.autre">
                  <div class="form-group">
                    <label class="form-label required">Si autre, préciser</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.droguesActuelles.autrePrecision"
                      name="droguesActuellesAutrePrecision"
                      [class.error]="hasError('droguesActuellesAutrePrecision')"
                      [required]="!!formData.droguesActuelles.autre"
                    >
                    <div *ngIf="hasError('droguesActuellesAutrePrecision')" class="form-error">
                      {{ getError('droguesActuellesAutrePrecision') }}
                    </div>
                  </div>
                </div>

                <!-- Substance d'initiation -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Quelle est la substance d'initiation de consommation chez le patient</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.cannabis"
                          name="substanceInitiationCannabis"
                        >
                        <span>Cannabis</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.opium"
                          name="substanceInitiationOpium"
                        >
                        <span>Opium</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.morphiniques"
                          name="substanceInitiationMorphiniques"
                        >
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.heroine"
                          name="substanceInitiationHeroine"
                        >
                        <span>Héroïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.cocaine"
                          name="substanceInitiationCocaine"
                        >
                        <span>Cocaïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.hypnotiques"
                          name="substanceInitiationHypnotiques"
                        >
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.amphetamines"
                          name="substanceInitiationAmphetamines"
                        >
                        <span>Amphétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.ecstasy"
                          name="substanceInitiationEcstasy"
                        >
                        <span>Ecstasy</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.produitsInhaler"
                          name="substanceInitiationProduitsInhaler"
                        >
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.pregabaline"
                          name="substanceInitiationPregabaline"
                        >
                        <span>Prégabaline</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.ketamines"
                          name="substanceInitiationKetamines"
                        >
                        <span>Kétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.lsd"
                          name="substanceInitiationLsd"
                        >
                        <span>LSD</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substanceInitiation.autre"
                          name="substanceInitiationAutre"
                        >
                        <span>Autre</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substanceInitiation.morphiniques">
                  <div class="form-group">
                    <label class="form-label required">Si morphiniques oui, préciser la substance</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.substanceInitiation.morphiniquesPrecision"
                      name="substanceInitiationMorphiniquesPrecision"
                      [class.error]="hasError('substanceInitiationMorphiniquesPrecision')"
                      [required]="!!formData.substanceInitiation.morphiniques"
                    >
                      <option value="">Sélectionner une substance</option>
                      <option value="SUBUTEX">Subutex</option>
                      <option value="METHADONE">Méthadone</option>
                      <option value="TRAMAL">Tramal</option>
                      <option value="COALGESIC">Coalgésic</option>
                      <option value="FENTANYL">Fentanyl</option>
                    </select>
                    <div *ngIf="hasError('substanceInitiationMorphiniquesPrecision')" class="form-error">
                      {{ getError('substanceInitiationMorphiniquesPrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substanceInitiation.hypnotiques">
                  <div class="form-group">
                    <label class="form-label">Préciser les hypnotiques & sédatifs</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.substanceInitiation.hypnotiquesPrecision"
                      name="substanceInitiationHypnotiquesPrecision"
                      placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                    >
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substanceInitiation.autre">
                  <div class="form-group">
                    <label class="form-label required">Si autre, préciser</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.substanceInitiation.autrePrecision"
                      name="substanceInitiationAutrePrecision"
                      [class.error]="hasError('substanceInitiationAutrePrecision')"
                      [required]="!!formData.substanceInitiation.autre"
                    >
                    <div *ngIf="hasError('substanceInitiationAutrePrecision')" class="form-error">
                      {{ getError('substanceInitiationAutrePrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Âge d'initiation à la consommation de la première substance</label>
                    <input 
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.ageInitiationPremiere"
                      name="ageInitiationPremiere"
                      min="1"
                      max="100"
                    >
                  </div>
                </div>

                <!--Substance principale -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">(en cas de poly-consommation) Quelle est la substance principale de consommation chez le patient (la plus consommée)</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.cannabis"
                          name="substancePrincipaleCannabis"
                        >
                        <span>Cannabis</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.opium"
                          name="substancePrincipaleOpium"
                        >
                        <span>Opium</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.morphiniques"
                          name="substancePrincipaleMorphiniques"
                        >
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.heroine"
                          name="substancePrincipaleHeroine"
                        >
                        <span>Héroïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.cocaine"
                          name="substancePrincipaleCocaine"
                        >
                        <span>Cocaïne</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.hypnotiques"
                          name="substancePrincipaleHypnotiques"
                        >
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.amphetamines"
                          name="substancePrincipaleAmphetamines"
                        >
                        <span>Amphétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.ecstasy"
                          name="substancePrincipaleEcstasy"
                        >
                        <span>Ecstasy</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.produitsInhaler"
                          name="substancePrincipaleProduitsInhaler"
                        >
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.pregabaline"
                          name="substancePrincipalePregabaline"
                        >
                        <span>Prégabaline</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.ketamines"
                          name="substancePrincipaleKetamines"
                        >
                        <span>Kétamines</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.lsd"
                          name="substancePrincipaleLsd"
                        >
                        <span>LSD</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.substancePrincipale.autre"
                          name="substancePrincipaleAutre"
                        >
                        <span>Autre</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substancePrincipale.morphiniques">
                  <div class="form-group">
                    <label class="form-label required">Si morphiniques oui, préciser la substance</label>
                    <select 
                      class="form-select"
                      [(ngModel)]="formData.substancePrincipale.morphiniquesPrecision"
                      name="substancePrincipaleMorphiniquesPrecision"
                      [class.error]="hasError('substancePrincipaleMorphiniquesPrecision')"
                      [required]="!!formData.substancePrincipale.morphiniques"
                    >
                      <option value="">Sélectionner une substance</option>
                      <option value="SUBUTEX">Subutex</option>
                      <option value="METHADONE">Méthadone</option>
                      <option value="TRAMAL">Tramal</option>
                      <option value="COALGESIC">Coalgésic</option>
                      <option value="FENTANYL">Fentanyl</option>
                    </select>
                    <div *ngIf="hasError('substancePrincipaleMorphiniquesPrecision')" class="form-error">
                      {{ getError('substancePrincipaleMorphiniquesPrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substancePrincipale.hypnotiques">
                  <div class="form-group">
                    <label class="form-label">Préciser les hypnotiques & sédatifs</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.substancePrincipale.hypnotiquesPrecision"
                      name="substancePrincipaleHypnotiquesPrecision"
                      placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                    >
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.substancePrincipale.autre">
                  <div class="form-group">
                    <label class="form-label required">Si autre, préciser</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.substancePrincipale.autrePrecision"
                      name="substancePrincipaleAutrePrecision"
                      [class.error]="hasError('substancePrincipaleAutrePrecision')"
                      [required]="!!formData.substancePrincipale.autre"
                    >
                    <div *ngIf="hasError('substancePrincipaleAutrePrecision')" class="form-error">
                      {{ getError('substancePrincipaleAutrePrecision') }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Âge d'initiation de consommation de la substance principale</label>
                    <input 
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.ageInitiationPrincipale"
                      name="ageInitiationPrincipale"
                      min="1"
                      max="100"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Autres comportements addictifs -->
            <div class="form-section">
              <h3 class="section-title">Autres comportements addictifs</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Antécédents de troubles des comportements alimentaires (boulimie)</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="troublesAlimentaires" 
                        [value]="true"
                        [(ngModel)]="formData.troublesAlimentaires"
                        [class.error]="hasError('troublesAlimentaires')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="troublesAlimentaires" 
                        [value]="false"
                        [(ngModel)]="formData.troublesAlimentaires"
                        [class.error]="hasError('troublesAlimentaires')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('troublesAlimentaires')" class="form-error">
                    {{ getError('troublesAlimentaires') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Addiction aux jeux pathologiques</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="addictionJeux" 
                        [value]="true"
                        [(ngModel)]="formData.addictionJeux"
                        [class.error]="hasError('addictionJeux')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="addictionJeux" 
                        [value]="false"
                        [(ngModel)]="formData.addictionJeux"
                        [class.error]="hasError('addictionJeux')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('addictionJeux')" class="form-error">
                    {{ getError('addictionJeux') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Addiction aux écrans</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="addictionEcrans" 
                        [value]="true"
                        [(ngModel)]="formData.addictionEcrans"
                        [class.error]="hasError('addictionEcrans')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="addictionEcrans" 
                        [value]="false"
                        [(ngModel)]="formData.addictionEcrans"
                        [class.error]="hasError('addictionEcrans')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('addictionEcrans')" class="form-error">
                    {{ getError('addictionEcrans') }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Comportements sexuels addictifs</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comportementsSexuels" 
                        [value]="true"
                        [(ngModel)]="formData.comportementsSexuels"
                        [class.error]="hasError('comportementsSexuels')"
                        required
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comportementsSexuels" 
                        [value]="false"
                        [(ngModel)]="formData.comportementsSexuels"
                        [class.error]="hasError('comportementsSexuels')"
                        required
                      >
                      <span>Non</span>
                    </label>
                  </div>
                  <div *ngIf="hasError('comportementsSexuels')" class="form-error">
                    {{ getError('comportementsSexuels') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4: Comportements liés à la consommation des SPA et tests de dépistage -->
          <div *ngIf="currentStep === 4" class="step-content">
            <h2 class="step-heading">Comportements liés à la consommation des SPA et tests de dépistage VIH, VHC et VHB</h2>
            
            <!-- Voie d'administration habituelle -->
            <div class="form-section">
              <h3 class="section-title">Voie d'administration habituelle (substance principale)</h3>
              
              <div class="checkbox-grid">
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.injectee"
                    name="voieAdministrationInjectee"
                  >
                  <span>Injectée</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.fumee"
                    name="voieAdministrationFumee"
                  >
                  <span>Fumée</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.ingeree"
                    name="voieAdministrationIngeree"
                  >
                  <span>Ingérée/bue</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.sniffee"
                    name="voieAdministrationSniffee"
                  >
                  <span>Sniffée</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.inhalee"
                    name="voieAdministrationInhalee"
                  >
                  <span>Inhalée</span>
                </label>
                
                <label class="checkbox-item">
                  <input 
                    type="checkbox"
                    [(ngModel)]="formData.voieAdministration.autre"
                    name="voieAdministrationAutre"
                  >
                  <span>Autre</span>
                </label>
              </div>

              <div class="form-row" *ngIf="formData.voieAdministration.autre">
                <div class="form-group">
                  <label class="form-label required">Si autre, préciser</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.voieAdministration.autrePrecision"
                    name="voieAdministrationAutrePrecision"
                    [class.error]="hasError('voieAdministrationAutrePrecision')"
                    [required]="!!formData.voieAdministration.autre"
                  >
                  <div *ngIf="hasError('voieAdministrationAutrePrecision')" class="form-error">
                    {{ getError('voieAdministrationAutrePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Fréquence de consommation -->
            <div class="form-section">
              <h3 class="section-title">Fréquence de consommation de la substance principale</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Fréquence de consommation</label>
                  <div class="radio-group vertical">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="frequenceSubstancePrincipale" 
                        value="DEUX_FOIS_PLUS_PAR_JOUR"
                        [(ngModel)]="formData.frequenceSubstancePrincipale"
                      >
                      <span>2 fois (/doses) ou plus par jour</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="frequenceSubstancePrincipale" 
                        value="UNE_FOIS_PAR_JOUR"
                        [(ngModel)]="formData.frequenceSubstancePrincipale"
                      >
                      <span>Une fois (dose) par jour</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="frequenceSubstancePrincipale" 
                        value="DEUX_TROIS_JOURS_SEMAINE"
                        [(ngModel)]="formData.frequenceSubstancePrincipale"
                      >
                      <span>2 à 3 jours par semaine</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="frequenceSubstancePrincipale" 
                        value="UNE_FOIS_SEMAINE"
                        [(ngModel)]="formData.frequenceSubstancePrincipale"
                      >
                      <span>Une fois par semaine</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="frequenceSubstancePrincipale" 
                        value="OCCASIONNEL_FESTIF"
                        [(ngModel)]="formData.frequenceSubstancePrincipale"
                      >
                      <span>Occasionnellement (usage festif)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Partage de seringues -->
            <div class="form-section">
              <h3 class="section-title">Notion de partage de seringues pendant la période précédente</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Partage de seringues</label>
                  <div class="radio-group vertical">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="JAMAIS_PARTAGE"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>N'a jamais partagé de seringue</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="INFERIEUR_1_MOIS"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>Inférieur à un mois</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="ENTRE_1_3_MOIS"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>Entre 1 mois et 3 mois</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="ENTRE_3_6_MOIS"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>Entre 3 mois et 6 mois</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="ENTRE_6_12_MOIS"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>Entre 6 mois et 12 mois</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="partageSeringues" 
                        value="DOUZE_MOIS_PLUS"
                        [(ngModel)]="formData.partageSeringues"
                      >
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tests de dépistage -->
            <div class="form-section">
              <h3 class="section-title">Tests de dépistage</h3>
              
              <div class="tests-table">
                <div class="test-header">
                  <div class="test-name">Test</div>
                  <div class="test-realise">Test réalisé</div>
                  <div class="test-date">Date du test</div>
                </div>

                <!-- Test VIH -->
                <div class="test-row">
                  <div class="test-name">VIH</div>
                  <div class="test-realise">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVihRealise" 
                          [value]="true"
                          [(ngModel)]="formData.testVih.realise"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVihRealise" 
                          [value]="false"
                          [(ngModel)]="formData.testVih.realise"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                  <div class="test-date" *ngIf="formData.testVih.realise === true">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVihPeriode" 
                          value="3_MOIS"
                          [(ngModel)]="formData.testVih.periode"
                        >
                        <span>3 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVihPeriode" 
                          value="6_MOIS"
                          [(ngModel)]="formData.testVih.periode"
                        >
                        <span>6 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVihPeriode" 
                          value="12_MOIS_PLUS"
                          [(ngModel)]="formData.testVih.periode"
                        >
                        <span>12 mois ou plus</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Test VHC -->
                <div class="test-row">
                  <div class="test-name">VHC</div>
                  <div class="test-realise">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhcRealise" 
                          [value]="true"
                          [(ngModel)]="formData.testVhc.realise"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhcRealise" 
                          [value]="false"
                          [(ngModel)]="formData.testVhc.realise"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                  <div class="test-date" *ngIf="formData.testVhc.realise === true">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhcPeriode" 
                          value="3_MOIS"
                          [(ngModel)]="formData.testVhc.periode"
                        >
                        <span>3 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhcPeriode" 
                          value="6_MOIS"
                          [(ngModel)]="formData.testVhc.periode"
                        >
                        <span>6 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhcPeriode" 
                          value="12_MOIS_PLUS"
                          [(ngModel)]="formData.testVhc.periode"
                        >
                        <span>12 mois ou plus</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Test VHB -->
                <div class="test-row">
                  <div class="test-name">VHB</div>
                  <div class="test-realise">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhbRealise" 
                          [value]="true"
                          [(ngModel)]="formData.testVhb.realise"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhbRealise" 
                          [value]="false"
                          [(ngModel)]="formData.testVhb.realise"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                  <div class="test-date" *ngIf="formData.testVhb.realise === true">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhbPeriode" 
                          value="3_MOIS"
                          [(ngModel)]="formData.testVhb.periode"
                        >
                        <span>3 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhbPeriode" 
                          value="6_MOIS"
                          [(ngModel)]="formData.testVhb.periode"
                        >
                        <span>6 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testVhbPeriode" 
                          value="12_MOIS_PLUS"
                          [(ngModel)]="formData.testVhb.periode"
                        >
                        <span>12 mois ou plus</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Test Syphilis -->
                <div class="test-row">
                  <div class="test-name">Test du Syphilis (il est déjà pratiqué aux CCDAG)</div>
                  <div class="test-realise">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testSyphilisRealise" 
                          [value]="true"
                          [(ngModel)]="formData.testSyphilis.realise"
                        >
                        <span>Oui</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testSyphilisRealise" 
                          [value]="false"
                          [(ngModel)]="formData.testSyphilis.realise"
                        >
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                  <div class="test-date" *ngIf="formData.testSyphilis.realise === true">
                    <div class="radio-group">
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testSyphilisPeriode" 
                          value="3_MOIS"
                          [(ngModel)]="formData.testSyphilis.periode"
                        >
                        <span>3 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testSyphilisPeriode" 
                          value="6_MOIS"
                          [(ngModel)]="formData.testSyphilis.periode"
                        >
                        <span>6 mois</span>
                      </label>
                      <label class="radio-item">
                        <input 
                          type="radio" 
                          name="testSyphilisPeriode" 
                          value="12_MOIS_PLUS"
                          [(ngModel)]="formData.testSyphilis.periode"
                        >
                        <span>12 mois ou plus</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accompagnement sevrage -->
            <div class="form-section">
              <h3 class="section-title">Accompagnement en vue d'un sevrage</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Est-ce que vous souhaitez avoir un accompagnement en vue d'un sevrage ?</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="accompagnementSevrage" 
                        [value]="true"
                        [(ngModel)]="formData.accompagnementSevrage"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="accompagnementSevrage" 
                        [value]="false"
                        [(ngModel)]="formData.accompagnementSevrage"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.accompagnementSevrage === false">
                <div class="form-group">
                  <label class="form-label">Si non, pourquoi</label>
                  <input 
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.accompagnementSevrageNonRaison"
                    name="accompagnementSevrageNonRaison"
                  >
                </div>
              </div>
            </div>

            <!-- Tentative de sevrage -->
            <div class="form-section">
              <h3 class="section-title">Tentative de sevrage</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Est-ce que vous avez déjà tenté le sevrage ?</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="tentativeSevrage" 
                        [value]="true"
                        [(ngModel)]="formData.tentativeSevrage"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="tentativeSevrage" 
                        [value]="false"
                        [(ngModel)]="formData.tentativeSevrage"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div *ngIf="formData.tentativeSevrage === true">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Si oui</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.tentativeSevrageDetails.toutSeul"
                          name="tentativeSevrageToutSeul"
                        >
                        <span>Tout seul</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.tentativeSevrageDetails.soutienFamille"
                          name="tentativeSevrageSoutienFamille"
                        >
                        <span>Avec le soutien de la famille</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.tentativeSevrageDetails.soutienAmi"
                          name="tentativeSevrageSoutienAmi"
                        >
                        <span>Avec le soutien d'un ami</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.tentativeSevrageDetails.soutienScolaire"
                          name="tentativeSevrageSoutienScolaire"
                        >
                        <span>Avec un soutien scolaire</span>
                      </label>
                      
                      <label class="checkbox-item">
                        <input 
                          type="checkbox"
                          [(ngModel)]="formData.tentativeSevrageDetails.structureSante"
                          name="tentativeSevrageStructureSante"
                        >
                        <span>Dans une structure de santé</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-row" *ngIf="formData.tentativeSevrageDetails.structureSante">
                  <div class="form-group">
                    <label class="form-label required">Si structure de santé oui, laquelle</label>
                    <input 
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.tentativeSevrageDetails.structureSantePrecision"
                      name="tentativeSevrageStructureSantePrecision"
                      [class.error]="hasError('tentativeSevrageStructureSantePrecision')"
                      [required]="!!formData.tentativeSevrageDetails.structureSante"
                    >
                    <div *ngIf="hasError('tentativeSevrageStructureSantePrecision')" class="form-error">
                      {{ getError('tentativeSevrageStructureSantePrecision') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 5: Comorbidités -->
          <div *ngIf="currentStep === 5" class="step-content">
            <h2 class="step-heading">Comorbidités</h2>
            
            <!-- Comorbidités psychiatriques personnelles -->
            <div class="form-section">
              <h3 class="section-title">Comorbidités psychiatriques personnelles</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Comorbidités psychiatriques personnelles</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditePsychiatriquePersonnelle" 
                        [value]="true"
                        [(ngModel)]="formData.comorbiditePsychiatriquePersonnelle"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditePsychiatriquePersonnelle" 
                        [value]="false"
                        [(ngModel)]="formData.comorbiditePsychiatriquePersonnelle"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.comorbiditePsychiatriquePersonnelle === true">
                <div class="form-group">
                  <label class="form-label required">Si oui, préciser</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="formData.comorbiditePsychiatriquePersonnellePrecision"
                    name="comorbiditePsychiatriquePersonnellePrecision"
                    [class.error]="hasError('comorbiditePsychiatriquePersonnellePrecision')"
                    [required]="formData.comorbiditePsychiatriquePersonnelle === true"
                    rows="3"
                  ></textarea>
                  <div *ngIf="hasError('comorbiditePsychiatriquePersonnellePrecision')" class="form-error">
                    {{ getError('comorbiditePsychiatriquePersonnellePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Comorbidités somatiques personnelles -->
            <div class="form-section">
              <h3 class="section-title">Comorbidités somatiques personnelles</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Comorbidités somatiques personnelles</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditeSomatiquePersonnelle" 
                        [value]="true"
                        [(ngModel)]="formData.comorbiditeSomatiquePersonnelle"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditeSomatiquePersonnelle" 
                        [value]="false"
                        [(ngModel)]="formData.comorbiditeSomatiquePersonnelle"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.comorbiditeSomatiquePersonnelle === true">
                <div class="form-group">
                  <label class="form-label required">Si oui, préciser</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="formData.comorbiditeSomatiquePersonnellePrecision"
                    name="comorbiditeSomatiquePersonnellePrecision"
                    [class.error]="hasError('comorbiditeSomatiquePersonnellePrecision')"
                    [required]="formData.comorbiditeSomatiquePersonnelle === true"
                    rows="3"
                  ></textarea>
                  <div *ngIf="hasError('comorbiditeSomatiquePersonnellePrecision')" class="form-error">
                    {{ getError('comorbiditeSomatiquePersonnellePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Comorbidités psychiatriques des partenaires -->
            <div class="form-section">
              <h3 class="section-title">Comorbidités psychiatriques des partenaires</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Comorbidités psychiatriques des partenaires</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditePsychiatriquePartenaire" 
                        [value]="true"
                        [(ngModel)]="formData.comorbiditePsychiatriquePartenaire"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditePsychiatriquePartenaire" 
                        [value]="false"
                        [(ngModel)]="formData.comorbiditePsychiatriquePartenaire"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.comorbiditePsychiatriquePartenaire === true">
                <div class="form-group">
                  <label class="form-label required">Si oui, préciser</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="formData.comorbiditePsychiatriquePartenairePrecision"
                    name="comorbiditePsychiatriquePartenairePrecision"
                    [class.error]="hasError('comorbiditePsychiatriquePartenairePrecision')"
                    [required]="formData.comorbiditePsychiatriquePartenaire === true"
                    rows="3"
                  ></textarea>
                  <div *ngIf="hasError('comorbiditePsychiatriquePartenairePrecision')" class="form-error">
                    {{ getError('comorbiditePsychiatriquePartenairePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Comorbidités somatiques des partenaires -->
            <div class="form-section">
              <h3 class="section-title">Comorbidités somatiques des partenaires</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Comorbidités somatiques des partenaires</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditeSomatiquePartenaire" 
                        [value]="true"
                        [(ngModel)]="formData.comorbiditeSomatiquePartenaire"
                      >
                      <span>Oui</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        name="comorbiditeSomatiquePartenaire" 
                        [value]="false"
                        [(ngModel)]="formData.comorbiditeSomatiquePartenaire"
                      >
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row" *ngIf="formData.comorbiditeSomatiquePartenaire === true">
                <div class="form-group">
                  <label class="form-label required">Si oui, préciser</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="formData.comorbiditeSomatiquePartenairePrecision"
                    name="comorbiditeSomatiquePartenairePrecision"
                    [class.error]="hasError('comorbiditeSomatiquePartenairePrecision')"
                    [required]="formData.comorbiditeSomatiquePartenaire === true"
                    rows="3"
                  ></textarea>
                  <div *ngIf="hasError('comorbiditeSomatiquePartenairePrecision')" class="form-error">
                    {{ getError('comorbiditeSomatiquePartenairePrecision') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Antécédents pénitentiaires -->
            <div class="form-section">
              <h3 class="section-title">Antécédents pénitentiaires</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre de condamnations</label>
                  <input 
                    type="number"
                    class="form-input"
                    [(ngModel)]="formData.nombreCondamnations"
                    name="nombreCondamnations"
                    min="0"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">La durée de détention</label>
                  <div class="duration-inputs">
                    <div class="duration-item">
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.dureeDetentionJours"
                        name="dureeDetentionJours"
                        min="0"
                        placeholder="0"
                      >
                      <span class="duration-label">jours</span>
                    </div>
                    <div class="duration-item">
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.dureeDetentionMois"
                        name="dureeDetentionMois"
                        min="0"
                        placeholder="0"
                      >
                      <span class="duration-label">mois</span>
                    </div>
                    <div class="duration-item">
                      <input 
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.dureeDetentionAnnees"
                        name="dureeDetentionAnnees"
                        min="0"
                        placeholder="0"
                      >
                      <span class="duration-label">années</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 6: Décès induit par les SPA dans l'entourage -->
          <div *ngIf="currentStep === 6" class="step-content">
            <h2 class="step-heading">Décès induit par les SPA dans l'entourage</h2>
            
            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre de décès induit par les SPA dans l'entourage</label>
                  <input 
                    type="number"
                    class="form-input"
                    [(ngModel)]="formData.nombreDecesSpaDansEntourage"
                    name="nombreDecesSpaDansEntourage"
                    min="0"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Causes</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="formData.causesDecesSpaDansEntourage"
                    name="causesDecesSpaDansEntourage"
                    rows="5"
                    placeholder="Décrire les causes des décès..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Résumé du formulaire -->
            <div class="form-section">
              <h3 class="section-title">Résumé du formulaire</h3>
              
              <div class="summary-card">
                <div class="summary-section">
                  <h4>Informations patient</h4>
                  <p><strong>Nom :</strong> {{ formData.nom }} {{ formData.prenom }}</p>
                  <p><strong>Code patient :</strong> {{ formData.codePatient }}</p>
                  <p><strong>Genre :</strong> {{ formData.genre }}</p>
                  <p><strong>Date de naissance :</strong> {{ formData.dateNaissance | date:'dd/MM/yyyy' }}</p>
                </div>

                <div class="summary-section">
                  <h4>Structure</h4>
                  <p><strong>Secteur :</strong> {{ formData.secteur }}</p>
                  <p><strong>Structure :</strong> {{ formData.structure }}</p>
                  <p><strong>Gouvernorat :</strong> {{ formData.gouvernoratStructure }}</p>
                </div>

                <div class="summary-section">
                  <h4>Consommation</h4>
                  <p><strong>Tabac :</strong> {{ formData.consommationTabac }}</p>
                  <p><strong>Alcool :</strong> {{ formData.consommationAlcool ? 'Oui' : 'Non' }}</p>
                  <p><strong>SPA :</strong> {{ formData.consommationSpaPersonnelle ? 'Oui' : 'Non' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="form-navigation">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="previousStep()"
              [disabled]="currentStep === 1"
            >
              ← Précédent
            </button>

            <div class="step-indicator">
              Étape {{ currentStep }} sur {{ totalSteps }}
            </div>

            <button 
              type="button" 
              class="btn btn-primary"
              (click)="nextStep()"
              [disabled]="currentStep === totalSteps"
              *ngIf="currentStep < totalSteps"
            >
              Suivant →
            </button>

            <button 
              type="button" 
              class="btn btn-primary"
              (click)="submitForm()"
              [disabled]="!isFormValid()"
              *ngIf="currentStep === totalSteps"
            >
              Enregistrer le formulaire
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .formulaire-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-6);
    }

    .formulaire-header {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
      margin-bottom: var(--spacing-6);
      box-shadow: var(--shadow-sm);
    }

    .header-content {
      text-align: center;
      margin-bottom: var(--spacing-6);
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

    .steps-nav {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--spacing-4);
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-align: center;
    }

    .step-item:hover {
      background-color: var(--gray-50);
    }

    .step-item.active {
      background-color: var(--primary-50);
      border: 2px solid var(--primary-500);
    }

    .step-item.completed {
      background-color: var(--success-50);
      border: 2px solid var(--success-500);
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      background-color: var(--gray-200);
      color: var(--gray-600);
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

    .formulaire-content {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .formulaire-form {
      padding: var(--spacing-8);
    }

    .step-content {
      min-height: 600px;
    }

    .step-heading {
      font-size: 24px;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-8) 0;
      padding-bottom: var(--spacing-4);
      border-bottom: 2px solid var(--primary-500);
    }

    .form-section {
      margin-bottom: var(--spacing-8);
      padding: var(--spacing-6);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background-color: var(--gray-50);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-6) 0;
      padding-bottom: var(--spacing-3);
      border-bottom: 1px solid var(--gray-300);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-6);
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .radio-group {
      display: flex;
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .radio-group.vertical {
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .radio-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      cursor: pointer;
      font-size: 14px;
    }

    .radio-item input[type="radio"] {
      margin: 0;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-3);
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-2);
      cursor: pointer;
      font-size: 14px;
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease-in-out;
    }

    .checkbox-item:hover {
      background-color: var(--gray-100);
    }

    .checkbox-item input[type="checkbox"] {
      margin: 0;
      margin-top: 2px;
    }

    .tests-table {
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .test-header {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr;
      background-color: var(--gray-100);
      font-weight: 600;
      font-size: 14px;
    }

    .test-header > div {
      padding: var(--spacing-4);
      border-right: 1px solid var(--gray-300);
    }

    .test-header > div:last-child {
      border-right: none;
    }

    .test-row {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr;
      border-top: 1px solid var(--gray-200);
    }

    .test-row > div {
      padding: var(--spacing-4);
      border-right: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
    }

    .test-row > div:last-child {
      border-right: none;
    }

    .test-name {
      font-weight: 500;
    }

    .duration-inputs {
      display: flex;
      gap: var(--spacing-4);
      align-items: center;
    }

    .duration-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .duration-item input {
      width: 80px;
    }

    .duration-label {
      font-size: 14px;
      color: var(--gray-600);
    }

    .summary-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: var(--spacing-6);
    }

    .summary-section {
      margin-bottom: var(--spacing-6);
    }

    .summary-section:last-child {
      margin-bottom: 0;
    }

    .summary-section h4 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-3) 0;
      padding-bottom: var(--spacing-2);
      border-bottom: 1px solid var(--gray-200);
    }

    .summary-section p {
      margin: var(--spacing-2) 0;
      font-size: 14px;
      color: var(--gray-700);
    }

    .form-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-6);
      border-top: 1px solid var(--gray-200);
      background-color: var(--gray-50);
    }

    .step-indicator {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-600);
    }

    @media (max-width: 768px) {
      .formulaire-container {
        padding: var(--spacing-4);
      }

      .steps-nav {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-2);
      }

      .step-title {
        font-size: 10px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-4);
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .test-header,
      .test-row {
        grid-template-columns: 1fr;
      }

      .test-header > div,
      .test-row > div {
        border-right: none;
        border-bottom: 1px solid var(--gray-200);
      }

      .duration-inputs {
        flex-direction: column;
        align-items: stretch;
      }

      .form-navigation {
        flex-direction: column;
        gap: var(--spacing-4);
      }
    }
  `]
})
export class FormulaireComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;
  
  gouvernorats: Gouvernorat[] = [];
  structures: Structure[] = [];
  
  validationErrors: ValidationError[] = [];

  steps: FormulaireStep[] = [
    { id: 1, title: 'Informations structure & usager', isValid: false, isCompleted: false },
    { id: 2, title: 'Tabac & alcool', isValid: false, isCompleted: false },
    { id: 3, title: 'Substances psychoactives', isValid: false, isCompleted: false },
    { id: 4, title: 'Comportements & tests', isValid: false, isCompleted: false },
    { id: 5, title: 'Comorbidités', isValid: false, isCompleted: false },
    { id: 6, title: 'Décès SPA entourage', isValid: false, isCompleted: false }
  ];

  formData: FormulaireData = this.initializeFormData();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGouvernorats();
    this.loadStructures();
    this.initializeUserData();
  }

  private initializeFormData(): FormulaireData {
    return {
      secteur: 'PUBLIC',
      structure: '',
      gouvernoratStructure: '',
      nom: '',
      prenom: '',
      codePatient: '',
      dateConsultation: new Date(),
      genre: 'HOMME',
      dateNaissance: new Date(),
      nationalite: '',
      residence: 'TUNISIE',
      
      cadreConsultation: {},
      origineDemande: {},
      consultationAnterieure: null,
      situationFamiliale: 'CELIBATAIRE',
      logement30Jours: 'SEUL',
      natureLogement: 'STABLE',
      profession: 'EMPLOYE',
      niveauScolaire: 'ANALPHABETE',
      activiteSportive: null,
      
      consommationTabac: 'NON_FUMEUR',
      consommationAlcool: false,
      typeAlcool: {},
      
      consommationSpaEntourage: null,
      entourageSpa: {},
      typeSpaEntourage: {},
      consommationSpaPersonnelle: null,
      droguesActuelles: {},
      substanceInitiation: {},
      substancePrincipale: {},
      
      troublesAlimentaires: null,
      addictionJeux: null,
      addictionEcrans: null,
      comportementsSexuels: null,

      voieAdministration: {},
      testVih: {},
      testVhc: {},
      testVhb: {},
      testSyphilis: {},
      tentativeSevrageDetails: {}
    };
  }

  private loadGouvernorats(): void {
    this.userService.getGouvernorats().subscribe({
      next: (gouvernorats) => {
        this.gouvernorats = gouvernorats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des gouvernorats:', error);
      }
    });
  }

  private loadStructures(): void {
    this.userService.getStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des structures:', error);
      }
    });
  }

  private initializeUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.structure) {
      this.formData.gouvernoratStructure = currentUser.structure.gouvernorat?.nom || '';
    }
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.steps[this.currentStep - 1].isValid = true;
      this.steps[this.currentStep - 1].isCompleted = true;
      
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(stepId: number): void {
    // Permettre la navigation uniquement vers les étapes précédentes ou la suivante
    if (stepId <= this.currentStep + 1 && stepId >= 1) {
      this.currentStep = stepId;
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  private validateCurrentStep(): boolean {
    this.validationErrors = [];
    
    switch (this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return this.validateStep3();
      case 4:
        return this.validateStep4();
      case 5:
        return this.validateStep5();
      case 6:
        return this.validateStep6();
      default:
        return true;
    }
  }

  private validateStep1(): boolean {
    let isValid = true;

    if (!this.formData.secteur) {
      this.addError('secteur', 'Le secteur est requis');
      isValid = false;
    }

    if (this.formData.secteur === 'ONG' && !this.formData.ongPrecision) {
      this.addError('ongPrecision', 'Veuillez préciser l\'ONG');
      isValid = false;
    }

    if (!this.formData.ministere) {
      this.addError('ministere', 'Le ministère est requis');
      isValid = false;
    }

    if (!this.formData.structure) {
      this.addError('structure', 'La structure est requise');
      isValid = false;
    }

    if (!this.formData.gouvernoratStructure) {
      this.addError('gouvernoratStructure', 'Le gouvernorat de la structure est requis');
      isValid = false;
    }

    if (!this.formData.nom) {
      this.addError('nom', 'Le nom est requis');
      isValid = false;
    }

    if (!this.formData.prenom) {
      this.addError('prenom', 'Le prénom est requis');
      isValid = false;
    }

    if (!this.formData.codePatient) {
      this.addError('codePatient', 'Le code patient est requis');
      isValid = false;
    }

    if (!this.formData.dateConsultation) {
      this.addError('dateConsultation', 'La date de consultation est requise');
      isValid = false;
    }

    if (!this.formData.genre) {
      this.addError('genre', 'Le genre est requis');
      isValid = false;
    }

    if (!this.formData.dateNaissance) {
      this.addError('dateNaissance', 'La date de naissance est requise');
      isValid = false;
    }

    if (!this.formData.nationalite) {
      this.addError('nationalite', 'La nationalité est requise');
      isValid = false;
    }

    if (!this.formData.residence) {
      this.addError('residence', 'La résidence est requise');
      isValid = false;
    }

    if (this.formData.residence === 'TUNISIE') {
      if (!this.formData.gouvernoratResidence) {
        this.addError('gouvernoratResidence', 'Le gouvernorat de résidence est requis');
        isValid = false;
      }
      if (!this.formData.delegationResidence) {
        this.addError('delegationResidence', 'La délégation de résidence est requise');
        isValid = false;
      }
    }

    if (this.formData.residence === 'ETRANGER' && !this.formData.paysResidence) {
      this.addError('paysResidence', 'Le pays de résidence est requis');
      isValid = false;
    }

    if (this.formData.consultationAnterieure === null) {
      this.addError('consultationAnterieure', 'Veuillez indiquer s\'il y a eu une consultation antérieure');
      isValid = false;
    }

    if (!this.formData.situationFamiliale) {
      this.addError('situationFamiliale', 'La situation familiale est requise');
      isValid = false;
    }

    if (!this.formData.logement30Jours) {
      this.addError('logement30Jours', 'Le logement durant les 30 derniers jours est requis');
      isValid = false;
    }

    if (!this.formData.natureLogement) {
      this.addError('natureLogement', 'La nature du logement est requise');
      isValid = false;
    }

    if (!this.formData.profession) {
      this.addError('profession', 'La profession est requise');
      isValid = false;
    }

    if (!this.formData.niveauScolaire) {
      this.addError('niveauScolaire', 'Le niveau scolaire est requis');
      isValid = false;
    }

    if (this.formData.activiteSportive === null) {
      this.addError('activiteSportive', 'Veuillez indiquer si vous pratiquez une activité sportive');
      isValid = false;
    }

    return isValid;
  }

  private validateStep2(): boolean {
    let isValid = true;

    if (!this.formData.consommationTabac) {
      this.addError('consommationTabac', 'La consommation de tabac est requise');
      isValid = false;
    }

    if (this.formData.consommationAlcool === null) {
      this.addError('consommationAlcool', 'Veuillez indiquer la consommation d\'alcool');
      isValid = false;
    }

    return isValid;
  }

  private validateStep3(): boolean {
    let isValid = true;

    if (this.formData.consommationSpaEntourage === null) {
      this.addError('consommationSpaEntourage', 'Veuillez indiquer s\'il y a consommation de SPA dans l\'entourage');
      isValid = false;
    }

    if (this.formData.consommationSpaPersonnelle === null) {
      this.addError('consommationSpaPersonnelle', 'Veuillez indiquer votre consommation personnelle de SPA');
      isValid = false;
    }

    if (this.formData.troublesAlimentaires === null) {
      this.addError('troublesAlimentaires', 'Veuillez indiquer s\'il y a des troubles alimentaires');
      isValid = false;
    }

    if (this.formData.addictionJeux === null) {
      this.addError('addictionJeux', 'Veuillez indiquer s\'il y a addiction aux jeux');
      isValid = false;
    }

    if (this.formData.addictionEcrans === null) {
      this.addError('addictionEcrans', 'Veuillez indiquer s\'il y a addiction aux écrans');
      isValid = false;
    }

    if (this.formData.comportementsSexuels === null) {
      this.addError('comportementsSexuels', 'Veuillez indiquer s\'il y a des comportements sexuels addictifs');
      isValid = false;
    }

    return isValid;
  }

  private validateStep4(): boolean {
    // Validation optionnelle pour l'étape 4
    return true;
  }

  private validateStep5(): boolean {
    // Validation optionnelle pour l'étape 5
    return true;
  }

  private validateStep6(): boolean {
    // Validation optionnelle pour l'étape 6
    return true;
  }

  private addError(field: string, message: string): void {
    this.validationErrors.push({ field, message });
  }

  hasError(field: string): boolean {
    return this.validationErrors.some(error => error.field === field);
  }

  getError(field: string): string {
    const error = this.validationErrors.find(error => error.field === field);
    return error ? error.message : '';
  }

  isFormValid(): boolean {
    return this.steps.every(step => step.isValid);
  }

  submitForm(): void {
    if (this.validateCurrentStep() && this.isFormValid()) {
      // Générer l'IUN automatiquement
      this.formData.iun = this.generateIUN();
      
      console.log('Formulaire soumis:', this.formData);
      
      // Ici, vous pouvez envoyer les données au service
      // this.formulaireService.saveFormulaire(this.formData).subscribe(...)
      
      alert('Formulaire enregistré avec succès!\nIUN généré: ' + this.formData.iun);
      this.router.navigate(['/mes-formulaires']);
    }
  }

  private generateIUN(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `IUN${year}${month}${day}${random}`;
  }
}
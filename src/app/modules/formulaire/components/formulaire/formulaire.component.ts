import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { FormulaireData, FormulaireStep, ValidationError } from '../../models/formulaire.model';
import { User, Structure, Gouvernorat } from '../../../../models/user.model';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="formulaire-container">
      <!-- En-tête avec progression -->
      <div class="formulaire-header card">
        <div class="card-body">
          <h1 class="page-title">Nouveau formulaire SIDRA</h1>
          <p class="page-description">
            Saisie des données d'un usager de substances psychoactives
          </p>
          
          <!-- Barre de progression -->
          <div class="progress-bar">
            <div class="progress-steps">
              <div 
                *ngFor="let step of steps; let i = index"
                class="progress-step"
                [class.active]="currentStep === step.id"
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
            <div class="progress-line">
              <div 
                class="progress-fill" 
                [style.width.%]="(currentStep - 1) * 20"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu du formulaire -->
      <div class="formulaire-content">
        <form #formulaireForm="ngForm" class="formulaire-form">
          
          <!-- Étape 1: Informations structure/centre & usager SPA -->
          <div class="step-content card" *ngIf="currentStep === 1">
            <div class="card-header">
              <h3 class="step-title">
                Étape 1: Informations sur la structure/centre de prise en charge & l'usager de SPA
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <!-- IUN (généré automatiquement) -->
                <div class="form-group full-width">
                  <label class="form-label">IUN (Identifiant Unique National)</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.iun"
                    name="iun"
                    placeholder="Généré automatiquement"
                    readonly
                  >
                  <div class="form-help">Réservé à l'INSP, généré automatiquement par la plateforme</div>
                </div>

                <!-- Secteur -->
                <div class="form-group">
                  <label class="form-label required">Secteur</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="formData.secteur" 
                    name="secteur" 
                    required
                    (change)="onSecteurChange()"
                  >
                    <option value="">Sélectionner un secteur</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVE">Privé</option>
                    <option value="ONG">Société civile (ONG)</option>
                  </select>
                </div>

                <!-- Précision ONG -->
                <div class="form-group" *ngIf="formData.secteur === 'ONG'">
                  <label class="form-label required">Préciser l'ONG</label>
                  <select class="form-select" [(ngModel)]="formData.ongPrecision" name="ongPrecision" required>
                    <option value="">Sélectionner une ONG</option>
                    <option value="ATIOST">ATIOST</option>
                    <option value="ATL_TUNIS">ATL Tunis</option>
                    <option value="ATL_SFAX">ATL Sfax</option>
                    <option value="ATUPRET">ATUPRET</option>
                    <option value="ATP_PLUS">ATP+</option>
                    <option value="ATSR">ATSR</option>
                    <option value="STADD">STADD</option>
                  </select>
                </div>

                <!-- Ministère -->
                <div class="form-group" *ngIf="formData.secteur === 'PUBLIC'">
                  <label class="form-label required">Ministère</label>
                  <select class="form-select" [(ngModel)]="formData.ministere" name="ministere" required>
                    <option value="">Sélectionner un ministère</option>
                    <option value="SANTE">Ministère de la Santé</option>
                    <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                    <option value="EDUCATION">Ministère de l'Éducation</option>
                    <option value="JUSTICE">Ministère de la Justice</option>
                  </select>
                </div>

                <!-- Structure/Centre -->
                <div class="form-group full-width">
                  <label class="form-label required">Structure / Centre</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.structure"
                    name="structure"
                    placeholder="Nom de la structure"
                    required
                  >
                </div>

                <!-- Gouvernorat de la structure -->
                <div class="form-group">
                  <label class="form-label required">Gouvernorat de la Structure/Centre</label>
                  <select class="form-select" [(ngModel)]="formData.gouvernoratStructure" name="gouvernoratStructure" required>
                    <option value="">Sélectionner un gouvernorat</option>
                    <option *ngFor="let gov of gouvernorats" [value]="gov.nom">{{ gov.nom }}</option>
                  </select>
                </div>

                <!-- Informations patient -->
                <div class="form-section-title full-width">
                  <h4>Informations sur l'usager</h4>
                </div>

                <div class="form-group">
                  <label class="form-label required">Nom</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nom"
                    name="nom"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">Prénom</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.prenom"
                    name="prenom"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">Code du patient</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.codePatient"
                    name="codePatient"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">Date de la consultation/entretien</label>
                  <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="formData.dateConsultation"
                    name="dateConsultation"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">Genre</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.genre" name="genre" value="HOMME" required>
                      <span>Homme</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.genre" name="genre" value="FEMME" required>
                      <span>Femme</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Date de naissance</label>
                  <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="formData.dateNaissance"
                    name="dateNaissance"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">Nationalité</label>
                  <select class="form-select" [(ngModel)]="formData.nationalite" name="nationalite" required>
                    <option value="">Sélectionner une nationalité</option>
                    <option value="TUNISIENNE">Tunisienne</option>
                    <option value="ALGERIENNE">Algérienne</option>
                    <option value="MAROCAINE">Marocaine</option>
                    <option value="LIBYENNE">Libyenne</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label required">Résidence</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.residence" name="residence" value="TUNISIE" required (change)="onResidenceChange()">
                      <span>En Tunisie</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.residence" name="residence" value="ETRANGER" required (change)="onResidenceChange()">
                      <span>À l'étranger</span>
                    </label>
                  </div>
                </div>

                <!-- Gouvernorat de résidence (si Tunisie) -->
                <div class="form-group" *ngIf="formData.residence === 'TUNISIE'">
                  <label class="form-label required">Gouvernorat de résidence</label>
                  <select class="form-select" [(ngModel)]="formData.gouvernoratResidence" name="gouvernoratResidence" required>
                    <option value="">Sélectionner un gouvernorat</option>
                    <option *ngFor="let gov of gouvernorats" [value]="gov.nom">{{ gov.nom }}</option>
                  </select>
                </div>

                <!-- Délégation (si Tunisie) -->
                <div class="form-group" *ngIf="formData.residence === 'TUNISIE'">
                  <label class="form-label required">Délégation</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.delegationResidence"
                    name="delegationResidence"
                    placeholder="Délégation"
                    required
                  >
                </div>

                <!-- Pays (si étranger) -->
                <div class="form-group" *ngIf="formData.residence === 'ETRANGER'">
                  <label class="form-label required">Pays</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.paysResidence"
                    name="paysResidence"
                    placeholder="Pays de résidence"
                    required
                  >
                </div>

                <!-- Cadre de consultation -->
                <div class="form-section-title full-width">
                  <h4>Cadre de la consultation/entretien</h4>
                </div>

                <div class="form-group full-width">
                  <div class="checkbox-grid">
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.addictologie" name="cadreAddictologie" (change)="onAddictologieChange()">
                      <span>Consultation d'addictologie</span>
                    </label>
                    
                    <!-- Sous-options addictologie -->
                    <div class="sub-options" *ngIf="formData.cadreConsultation.addictologie">
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.cadreConsultation.addictologieType" name="addictologieType" value="SEVRAGE" required>
                        <span>Demande de sevrage</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.cadreConsultation.addictologieType" name="addictologieType" value="GESTION_ADDICTION" required>
                        <span>Gestion d'une addiction sans substances ou autre</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.cadreConsultation.addictologieType" name="addictologieType" value="RISQUE_RECHUTE" required>
                        <span>Risque de glissement ou de rechute</span>
                      </label>
                    </div>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.psychiatrie" name="cadrePsychiatrie">
                      <span>Psychiatrie (troubles mentaux)</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.psychologique" name="cadrePsychologique">
                      <span>Consultation psychologique</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.medecineGenerale" name="cadreMedecineGenerale">
                      <span>Médecine générale, médecine interne</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.neurologique" name="cadreNeurologique">
                      <span>Troubles neurologiques</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.infectieux" name="cadreInfectieux">
                      <span>Problèmes infectieux</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.espaceAmisJeunes" name="cadreEspaceAmisJeunes">
                      <span>Espace amis des jeunes</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.echangeMateriel" name="cadreEchangeMateriel">
                      <span>Échange/approvisionnement de matériels à usage unique</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.rehabilitation" name="cadreRehabilitation">
                      <span>Réhabilitation</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.urgenceMedicale" name="cadreUrgenceMedicale">
                      <span>Urgence médicale</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.urgenceChirurgicale" name="cadreUrgenceChirurgicale">
                      <span>Urgence chirurgicale</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.depistage" name="cadreDepistage">
                      <span>Dépistage</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.cadreConsultation.autre" name="cadreAutre" (change)="onCadreAutreChange()">
                      <span>Autre</span>
                    </label>
                  </div>

                  <!-- Précision autre cadre -->
                  <div class="form-group" *ngIf="formData.cadreConsultation.autre">
                    <label class="form-label required">Préciser</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.cadreConsultation.autrePrecision"
                      name="cadreAutrePrecision"
                      placeholder="Préciser le cadre de consultation"
                      required
                    >
                  </div>
                </div>

                <!-- Origine de la demande -->
                <div class="form-section-title full-width">
                  <h4>Origine de la demande</h4>
                </div>

                <div class="form-group full-width">
                  <div class="checkbox-grid">
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.luiMeme" name="origineLuiMeme">
                      <span>Lui-même</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.famille" name="origineFamille">
                      <span>Famille</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.amis" name="origineAmis">
                      <span>Amis</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.celluleEcoute" name="origineCelluleEcoute">
                      <span>Cellule d'écoute de médecine scolaire et universitaire</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.autreCentre" name="origineAutreCentre">
                      <span>Adressé par un autre centre</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.structureSociale" name="origineStructureSociale">
                      <span>Structure sociale</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.structureJudiciaire" name="origineStructureJudiciaire">
                      <span>Structure judiciaire</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.jugeEnfance" name="origineJugeEnfance">
                      <span>Le juge de l'enfance</span>
                    </label>

                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.origineDemande.autre" name="origineAutre" (change)="onOrigineAutreChange()">
                      <span>Autre</span>
                    </label>
                  </div>

                  <!-- Précision autre origine -->
                  <div class="form-group" *ngIf="formData.origineDemande.autre">
                    <label class="form-label required">Préciser</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.origineDemande.autrePrecision"
                      name="origineAutrePrecision"
                      placeholder="Préciser l'origine de la demande"
                      required
                    >
                  </div>
                </div>

                <!-- Cause ou circonstance -->
                <div class="form-group full-width">
                  <label class="form-label">La cause ou circonstance de l'abus</label>
                  <select class="form-select" [(ngModel)]="formData.causeCirconstance" name="causeCirconstance">
                    <option value="">Sélectionner une cause</option>
                    <option value="PROBLEME_SOCIAL">Problème social</option>
                    <option value="PROBLEME_FINANCIER">Problème financier</option>
                    <option value="PROBLEME_FAMILIAL">Problème familial</option>
                    <option value="PROBLEME_SANTE_MENTALE">Problème de santé mentale</option>
                    <option value="ADOLESCENCE">Adolescence</option>
                  </select>
                </div>

                <!-- Consultation antérieure -->
                <div class="form-group">
                  <label class="form-label required">Consultation antérieure</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consultationAnterieure" name="consultationAnterieure" [value]="true" required (change)="onConsultationAnterieureChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consultationAnterieure" name="consultationAnterieure" [value]="false" required (change)="onConsultationAnterieureChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails consultation antérieure -->
                <div class="consultation-anterieure-details" *ngIf="formData.consultationAnterieure === true">
                  <div class="form-group">
                    <label class="form-label required">Date de la consultation antérieure</label>
                    <input
                      type="month"
                      class="form-input"
                      [(ngModel)]="formData.dateConsultationAnterieure"
                      name="dateConsultationAnterieure"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Motif de la consultation antérieure</label>
                    <select class="form-select" [(ngModel)]="formData.motifConsultationAnterieure" name="motifConsultationAnterieure" required (change)="onMotifConsultationChange()">
                      <option value="">Sélectionner un motif</option>
                      <option value="OVERDOSE">Overdose</option>
                      <option value="TENTATIVE_SUICIDE">Tentative de suicide</option>
                      <option value="SEVRAGE">Sevrage</option>
                      <option value="TROUBLES_MENTAUX">Troubles mentaux</option>
                      <option value="RECIDIVES">Récidives</option>
                      <option value="ECHEC_SCOLAIRE">Échec scolaire</option>
                      <option value="TROUBLE_COMPORTEMENT">Trouble de comportement</option>
                      <option value="VIOLENCE">Violence</option>
                      <option value="AUTRES">Autres</option>
                    </select>
                  </div>

                  <!-- Cause de récidive -->
                  <div class="form-group" *ngIf="formData.motifConsultationAnterieure === 'RECIDIVES'">
                    <label class="form-label required">Cause de récidive</label>
                    <textarea
                      class="form-input"
                      [(ngModel)]="formData.causeRecidive"
                      name="causeRecidive"
                      rows="3"
                      placeholder="Problème de soutien familial, scolaire, entourage, problème social non résolu, mauvaise gestion des émotions, craving, influence des pairs, chômage..."
                      required
                    ></textarea>
                  </div>

                  <!-- Cause échec sevrage -->
                  <div class="form-group" *ngIf="formData.motifConsultationAnterieure === 'SEVRAGE'">
                    <label class="form-label required">Cause de l'échec de sevrage</label>
                    <textarea
                      class="form-input"
                      [(ngModel)]="formData.causeEchecSevrage"
                      name="causeEchecSevrage"
                      rows="3"
                      placeholder="Non-observance du traitement, suivi interrompu, non convaincu de l'approche thérapeutique, séjour interrompu, maladie mentale sous-jacente..."
                      required
                    ></textarea>
                  </div>
                </div>

                <!-- Situation familiale -->
                <div class="form-group">
                  <label class="form-label required">Situation familiale</label>
                  <select class="form-select" [(ngModel)]="formData.situationFamiliale" name="situationFamiliale" required (change)="onSituationFamilialeChange()">
                    <option value="">Sélectionner une situation</option>
                    <option value="CELIBATAIRE">Célibataire</option>
                    <option value="MARIE">Marié(e)</option>
                    <option value="DIVORCE">Divorcé(e)</option>
                    <option value="SEPARE">Séparé(e)</option>
                    <option value="VEUF">Veuf(ve)</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                <!-- Précision situation familiale -->
                <div class="form-group" *ngIf="formData.situationFamiliale === 'AUTRE'">
                  <label class="form-label required">Préciser</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.situationFamilialeAutre"
                    name="situationFamilialeAutre"
                    placeholder="Préciser la situation familiale"
                    required
                  >
                </div>

                <!-- Logement 30 derniers jours -->
                <div class="form-group">
                  <label class="form-label required">Durant les 30 derniers jours, le patient vivait principalement</label>
                  <select class="form-select" [(ngModel)]="formData.logement30Jours" name="logement30Jours" required (change)="onLogement30JoursChange()">
                    <option value="">Sélectionner un type de logement</option>
                    <option value="SEUL">Seul(e)</option>
                    <option value="FAMILLE_ORIGINE">Avec sa famille d'origine (parents, etc.)</option>
                    <option value="PARTENAIRE">Avec son partenaire</option>
                    <option value="ENFANTS">Avec ses enfants</option>
                    <option value="AMIS">Avec des amis ou d'autres personnes (sans relation familiale)</option>
                    <option value="INTERNAT">Dans un internat</option>
                    <option value="COLOCATION">En colocation</option>
                    <option value="FOYER">Dans un foyer universitaire ou scolaire</option>
                    <option value="DETENTION">En détention</option>
                    <option value="CENTRE_JEUNESSE">Dans un centre intégré de la jeunesse</option>
                    <option value="INSTITUTION">En institution/refuge (pas de détention)</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                <!-- Précision logement -->
                <div class="form-group" *ngIf="formData.logement30Jours === 'AUTRE'">
                  <label class="form-label required">Préciser</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.logement30JoursAutre"
                    name="logement30JoursAutre"
                    placeholder="Préciser le type de logement"
                    required
                  >
                </div>

                <!-- Nature de logement -->
                <div class="form-group">
                  <label class="form-label required">Nature de logement</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.natureLogement" name="natureLogement" value="STABLE" required>
                      <span>Logement stable</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.natureLogement" name="natureLogement" value="PRECAIRE" required>
                      <span>Logement précaire/sans abri</span>
                    </label>
                  </div>
                </div>

                <!-- Profession -->
                <div class="form-group">
                  <label class="form-label required">Profession</label>
                  <select class="form-select" [(ngModel)]="formData.profession" name="profession" required>
                    <option value="">Sélectionner une profession</option>
                    <option value="EMPLOYE">Employé</option>
                    <option value="COMPTE_PROPRE">Travaille pour son propre compte</option>
                    <option value="JOURNALIER">Journalier/travail irrégulier</option>
                    <option value="SPORTIF">Sportif professionnel</option>
                    <option value="CHOMAGE">En chômage</option>
                    <option value="ELEVE">Élève</option>
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="FORMATION">En formation professionnelle</option>
                    <option value="RETRAITE">Retraité</option>
                    <option value="SANS_RESSOURCES">Sans ressources</option>
                  </select>
                </div>

                <!-- Niveau scolaire -->
                <div class="form-group">
                  <label class="form-label required">Niveau scolaire</label>
                  <select class="form-select" [(ngModel)]="formData.niveauScolaire" name="niveauScolaire" required>
                    <option value="">Sélectionner un niveau</option>
                    <option value="ANALPHABETE">Analphabète</option>
                    <option value="PRESCOLAIRE">Préscolaire</option>
                    <option value="PRIMAIRE">Primaire</option>
                    <option value="COLLEGE">Collège</option>
                    <option value="SECONDAIRE">Secondaire</option>
                    <option value="FORMATION_PROF">Formation professionnelle</option>
                    <option value="UNIVERSITAIRE">Universitaire</option>
                  </select>
                </div>

                <!-- Activité sportive -->
                <div class="form-group">
                  <label class="form-label required">Pratiquez-vous une activité sportive ?</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.activiteSportive" name="activiteSportive" [value]="true" required (change)="onActiviteSportiveChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.activiteSportive" name="activiteSportive" [value]="false" required (change)="onActiviteSportiveChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails activité sportive -->
                <div class="activite-sportive-details" *ngIf="formData.activiteSportive === true">
                  <div class="form-group">
                    <label class="form-label required">Fréquence de l'activité sportive</label>
                    <div class="radio-group">
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.activiteSportiveFrequence" name="activiteSportiveFrequence" value="REGULIERE" required>
                        <span>Régulière</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.activiteSportiveFrequence" name="activiteSportiveFrequence" value="IRREGULIERE" required>
                        <span>Irrégulière</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Type d'activité sportive</label>
                    <div class="radio-group">
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.activiteSportiveType" name="activiteSportiveType" value="COMPETITION" required (change)="onActiviteSportiveTypeChange()">
                        <span>De compétition</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.activiteSportiveType" name="activiteSportiveType" value="LOISIR" required (change)="onActiviteSportiveTypeChange()">
                        <span>De loisir</span>
                      </label>
                    </div>
                  </div>

                  <!-- Dopage (si compétition) -->
                  <div class="form-group" *ngIf="formData.activiteSportiveType === 'COMPETITION'">
                    <label class="form-label required">Dopage</label>
                    <div class="radio-group">
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.dopage" name="dopage" [value]="true" required>
                        <span>Oui</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.dopage" name="dopage" [value]="false" required>
                        <span>Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Espaces de loisirs -->
                <div class="form-group">
                  <label class="form-label">Espaces de loisirs dans le quartier ou la zone de vie</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.espacesLoisirs" name="espacesLoisirs" [value]="true">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.espacesLoisirs" name="espacesLoisirs" [value]="false">
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Consommation tabac & alcool -->
          <div class="step-content card" *ngIf="currentStep === 2">
            <div class="card-header">
              <h3 class="step-title">
                Étape 2: Consommation de tabac/produits tabagiques & alcool
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <!-- Consommation de tabac -->
                <div class="form-section-title full-width">
                  <h4>Consommation de tabac/produits nicotiniques</h4>
                </div>

                <div class="form-group">
                  <label class="form-label required">Statut tabagique</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationTabac" name="consommationTabac" value="FUMEUR" required (change)="onConsommationTabacChange()">
                      <span>Fumeur</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationTabac" name="consommationTabac" value="NON_FUMEUR" required (change)="onConsommationTabacChange()">
                      <span>Non-fumeur</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationTabac" name="consommationTabac" value="EX_FUMEUR" required (change)="onConsommationTabacChange()">
                      <span>Ex-fumeur</span>
                    </label>
                  </div>
                </div>

                <!-- Détails fumeur/ex-fumeur -->
                <div class="fumeur-details" *ngIf="formData.consommationTabac === 'FUMEUR' || formData.consommationTabac === 'EX_FUMEUR'">
                  <div class="form-group">
                    <label class="form-label required">Âge lors de la première consommation de tabac</label>
                    <input
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.agePremiereConsommationTabac"
                      name="agePremiereConsommationTabac"
                      min="1"
                      max="100"
                      required
                    >
                  </div>

                  <!-- Détails fumeur actuel -->
                  <div class="fumeur-actuel-details" *ngIf="formData.consommationTabac === 'FUMEUR'">
                    <div class="form-group">
                      <label class="form-label required">Consommation de tabac durant les 30 derniers jours</label>
                      <div class="radio-group">
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.consommationTabac30Jours" name="consommationTabac30Jours" [value]="true" required (change)="onConsommationTabac30JoursChange()">
                          <span>Oui</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.consommationTabac30Jours" name="consommationTabac30Jours" [value]="false" required (change)="onConsommationTabac30JoursChange()">
                          <span>Non</span>
                        </label>
                      </div>
                    </div>

                    <!-- Détails consommation 30 jours -->
                    <div class="consommation-30j-details" *ngIf="formData.consommationTabac30Jours === true">
                      <div class="form-group">
                        <label class="form-label required">Fréquence de consommation durant les 30 derniers jours</label>
                        <div class="radio-group">
                          <label class="radio-option">
                            <input type="radio" [(ngModel)]="formData.frequenceTabac30Jours" name="frequenceTabac30Jours" value="QUOTIDIEN" required>
                            <span>Quotidiennement</span>
                          </label>
                          <label class="radio-option">
                            <input type="radio" [(ngModel)]="formData.frequenceTabac30Jours" name="frequenceTabac30Jours" value="2_3_JOURS" required>
                            <span>2 à 3 jours par semaine</span>
                          </label>
                          <label class="radio-option">
                            <input type="radio" [(ngModel)]="formData.frequenceTabac30Jours" name="frequenceTabac30Jours" value="HEBDOMADAIRE" required>
                            <span>Une fois par semaine ou moins</span>
                          </label>
                          <label class="radio-option">
                            <input type="radio" [(ngModel)]="formData.frequenceTabac30Jours" name="frequenceTabac30Jours" value="OCCASIONNEL" required>
                            <span>Occasionnellement</span>
                          </label>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label required">Nombre de cigarettes/paquets par jour</label>
                        <input
                          type="number"
                          class="form-input"
                          [(ngModel)]="formData.nombreCigarettesJour"
                          name="nombreCigarettesJour"
                          min="0"
                          required
                        >
                      </div>

                      <div class="form-group">
                        <label class="form-label required">Nombre de paquets par année</label>
                        <input
                          type="number"
                          class="form-input"
                          [(ngModel)]="formData.nombrePaquetsAnnee"
                          name="nombrePaquetsAnnee"
                          min="0"
                          required
                        >
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">A-t-il demandé des soins de sevrage</label>
                      <div class="radio-group">
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.soinsSevrageTabac" name="soinsSevrageTabac" value="OUI_SATISFAIT">
                          <span>Oui, satisfait</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.soinsSevrageTabac" name="soinsSevrageTabac" value="OUI_NON_SATISFAIT">
                          <span>Oui, non satisfait</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.soinsSevrageTabac" name="soinsSevrageTabac" value="NON">
                          <span>Non</span>
                        </label>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">A-t-il fait un sevrage médicalement assisté ?</label>
                      <div class="radio-group">
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.sevrageAssiste" name="sevrageAssiste" [value]="true">
                          <span>Oui</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.sevrageAssiste" name="sevrageAssiste" [value]="false">
                          <span>Non</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Détails ex-fumeur -->
                  <div class="ex-fumeur-details" *ngIf="formData.consommationTabac === 'EX_FUMEUR'">
                    <div class="form-group">
                      <label class="form-label required">Âge de l'arrêt de la consommation de tabac</label>
                      <input
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.ageArretTabac"
                        name="ageArretTabac"
                        min="1"
                        max="100"
                        required
                      >
                    </div>
                  </div>
                </div>

                <!-- Consommation d'alcool -->
                <div class="form-section-title full-width">
                  <h4>Consommation d'alcool</h4>
                </div>

                <div class="form-group">
                  <label class="form-label required">Consommation d'alcool</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationAlcool" name="consommationAlcool" [value]="true" required (change)="onConsommationAlcoolChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationAlcool" name="consommationAlcool" [value]="false" required (change)="onConsommationAlcoolChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails consommation alcool -->
                <div class="alcool-details" *ngIf="formData.consommationAlcool === true">
                  <div class="form-group">
                    <label class="form-label required">Âge lors de la première consommation d'alcool</label>
                    <input
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.agePremiereConsommationAlcool"
                      name="agePremiereConsommationAlcool"
                      min="1"
                      max="100"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Consommation d'alcool durant les 30 derniers jours</label>
                    <div class="radio-group">
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.consommationAlcool30Jours" name="consommationAlcool30Jours" [value]="true" required (change)="onConsommationAlcool30JoursChange()">
                        <span>Oui</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" [(ngModel)]="formData.consommationAlcool30Jours" name="consommationAlcool30Jours" [value]="false" required (change)="onConsommationAlcool30JoursChange()">
                        <span>Non</span>
                      </label>
                    </div>
                  </div>

                  <!-- Détails consommation alcool 30 jours -->
                  <div class="alcool-30j-details" *ngIf="formData.consommationAlcool30Jours === true">
                    <div class="form-group">
                      <label class="form-label required">Fréquence de consommation durant les 30 derniers jours</label>
                      <div class="radio-group">
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.frequenceAlcool30Jours" name="frequenceAlcool30Jours" value="QUOTIDIEN" required>
                          <span>Quotidiennement</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.frequenceAlcool30Jours" name="frequenceAlcool30Jours" value="2_3_JOURS" required>
                          <span>2 à 3 jours par semaine</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.frequenceAlcool30Jours" name="frequenceAlcool30Jours" value="HEBDOMADAIRE" required>
                          <span>Une fois par semaine ou moins</span>
                        </label>
                        <label class="radio-option">
                          <input type="radio" [(ngModel)]="formData.frequenceAlcool30Jours" name="frequenceAlcool30Jours" value="OCCASIONNEL" required>
                          <span>Occasionnellement</span>
                        </label>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label required">Quantité d'alcool consommé (nombre de verres par prise)</label>
                      <input
                        type="number"
                        class="form-input"
                        [(ngModel)]="formData.quantiteAlcoolPrise"
                        name="quantiteAlcoolPrise"
                        min="0"
                        required
                      >
                    </div>

                    <div class="form-group full-width">
                      <label class="form-label required">Type d'alcool consommé</label>
                      <div class="checkbox-grid">
                        <label class="checkbox-option">
                          <input type="checkbox" [(ngModel)]="formData.typeAlcool.biere" name="typeAlcoolBiere">
                          <span>Bière</span>
                        </label>
                        <label class="checkbox-option">
                          <input type="checkbox" [(ngModel)]="formData.typeAlcool.liqueurs" name="typeAlcoolLiqueurs">
                          <span>Liqueurs</span>
                        </label>
                        <label class="checkbox-option">
                          <input type="checkbox" [(ngModel)]="formData.typeAlcool.alcoolBruler" name="typeAlcoolBruler">
                          <span>Alcool à brûler</span>
                        </label>
                        <label class="checkbox-option">
                          <input type="checkbox" [(ngModel)]="formData.typeAlcool.legmi" name="typeAlcoolLegmi">
                          <span>Legmi</span>
                        </label>
                        <label class="checkbox-option">
                          <input type="checkbox" [(ngModel)]="formData.typeAlcool.boukha" name="typeAlcoolBoukha">
                          <span>Boukha</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Consommation SPA -->
          <div class="step-content card" *ngIf="currentStep === 3">
            <div class="card-header">
              <h3 class="step-title">
                Étape 3: Consommation de substances psychoactives (hors tabac et alcool) et autres comportements addictifs
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <!-- Consommation SPA dans l'entourage -->
                <div class="form-group">
                  <label class="form-label required">Consommation de SPA dans l'entourage</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationSpaEntourage" name="consommationSpaEntourage" [value]="true" required (change)="onConsommationSpaEntourageChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationSpaEntourage" name="consommationSpaEntourage" [value]="false" required (change)="onConsommationSpaEntourageChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails entourage SPA -->
                <div class="entourage-spa-details" *ngIf="formData.consommationSpaEntourage === true">
                  <div class="form-section-title full-width">
                    <h4>Entourage consommateur de SPA</h4>
                  </div>

                  <div class="form-group full-width">
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.membresFamille" name="entourageMembresFamille">
                        <span>Membre(s) de la famille</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.amis" name="entourageAmis">
                        <span>Ami(e)s</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.milieuProfessionnel" name="entourageMilieuProfessionnel">
                        <span>Milieu professionnel</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.milieuSportif" name="entourageMilieuSportif">
                        <span>Milieu sportif</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.milieuScolaire" name="entourageMilieuScolaire">
                        <span>Milieu scolaire et universitaire</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.entourageSpa.autre" name="entourageAutre" (change)="onEntourageAutreChange()">
                        <span>Autre</span>
                      </label>
                    </div>

                    <!-- Précision autre entourage -->
                    <div class="form-group" *ngIf="formData.entourageSpa.autre">
                      <label class="form-label required">Préciser</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.entourageSpa.autrePrecision"
                        name="entourageAutrePrecision"
                        placeholder="Préciser l'entourage"
                        required
                      >
                    </div>
                  </div>

                  <!-- Types de SPA dans l'entourage -->
                  <div class="form-section-title full-width">
                    <h4>Types de SPA consommées dans l'entourage</h4>
                  </div>

                  <div class="form-group full-width">
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.tabac" name="typeSpaEntourageTabac">
                        <span>Tabac</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.alcool" name="typeSpaEntourageAlcool">
                        <span>Alcool</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.cannabis" name="typeSpaEntourageCannabis">
                        <span>Cannabis</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.opium" name="typeSpaEntourageOpium">
                        <span>Opium</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.morphiniques" name="typeSpaEntourageMorphiniques" (change)="onTypeSpaEntourageMorphiniquesChange()">
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.heroine" name="typeSpaEntourageHeroine">
                        <span>Héroïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.cocaine" name="typeSpaEntourageCocaine">
                        <span>Cocaïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.hypnotiques" name="typeSpaEntourageHypnotiques" (change)="onTypeSpaEntourageHypnotiquesChange()">
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.amphetamines" name="typeSpaEntourageAmphetamines">
                        <span>Amphétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.ecstasy" name="typeSpaEntourageEcstasy">
                        <span>Ecstasy</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.produitsInhaler" name="typeSpaEntourageProduitsInhaler">
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.pregabaline" name="typeSpaEntouragePregabaline">
                        <span>Prégabaline</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.ketamines" name="typeSpaEntourageKetamines">
                        <span>Kétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.lsd" name="typeSpaEntourageLsd">
                        <span>LSD</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.typeSpaEntourage.autre" name="typeSpaEntourageAutre" (change)="onTypeSpaEntourageAutreChange()">
                        <span>Autre</span>
                      </label>
                    </div>

                    <!-- Précisions substances entourage -->
                    <div class="form-group" *ngIf="formData.typeSpaEntourage.morphiniques">
                      <label class="form-label required">Préciser la substance morphinique</label>
                      <select class="form-select" [(ngModel)]="formData.typeSpaEntourage.morphiniquesPrecision" name="typeSpaEntourageMorphiniquesPrecision" required>
                        <option value="">Sélectionner</option>
                        <option value="SUBUTEX">Subutex</option>
                        <option value="METHADONE">Méthadone</option>
                        <option value="TRAMAL">Tramal</option>
                        <option value="COALGESIC">Coalgésic</option>
                        <option value="FENTANYL">Fentanyl</option>
                      </select>
                    </div>

                    <div class="form-group" *ngIf="formData.typeSpaEntourage.hypnotiques">
                      <label class="form-label required">Préciser l'hypnotique/sédatif</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.typeSpaEntourage.hypnotiquesPrecision"
                        name="typeSpaEntourageHypnotiquesPrecision"
                        placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                        required
                      >
                    </div>

                    <div class="form-group" *ngIf="formData.typeSpaEntourage.autre">
                      <label class="form-label required">Préciser</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.typeSpaEntourage.autrePrecision"
                        name="typeSpaEntourageAutrePrecision"
                        placeholder="Préciser la substance"
                        required
                      >
                    </div>
                  </div>
                </div>

                <!-- Consommation personnelle de SPA -->
                <div class="form-group">
                  <label class="form-label required">Consommez-vous des SPA en dehors de l'alcool et tabac</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationSpaPersonnelle" name="consommationSpaPersonnelle" [value]="true" required (change)="onConsommationSpaPersonnelleChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.consommationSpaPersonnelle" name="consommationSpaPersonnelle" [value]="false" required (change)="onConsommationSpaPersonnelleChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails consommation personnelle -->
                <div class="consommation-personnelle-details" *ngIf="formData.consommationSpaPersonnelle === true">
                  <!-- Drogues utilisées actuellement -->
                  <div class="form-section-title full-width">
                    <h4>Drogue(s) utilisée(s) actuellement</h4>
                  </div>

                  <div class="form-group full-width">
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.cannabis" name="droguesActuellesCannabis">
                        <span>Cannabis</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.opium" name="droguesActuellesOpium">
                        <span>Opium</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.morphiniques" name="droguesActuellesMorphiniques" (change)="onDroguesActuellesMorphiniquesChange()">
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.heroine" name="droguesActuellesHeroine">
                        <span>Héroïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.cocaine" name="droguesActuellesCocaine">
                        <span>Cocaïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.hypnotiques" name="droguesActuellesHypnotiques" (change)="onDroguesActuellesHypnotiquesChange()">
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.amphetamines" name="droguesActuellesAmphetamines">
                        <span>Amphétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.ecstasy" name="droguesActuellesEcstasy">
                        <span>Ecstasy</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.produitsInhaler" name="droguesActuellesProduitsInhaler">
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.pregabaline" name="droguesActuellesPregabaline">
                        <span>Prégabaline</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.ketamines" name="droguesActuellesKetamines">
                        <span>Kétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.lsd" name="droguesActuellesLsd">
                        <span>LSD</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.droguesActuelles.autre" name="droguesActuellesAutre" (change)="onDroguesActuellesAutreChange()">
                        <span>Autre</span>
                      </label>
                    </div>

                    <!-- Précisions drogues actuelles -->
                    <div class="form-group" *ngIf="formData.droguesActuelles.morphiniques">
                      <label class="form-label required">Préciser la substance morphinique</label>
                      <select class="form-select" [(ngModel)]="formData.droguesActuelles.morphiniquesPrecision" name="droguesActuellesMorphiniquesPrecision" required>
                        <option value="">Sélectionner</option>
                        <option value="SUBUTEX">Subutex</option>
                        <option value="METHADONE">Méthadone</option>
                        <option value="TRAMAL">Tramal</option>
                        <option value="COALGESIC">Coalgésic</option>
                        <option value="FENTANYL">Fentanyl</option>
                      </select>
                    </div>

                    <div class="form-group" *ngIf="formData.droguesActuelles.hypnotiques">
                      <label class="form-label required">Préciser l'hypnotique/sédatif</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.droguesActuelles.hypnotiquesPrecision"
                        name="droguesActuellesHypnotiquesPrecision"
                        placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                        required
                      >
                    </div>

                    <div class="form-group" *ngIf="formData.droguesActuelles.autre">
                      <label class="form-label required">Préciser</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.droguesActuelles.autrePrecision"
                        name="droguesActuellesAutrePrecision"
                        placeholder="Préciser la substance"
                        required
                      >
                    </div>
                  </div>

                  <!-- Substance d'initiation -->
                  <div class="form-section-title full-width">
                    <h4>Substance d'initiation de consommation</h4>
                  </div>

                  <div class="form-group full-width">
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.cannabis" name="substanceInitiationCannabis">
                        <span>Cannabis</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.opium" name="substanceInitiationOpium">
                        <span>Opium</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.morphiniques" name="substanceInitiationMorphiniques" (change)="onSubstanceInitiationMorphiniquesChange()">
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.heroine" name="substanceInitiationHeroine">
                        <span>Héroïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.cocaine" name="substanceInitiationCocaine">
                        <span>Cocaïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.hypnotiques" name="substanceInitiationHypnotiques" (change)="onSubstanceInitiationHypnotiquesChange()">
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.amphetamines" name="substanceInitiationAmphetamines">
                        <span>Amphétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.ecstasy" name="substanceInitiationEcstasy">
                        <span>Ecstasy</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.produitsInhaler" name="substanceInitiationProduitsInhaler">
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.pregabaline" name="substanceInitiationPregabaline">
                        <span>Prégabaline</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.ketamines" name="substanceInitiationKetamines">
                        <span>Kétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.lsd" name="substanceInitiationLsd">
                        <span>LSD</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substanceInitiation.autre" name="substanceInitiationAutre" (change)="onSubstanceInitiationAutreChange()">
                        <span>Autre</span>
                      </label>
                    </div>

                    <!-- Précisions substance initiation -->
                    <div class="form-group" *ngIf="formData.substanceInitiation.morphiniques">
                      <label class="form-label required">Préciser la substance morphinique</label>
                      <select class="form-select" [(ngModel)]="formData.substanceInitiation.morphiniquesPrecision" name="substanceInitiationMorphiniquesPrecision" required>
                        <option value="">Sélectionner</option>
                        <option value="SUBUTEX">Subutex</option>
                        <option value="METHADONE">Méthadone</option>
                        <option value="TRAMAL">Tramal</option>
                        <option value="COALGESIC">Coalgésic</option>
                        <option value="FENTANYL">Fentanyl</option>
                      </select>
                    </div>

                    <div class="form-group" *ngIf="formData.substanceInitiation.hypnotiques">
                      <label class="form-label required">Préciser l'hypnotique/sédatif</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.substanceInitiation.hypnotiquesPrecision"
                        name="substanceInitiationHypnotiquesPrecision"
                        placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                        required
                      >
                    </div>

                    <div class="form-group" *ngIf="formData.substanceInitiation.autre">
                      <label class="form-label required">Préciser</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.substanceInitiation.autrePrecision"
                        name="substanceInitiationAutrePrecision"
                        placeholder="Préciser la substance"
                        required
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Âge d'initiation à la consommation de la première substance</label>
                    <input
                      type="number"
                      class="form-input"
                      [(ngModel)]="formData.ageInitiationPremiere"
                      name="ageInitiationPremiere"
                      min="1"
                      max="100"
                      required
                    >
                  </div>

                  <!-- Substance principale (poly-consommation) -->
                  <div class="form-section-title full-width">
                    <h4>Substance principale de consommation (en cas de poly-consommation)</h4>
                  </div>

                  <div class="form-group full-width">
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.cannabis" name="substancePrincipaleCannabis">
                        <span>Cannabis</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.opium" name="substancePrincipaleOpium">
                        <span>Opium</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.morphiniques" name="substancePrincipaleMorphiniques" (change)="onSubstancePrincipaleMorphiniquesChange()">
                        <span>Les morphiniques de synthèse (Subutex...)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.heroine" name="substancePrincipaleHeroine">
                        <span>Héroïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.cocaine" name="substancePrincipaleCocaine">
                        <span>Cocaïne</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.hypnotiques" name="substancePrincipaleHypnotiques" (change)="onSubstancePrincipaleHypnotiquesChange()">
                        <span>Hypnotiques & sédatifs</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.amphetamines" name="substancePrincipaleAmphetamines">
                        <span>Amphétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.ecstasy" name="substancePrincipaleEcstasy">
                        <span>Ecstasy</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.produitsInhaler" name="substancePrincipaleProduitsInhaler">
                        <span>Produits à inhaler (colle, solvants)</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.pregabaline" name="substancePrincipalePregabaline">
                        <span>Prégabaline</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.ketamines" name="substancePrincipaleKetamines">
                        <span>Kétamines</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.lsd" name="substancePrincipaleLsd">
                        <span>LSD</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.substancePrincipale.autre" name="substancePrincipaleAutre" (change)="onSubstancePrincipaleAutreChange()">
                        <span>Autre</span>
                      </label>
                    </div>

                    <!-- Précisions substance principale -->
                    <div class="form-group" *ngIf="formData.substancePrincipale.morphiniques">
                      <label class="form-label required">Préciser la substance morphinique</label>
                      <select class="form-select" [(ngModel)]="formData.substancePrincipale.morphiniquesPrecision" name="substancePrincipaleMorphiniquesPrecision" required>
                        <option value="">Sélectionner</option>
                        <option value="SUBUTEX">Subutex</option>
                        <option value="METHADONE">Méthadone</option>
                        <option value="TRAMAL">Tramal</option>
                        <option value="COALGESIC">Coalgésic</option>
                        <option value="FENTANYL">Fentanyl</option>
                      </select>
                    </div>

                    <div class="form-group" *ngIf="formData.substancePrincipale.hypnotiques">
                      <label class="form-label required">Préciser l'hypnotique/sédatif</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.substancePrincipale.hypnotiquesPrecision"
                        name="substancePrincipaleHypnotiquesPrecision"
                        placeholder="Temesta, Lexomil, Lysanxia, Tranxene, Artane, Parkisol..."
                        required
                      >
                    </div>

                    <div class="form-group" *ngIf="formData.substancePrincipale.autre">
                      <label class="form-label required">Préciser</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.substancePrincipale.autrePrecision"
                        name="substancePrincipaleAutrePrecision"
                        placeholder="Préciser la substance"
                        required
                      >
                    </div>
                  </div>

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

                <!-- Autres comportements addictifs -->
                <div class="form-section-title full-width">
                  <h4>Autres comportements addictifs</h4>
                </div>

                <div class="form-group">
                  <label class="form-label required">Antécédents de troubles des comportements alimentaires (boulimie)</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.troublesAlimentaires" name="troublesAlimentaires" [value]="true" required>
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.troublesAlimentaires" name="troublesAlimentaires" [value]="false" required>
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Addiction aux jeux pathologiques</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.addictionJeux" name="addictionJeux" [value]="true" required>
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.addictionJeux" name="addictionJeux" [value]="false" required>
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Addiction aux écrans</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.addictionEcrans" name="addictionEcrans" [value]="true" required>
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.addictionEcrans" name="addictionEcrans" [value]="false" required>
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Comportements sexuels addictifs</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comportementsSexuels" name="comportementsSexuels" [value]="true" required>
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comportementsSexuels" name="comportementsSexuels" [value]="false" required>
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4: Comportements et tests de dépistage -->
          <div class="step-content card" *ngIf="currentStep === 4">
            <div class="card-header">
              <h3 class="step-title">
                Étape 4: Comportements liés à la consommation des SPA et tests de dépistage
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <!-- Voie d'administration -->
                <div class="form-section-title full-width">
                  <h4>Voie d'administration habituelle (substance principale)</h4>
                </div>

                <div class="form-group full-width">
                  <div class="checkbox-grid">
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.injectee" name="voieAdministrationInjectee">
                      <span>Injectée</span>
                    </label>
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.fumee" name="voieAdministrationFumee">
                      <span>Fumée</span>
                    </label>
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.ingeree" name="voieAdministrationIngeree">
                      <span>Ingérée/bue</span>
                    </label>
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.sniffee" name="voieAdministrationSniffee">
                      <span>Sniffée</span>
                    </label>
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.inhalee" name="voieAdministrationInhalee">
                      <span>Inhalée</span>
                    </label>
                    <label class="checkbox-option">
                      <input type="checkbox" [(ngModel)]="formData.voieAdministration.autre" name="voieAdministrationAutre" (change)="onVoieAdministrationAutreChange()">
                      <span>Autre</span>
                    </label>
                  </div>

                  <!-- Précision autre voie -->
                  <div class="form-group" *ngIf="formData.voieAdministration.autre">
                    <label class="form-label required">Préciser</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="formData.voieAdministration.autrePrecision"
                      name="voieAdministrationAutrePrecision"
                      placeholder="Préciser la voie d'administration"
                      required
                    >
                  </div>
                </div>

                <!-- Fréquence de consommation -->
                <div class="form-group">
                  <label class="form-label">Fréquence de consommation de la substance principale</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.frequenceSubstancePrincipale" name="frequenceSubstancePrincipale" value="DEUX_FOIS_PLUS_PAR_JOUR">
                      <span>2 fois (/doses) ou plus par jour</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.frequenceSubstancePrincipale" name="frequenceSubstancePrincipale" value="UNE_FOIS_PAR_JOUR">
                      <span>Une fois (dose) par jour</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.frequenceSubstancePrincipale" name="frequenceSubstancePrincipale" value="DEUX_TROIS_JOURS_SEMAINE">
                      <span>2 à 3 jours par semaine</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.frequenceSubstancePrincipale" name="frequenceSubstancePrincipale" value="UNE_FOIS_SEMAINE">
                      <span>Une fois par semaine</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.frequenceSubstancePrincipale" name="frequenceSubstancePrincipale" value="OCCASIONNEL_FESTIF">
                      <span>Occasionnellement (usage festif)</span>
                    </label>
                  </div>
                </div>

                <!-- Partage de seringues -->
                <div class="form-group">
                  <label class="form-label">Notion de partage de seringues pendant la période précédente</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="JAMAIS_PARTAGE">
                      <span>N'a jamais partagé de seringue</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="INFERIEUR_1_MOIS">
                      <span>Inférieur à un mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="ENTRE_1_3_MOIS">
                      <span>Entre 1 mois et 3 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="ENTRE_3_6_MOIS">
                      <span>Entre 3 mois et 6 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="ENTRE_6_12_MOIS">
                      <span>Entre 6 mois et 12 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.partageSeringues" name="partageSeringues" value="DOUZE_MOIS_PLUS">
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>

                <!-- Tests de dépistage -->
                <div class="form-section-title full-width">
                  <h4>Tests de dépistage</h4>
                </div>

                <!-- Test VIH -->
                <div class="form-group">
                  <label class="form-label">Test VIH réalisé</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVih.realise" name="testVihRealise" [value]="true" (change)="onTestVihChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVih.realise" name="testVihRealise" [value]="false" (change)="onTestVihChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.testVih.realise === true">
                  <label class="form-label required">Date du test VIH</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVih.periode" name="testVihPeriode" value="3_MOIS" required>
                      <span>3 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVih.periode" name="testVihPeriode" value="6_MOIS" required>
                      <span>6 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVih.periode" name="testVihPeriode" value="12_MOIS_PLUS" required>
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>

                <!-- Test VHC -->
                <div class="form-group">
                  <label class="form-label">Test VHC réalisé</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhc.realise" name="testVhcRealise" [value]="true" (change)="onTestVhcChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhc.realise" name="testVhcRealise" [value]="false" (change)="onTestVhcChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.testVhc.realise === true">
                  <label class="form-label required">Date du test VHC</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhc.periode" name="testVhcPeriode" value="3_MOIS" required>
                      <span>3 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhc.periode" name="testVhcPeriode" value="6_MOIS" required>
                      <span>6 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhc.periode" name="testVhcPeriode" value="12_MOIS_PLUS" required>
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>

                <!-- Test VHB -->
                <div class="form-group">
                  <label class="form-label">Test VHB réalisé</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhb.realise" name="testVhbRealise" [value]="true" (change)="onTestVhbChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhb.realise" name="testVhbRealise" [value]="false" (change)="onTestVhbChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.testVhb.realise === true">
                  <label class="form-label required">Date du test VHB</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhb.periode" name="testVhbPeriode" value="3_MOIS" required>
                      <span>3 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhb.periode" name="testVhbPeriode" value="6_MOIS" required>
                      <span>6 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testVhb.periode" name="testVhbPeriode" value="12_MOIS_PLUS" required>
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>

                <!-- Test Syphilis -->
                <div class="form-group">
                  <label class="form-label">Test du Syphilis réalisé</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testSyphilis.realise" name="testSyphilisRealise" [value]="true" (change)="onTestSyphilisChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testSyphilis.realise" name="testSyphilisRealise" [value]="false" (change)="onTestSyphilisChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.testSyphilis.realise === true">
                  <label class="form-label required">Date du test Syphilis</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testSyphilis.periode" name="testSyphilisPeriode" value="3_MOIS" required>
                      <span>3 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testSyphilis.periode" name="testSyphilisPeriode" value="6_MOIS" required>
                      <span>6 mois</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.testSyphilis.periode" name="testSyphilisPeriode" value="12_MOIS_PLUS" required>
                      <span>12 mois ou plus</span>
                    </label>
                  </div>
                </div>

                <!-- Accompagnement sevrage -->
                <div class="form-group">
                  <label class="form-label">Souhaitez-vous avoir un accompagnement en vue d'un sevrage ?</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.accompagnementSevrage" name="accompagnementSevrage" [value]="true" (change)="onAccompagnementSevrageChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.accompagnementSevrage" name="accompagnementSevrage" [value]="false" (change)="onAccompagnementSevrageChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.accompagnementSevrage === false">
                  <label class="form-label required">Si non, pourquoi ?</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.accompagnementSevrageNonRaison"
                    name="accompagnementSevrageNonRaison"
                    rows="3"
                    placeholder="Expliquer les raisons"
                    required
                  ></textarea>
                </div>

                <!-- Tentative de sevrage -->
                <div class="form-group">
                  <label class="form-label">Avez-vous déjà tenté le sevrage ?</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.tentativeSevrage" name="tentativeSevrage" [value]="true" (change)="onTentativeSevrageChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.tentativeSevrage" name="tentativeSevrage" [value]="false" (change)="onTentativeSevrageChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <!-- Détails tentative sevrage -->
                <div class="tentative-sevrage-details" *ngIf="formData.tentativeSevrage === true">
                  <div class="form-group full-width">
                    <label class="form-label">Comment avez-vous tenté le sevrage ?</label>
                    <div class="checkbox-grid">
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.tentativeSevrageDetails.toutSeul" name="tentativeSevrageToutSeul">
                        <span>Tout seul</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.tentativeSevrageDetails.soutienFamille" name="tentativeSevrageSoutienFamille">
                        <span>Avec le soutien de la famille</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.tentativeSevrageDetails.soutienAmi" name="tentativeSevrageSoutienAmi">
                        <span>Avec le soutien d'un ami</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.tentativeSevrageDetails.soutienScolaire" name="tentativeSevrageSoutienScolaire">
                        <span>Avec un soutien scolaire</span>
                      </label>
                      <label class="checkbox-option">
                        <input type="checkbox" [(ngModel)]="formData.tentativeSevrageDetails.structureSante" name="tentativeSevrageStructureSante" (change)="onTentativeSevrageStructureSanteChange()">
                        <span>Dans une structure de santé</span>
                      </label>
                    </div>

                    <!-- Précision structure de santé -->
                    <div class="form-group" *ngIf="formData.tentativeSevrageDetails.structureSante">
                      <label class="form-label required">Laquelle ?</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="formData.tentativeSevrageDetails.structureSantePrecision"
                        name="tentativeSevrageStructureSantePrecision"
                        placeholder="Nom de la structure de santé"
                        required
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 5: Comorbidités -->
          <div class="step-content card" *ngIf="currentStep === 5">
            <div class="card-header">
              <h3 class="step-title">
                Étape 5: Comorbidités
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <!-- Comorbidités personnelles -->
                <div class="form-section-title full-width">
                  <h4>Comorbidités personnelles</h4>
                </div>

                <div class="form-group">
                  <label class="form-label">Comorbidités psychiatriques personnelles</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditePsychiatriquePersonnelle" name="comorbiditePsychiatriquePersonnelle" [value]="true" (change)="onComorbiditePsychiatriquePersonnelleChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditePsychiatriquePersonnelle" name="comorbiditePsychiatriquePersonnelle" [value]="false" (change)="onComorbiditePsychiatriquePersonnelleChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.comorbiditePsychiatriquePersonnelle === true">
                  <label class="form-label required">Préciser</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.comorbiditePsychiatriquePersonnellePrecision"
                    name="comorbiditePsychiatriquePersonnellePrecision"
                    rows="3"
                    placeholder="Préciser les comorbidités psychiatriques"
                    required
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Comorbidités somatiques personnelles</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditeSomatiquePersonnelle" name="comorbiditeSomatiquePersonnelle" [value]="true" (change)="onComorbiditeSomatiquePersonnelleChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditeSomatiquePersonnelle" name="comorbiditeSomatiquePersonnelle" [value]="false" (change)="onComorbiditeSomatiquePersonnelleChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.comorbiditeSomatiquePersonnelle === true">
                  <label class="form-label required">Préciser</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.comorbiditeSomatiquePersonnellePrecision"
                    name="comorbiditeSomatiquePersonnellePrecision"
                    rows="3"
                    placeholder="Préciser les comorbidités somatiques"
                    required
                  ></textarea>
                </div>

                <!-- Comorbidités des partenaires -->
                <div class="form-section-title full-width">
                  <h4>Comorbidités des partenaires</h4>
                </div>

                <div class="form-group">
                  <label class="form-label">Comorbidités psychiatriques des partenaires</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditePsychiatriquePartenaire" name="comorbiditePsychiatriquePartenaire" [value]="true" (change)="onComorbiditePsychiatriquePartenaireChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditePsychiatriquePartenaire" name="comorbiditePsychiatriquePartenaire" [value]="false" (change)="onComorbiditePsychiatriquePartenaireChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.comorbiditePsychiatriquePartenaire === true">
                  <label class="form-label required">Préciser</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.comorbiditePsychiatriquePartenairePrecision"
                    name="comorbiditePsychiatriquePartenairePrecision"
                    rows="3"
                    placeholder="Préciser les comorbidités psychiatriques des partenaires"
                    required
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Comorbidités somatiques des partenaires</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditeSomatiquePartenaire" name="comorbiditeSomatiquePartenaire" [value]="true" (change)="onComorbiditeSomatiquePartenaireChange()">
                      <span>Oui</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" [(ngModel)]="formData.comorbiditeSomatiquePartenaire" name="comorbiditeSomatiquePartenaire" [value]="false" (change)="onComorbiditeSomatiquePartenaireChange()">
                      <span>Non</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.comorbiditeSomatiquePartenaire === true">
                  <label class="form-label required">Préciser</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.comorbiditeSomatiquePartenairePrecision"
                    name="comorbiditeSomatiquePartenairePrecision"
                    rows="3"
                    placeholder="Préciser les comorbidités somatiques des partenaires"
                    required
                  ></textarea>
                </div>

                <!-- Antécédents pénitentiaires -->
                <div class="form-section-title full-width">
                  <h4>Antécédents pénitentiaires</h4>
                </div>

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

                <div class="form-group">
                  <label class="form-label">Durée de détention (jours)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="formData.dureeDetentionJours"
                    name="dureeDetentionJours"
                    min="0"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Durée de détention (mois)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="formData.dureeDetentionMois"
                    name="dureeDetentionMois"
                    min="0"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Durée de détention (années)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="formData.dureeDetentionAnnees"
                    name="dureeDetentionAnnees"
                    min="0"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 6: Décès induit par les SPA -->
          <div class="step-content card" *ngIf="currentStep === 6">
            <div class="card-header">
              <h3 class="step-title">
                Étape 6: Décès induit par les SPA dans l'entourage
              </h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
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

                <div class="form-group full-width">
                  <label class="form-label">Causes</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.causesDecesSpaDansEntourage"
                    name="causesDecesSpaDansEntourage"
                    rows="5"
                    placeholder="Décrire les causes des décès liés aux SPA dans l'entourage"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Erreurs de validation -->
          <div class="validation-errors" *ngIf="validationErrors.length > 0">
            <div class="error-banner">
              <h4>Erreurs de validation :</h4>
              <ul>
                <li *ngFor="let error of validationErrors">{{ error.message }}</li>
              </ul>
            </div>
          </div>
        </form>

        <!-- Navigation -->
        <div class="formulaire-navigation card">
          <div class="card-body">
            <div class="navigation-buttons">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="previousStep()"
                [disabled]="currentStep === 1 || isSaving"
              >
                ← Précédent
              </button>

              <div class="step-info">
                Étape {{ currentStep }} sur {{ steps.length }}
              </div>

              <button 
                type="button" 
                class="btn btn-primary"
                (click)="nextStep()"
                [disabled]="!canProceedToNextStep() || isSaving"
                *ngIf="currentStep < steps.length"
              >
                Suivant →
              </button>

              <button 
                type="button" 
                class="btn btn-primary btn-lg"
                (click)="saveFormulaire()"
                [disabled]="!canSaveFormulaire() || isSaving"
                *ngIf="currentStep === steps.length"
              >
                <span *ngIf="!isSaving">💾 Enregistrer le formulaire</span>
                <span *ngIf="isSaving" class="flex items-center gap-2">
                  <div class="loading-spinner-sm"></div>
                  Enregistrement...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .formulaire-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-4);
    }

    .formulaire-header {
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
      margin: 0 0 var(--spacing-6) 0;
    }

    /* Barre de progression */
    .progress-bar {
      position: relative;
      margin-bottom: var(--spacing-6);
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--gray-300);
      color: var(--gray-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: var(--spacing-2);
      transition: all 0.3s ease;
    }

    .progress-step.active .step-number {
      background-color: var(--primary-600);
      color: white;
      transform: scale(1.1);
    }

    .progress-step.completed .step-number {
      background-color: var(--success-500);
      color: white;
    }

    .progress-step.valid .step-number {
      background-color: var(--success-500);
      color: white;
    }

    .step-title {
      font-size: 12px;
      text-align: center;
      color: var(--gray-600);
      max-width: 120px;
      line-height: 1.3;
    }

    .progress-step.active .step-title {
      color: var(--primary-600);
      font-weight: 600;
    }

    .progress-line {
      position: absolute;
      top: 20px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--gray-300);
      z-index: 1;
    }

    .progress-fill {
      height: 100%;
      background-color: var(--primary-600);
      transition: width 0.3s ease;
    }

    /* Contenu du formulaire */
    .formulaire-content {
      margin-bottom: var(--spacing-6);
    }

    .step-content {
      margin-bottom: var(--spacing-6);
    }

    .step-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-6);
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-section-title {
      grid-column: 1 / -1;
      border-bottom: 2px solid var(--primary-200);
      padding-bottom: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }

    .form-section-title h4 {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-700);
      margin: 0;
    }

    .form-help {
      font-size: 12px;
      color: var(--gray-500);
      margin-top: var(--spacing-1);
      font-style: italic;
    }

    /* Radio et checkbox groups */
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .radio-option,
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
    }

    .radio-option:hover,
    .checkbox-option:hover {
      background-color: var(--gray-50);
    }

    .radio-option input,
    .checkbox-option input {
      margin: 0;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-2);
    }

    .sub-options {
      margin-left: var(--spacing-6);
      margin-top: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: var(--gray-50);
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--primary-300);
    }

    /* Sections conditionnelles */
    .fumeur-details,
    .ex-fumeur-details,
    .fumeur-actuel-details,
    .consommation-30j-details,
    .alcool-details,
    .alcool-30j-details,
    .entourage-spa-details,
    .consommation-personnelle-details,
    .activite-sportive-details,
    .consultation-anterieure-details,
    .tentative-sevrage-details {
      display: contents;
    }

    /* Navigation */
    .formulaire-navigation {
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
      font-weight: 600;
      color: var(--gray-700);
      text-align: center;
    }

    /* Erreurs de validation */
    .validation-errors {
      margin-bottom: var(--spacing-6);
    }

    .error-banner {
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
      color: var(--error-700);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
    }

    .error-banner h4 {
      margin: 0 0 var(--spacing-2) 0;
      font-size: 16px;
      font-weight: 600;
    }

    .error-banner ul {
      margin: 0;
      padding-left: var(--spacing-4);
    }

    .error-banner li {
      margin-bottom: var(--spacing-1);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .formulaire-container {
        padding: var(--spacing-3);
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-4);
      }

      .progress-steps {
        flex-wrap: wrap;
        gap: var(--spacing-4);
      }

      .step-number {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }

      .step-title {
        font-size: 11px;
        max-width: 100px;
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .navigation-buttons {
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .navigation-buttons .btn {
        width: 100%;
      }

      .step-info {
        order: -1;
      }
    }

    @media (max-width: 480px) {
      .progress-steps {
        justify-content: center;
      }

      .progress-step {
        flex: 0 0 auto;
      }

      .step-title {
        display: none;
      }
    }
  `]
})
export class FormulaireComponent implements OnInit {
  currentStep = 1;
  isSaving = false;
  validationErrors: ValidationError[] = [];
  gouvernorats: Gouvernorat[] = [];
  currentUser: User | null = null;

  steps: FormulaireStep[] = [
    { id: 1, title: 'Informations structure & usager', isValid: false, isCompleted: false },
    { id: 2, title: 'Consommation tabac & alcool', isValid: false, isCompleted: false },
    { id: 3, title: 'Consommation SPA & comportements addictifs', isValid: false, isCompleted: false },
    { id: 4, title: 'Comportements & tests de dépistage', isValid: false, isCompleted: false },
    { id: 5, title: 'Comorbidités', isValid: false, isCompleted: false },
    { id: 6, title: 'Décès induit par les SPA', isValid: false, isCompleted: false }
  ];

  formData: FormulaireData = {
    // Partie 1
    secteur: 'PUBLIC',
    structure: '',
    gouvernoratStructure: '',
    nom: '',
    prenom: '',
    codePatient: '',
    dateConsultation: new Date(),
    genre: 'HOMME',
    dateNaissance: new Date(),
    nationalite: 'TUNISIENNE',
    residence: 'TUNISIE',
    
    cadreConsultation: {},
    origineDemande: {},
    
    consultationAnterieure: null,
    situationFamiliale: 'CELIBATAIRE',
    logement30Jours: 'SEUL',
    natureLogement: 'STABLE',
    profession: 'EMPLOYE',
    niveauScolaire: 'UNIVERSITAIRE',
    activiteSportive: null,
    
    // Partie 2
    consommationTabac: 'NON_FUMEUR',
    consommationAlcool: false,
    typeAlcool: {},
    
    // Partie 3
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
    
    // Partie 4
    voieAdministration: {},
    testVih: {},
    testVhc: {},
    testVhb: {},
    testSyphilis: {},
    tentativeSevrageDetails: {},
    
    // Partie 5
    
    // Partie 6
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadGouvernorats();
    this.generateIUN();
    this.prefillUserData();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.prefillUserData();
    });
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

  private generateIUN(): void {
    // Générer un IUN temporaire (sera remplacé par le système)
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.formData.iun = `IUN${timestamp.slice(-6)}${random}`;
  }

  private prefillUserData(): void {
    if (this.currentUser?.structure) {
      this.formData.structure = this.currentUser.structure.nom;
      this.formData.secteur = this.currentUser.structure.type === 'PUBLIQUE' ? 'PUBLIC' : 
                             this.currentUser.structure.type === 'PRIVEE' ? 'PRIVE' : 'ONG';
      
      if (this.currentUser.structure.gouvernorat) {
        this.formData.gouvernoratStructure = this.currentUser.structure.gouvernorat.nom;
      }
    }
  }

  // Navigation entre les étapes
  goToStep(stepId: number): void {
    if (stepId <= this.currentStep || this.steps[stepId - 1].isCompleted) {
      this.currentStep = stepId;
      this.validateCurrentStep();
    }
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.steps[this.currentStep - 1].isCompleted = true;
      this.currentStep++;
      this.validateCurrentStep();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.validateCurrentStep();
    }
  }

  canProceedToNextStep(): boolean {
    this.validateCurrentStep();
    return this.steps[this.currentStep - 1].isValid;
  }

  canSaveFormulaire(): boolean {
    return this.steps.every(step => step.isValid);
  }

  // Validation
  private validateCurrentStep(): void {
    this.validationErrors = [];
    let isValid = true;

    switch (this.currentStep) {
      case 1:
        isValid = this.validateStep1();
        break;
      case 2:
        isValid = this.validateStep2();
        break;
      case 3:
        isValid = this.validateStep3();
        break;
      case 4:
        isValid = this.validateStep4();
        break;
      case 5:
        isValid = this.validateStep5();
        break;
      case 6:
        isValid = this.validateStep6();
        break;
    }

    this.steps[this.currentStep - 1].isValid = isValid;
  }

  private validateStep1(): boolean {
    let isValid = true;

    // Champs obligatoires de base
    if (!this.formData.secteur) {
      this.addValidationError('secteur', 'Le secteur est obligatoire');
      isValid = false;
    }

    if (this.formData.secteur === 'ONG' && !this.formData.ongPrecision) {
      this.addValidationError('ongPrecision', 'La précision de l\'ONG est obligatoire');
      isValid = false;
    }

    if (this.formData.secteur === 'PUBLIC' && !this.formData.ministere) {
      this.addValidationError('ministere', 'Le ministère est obligatoire');
      isValid = false;
    }

    if (!this.formData.structure) {
      this.addValidationError('structure', 'La structure est obligatoire');
      isValid = false;
    }

    if (!this.formData.gouvernoratStructure) {
      this.addValidationError('gouvernoratStructure', 'Le gouvernorat de la structure est obligatoire');
      isValid = false;
    }

    if (!this.formData.nom) {
      this.addValidationError('nom', 'Le nom est obligatoire');
      isValid = false;
    }

    if (!this.formData.prenom) {
      this.addValidationError('prenom', 'Le prénom est obligatoire');
      isValid = false;
    }

    if (!this.formData.codePatient) {
      this.addValidationError('codePatient', 'Le code patient est obligatoire');
      isValid = false;
    }

    if (!this.formData.dateConsultation) {
      this.addValidationError('dateConsultation', 'La date de consultation est obligatoire');
      isValid = false;
    }

    if (!this.formData.genre) {
      this.addValidationError('genre', 'Le genre est obligatoire');
      isValid = false;
    }

    if (!this.formData.dateNaissance) {
      this.addValidationError('dateNaissance', 'La date de naissance est obligatoire');
      isValid = false;
    }

    if (!this.formData.nationalite) {
      this.addValidationError('nationalite', 'La nationalité est obligatoire');
      isValid = false;
    }

    if (!this.formData.residence) {
      this.addValidationError('residence', 'La résidence est obligatoire');
      isValid = false;
    }

    // Validation conditionnelle résidence
    if (this.formData.residence === 'TUNISIE') {
      if (!this.formData.gouvernoratResidence) {
        this.addValidationError('gouvernoratResidence', 'Le gouvernorat de résidence est obligatoire');
        isValid = false;
      }
      if (!this.formData.delegationResidence) {
        this.addValidationError('delegationResidence', 'La délégation de résidence est obligatoire');
        isValid = false;
      }
    } else if (this.formData.residence === 'ETRANGER') {
      if (!this.formData.paysResidence) {
        this.addValidationError('paysResidence', 'Le pays de résidence est obligatoire');
        isValid = false;
      }
    }

    // Validation cadre consultation
    const hasAnyConsultation = Object.values(this.formData.cadreConsultation).some(v => v === true);
    if (!hasAnyConsultation) {
      this.addValidationError('cadreConsultation', 'Au moins un cadre de consultation doit être sélectionné');
      isValid = false;
    }

    if (this.formData.cadreConsultation.addictologie && !this.formData.cadreConsultation.addictologieType) {
      this.addValidationError('addictologieType', 'Le type d\'addictologie est obligatoire');
      isValid = false;
    }

    if (this.formData.cadreConsultation.autre && !this.formData.cadreConsultation.autrePrecision) {
      this.addValidationError('cadreAutrePrecision', 'La précision du cadre "autre" est obligatoire');
      isValid = false;
    }

    // Validation origine demande
    const hasAnyOrigine = Object.values(this.formData.origineDemande).some(v => v === true);
    if (!hasAnyOrigine) {
      this.addValidationError('origineDemande', 'Au moins une origine de demande doit être sélectionnée');
      isValid = false;
    }

    if (this.formData.origineDemande.autre && !this.formData.origineDemande.autrePrecision) {
      this.addValidationError('origineAutrePrecision', 'La précision de l\'origine "autre" est obligatoire');
      isValid = false;
    }

    // Validation consultation antérieure
    if (this.formData.consultationAnterieure === null) {
      this.addValidationError('consultationAnterieure', 'La consultation antérieure est obligatoire');
      isValid = false;
    }

    if (this.formData.consultationAnterieure === true) {
      if (!this.formData.dateConsultationAnterieure) {
        this.addValidationError('dateConsultationAnterieure', 'La date de consultation antérieure est obligatoire');
        isValid = false;
      }
      if (!this.formData.motifConsultationAnterieure) {
        this.addValidationError('motifConsultationAnterieure', 'Le motif de consultation antérieure est obligatoire');
        isValid = false;
      }
      if (this.formData.motifConsultationAnterieure === 'RECIDIVES' && !this.formData.causeRecidive) {
        this.addValidationError('causeRecidive', 'La cause de récidive est obligatoire');
        isValid = false;
      }
      if (this.formData.motifConsultationAnterieure === 'SEVRAGE' && !this.formData.causeEchecSevrage) {
        this.addValidationError('causeEchecSevrage', 'La cause d\'échec de sevrage est obligatoire');
        isValid = false;
      }
    }

    // Autres champs obligatoires
    if (!this.formData.situationFamiliale) {
      this.addValidationError('situationFamiliale', 'La situation familiale est obligatoire');
      isValid = false;
    }

    if (this.formData.situationFamiliale === 'AUTRE' && !this.formData.situationFamilialeAutre) {
      this.addValidationError('situationFamilialeAutre', 'La précision de la situation familiale est obligatoire');
      isValid = false;
    }

    if (!this.formData.logement30Jours) {
      this.addValidationError('logement30Jours', 'Le logement des 30 derniers jours est obligatoire');
      isValid = false;
    }

    if (this.formData.logement30Jours === 'AUTRE' && !this.formData.logement30JoursAutre) {
      this.addValidationError('logement30JoursAutre', 'La précision du logement est obligatoire');
      isValid = false;
    }

    if (!this.formData.natureLogement) {
      this.addValidationError('natureLogement', 'La nature du logement est obligatoire');
      isValid = false;
    }

    if (!this.formData.profession) {
      this.addValidationError('profession', 'La profession est obligatoire');
      isValid = false;
    }

    if (!this.formData.niveauScolaire) {
      this.addValidationError('niveauScolaire', 'Le niveau scolaire est obligatoire');
      isValid = false;
    }

    if (this.formData.activiteSportive === null) {
      this.addValidationError('activiteSportive', 'L\'activité sportive est obligatoire');
      isValid = false;
    }

    if (this.formData.activiteSportive === true) {
      if (!this.formData.activiteSportiveFrequence) {
        this.addValidationError('activiteSportiveFrequence', 'La fréquence de l\'activité sportive est obligatoire');
        isValid = false;
      }
      if (!this.formData.activiteSportiveType) {
        this.addValidationError('activiteSportiveType', 'Le type d\'activité sportive est obligatoire');
        isValid = false;
      }
      if (this.formData.activiteSportiveType === 'COMPETITION' && this.formData.dopage === null) {
        this.addValidationError('dopage', 'La question sur le dopage est obligatoire');
        isValid = false;
      }
    }

    return isValid;
  }

  private validateStep2(): boolean {
    let isValid = true;

    if (!this.formData.consommationTabac) {
      this.addValidationError('consommationTabac', 'Le statut tabagique est obligatoire');
      isValid = false;
    }

    // Validation fumeur/ex-fumeur
    if (this.formData.consommationTabac === 'FUMEUR' || this.formData.consommationTabac === 'EX_FUMEUR') {
      if (!this.formData.agePremiereConsommationTabac) {
        this.addValidationError('agePremiereConsommationTabac', 'L\'âge de première consommation de tabac est obligatoire');
        isValid = false;
      }
    }

    // Validation fumeur actuel
    if (this.formData.consommationTabac === 'FUMEUR') {
      if (this.formData.consommationTabac30Jours === null) {
        this.addValidationError('consommationTabac30Jours', 'La consommation de tabac des 30 derniers jours est obligatoire');
        isValid = false;
      }

      if (this.formData.consommationTabac30Jours === true) {
        if (!this.formData.frequenceTabac30Jours) {
          this.addValidationError('frequenceTabac30Jours', 'La fréquence de consommation de tabac est obligatoire');
          isValid = false;
        }
        if (!this.formData.nombreCigarettesJour) {
          this.addValidationError('nombreCigarettesJour', 'Le nombre de cigarettes par jour est obligatoire');
          isValid = false;
        }
        if (!this.formData.nombrePaquetsAnnee) {
          this.addValidationError('nombrePaquetsAnnee', 'Le nombre de paquets par année est obligatoire');
          isValid = false;
        }
      }
    }

    // Validation ex-fumeur
    if (this.formData.consommationTabac === 'EX_FUMEUR') {
      if (!this.formData.ageArretTabac) {
        this.addValidationError('ageArretTabac', 'L\'âge d\'arrêt du tabac est obligatoire');
        isValid = false;
      }
    }

    // Validation alcool
    if (this.formData.consommationAlcool === null) {
      this.addValidationError('consommationAlcool', 'La consommation d\'alcool est obligatoire');
      isValid = false;
    }

    if (this.formData.consommationAlcool === true) {
      if (!this.formData.agePremiereConsommationAlcool) {
        this.addValidationError('agePremiereConsommationAlcool', 'L\'âge de première consommation d\'alcool est obligatoire');
        isValid = false;
      }

      if (this.formData.consommationAlcool30Jours === null) {
        this.addValidationError('consommationAlcool30Jours', 'La consommation d\'alcool des 30 derniers jours est obligatoire');
        isValid = false;
      }

      if (this.formData.consommationAlcool30Jours === true) {
        if (!this.formData.frequenceAlcool30Jours) {
          this.addValidationError('frequenceAlcool30Jours', 'La fréquence de consommation d\'alcool est obligatoire');
          isValid = false;
        }
        if (!this.formData.quantiteAlcoolPrise) {
          this.addValidationError('quantiteAlcoolPrise', 'La quantité d\'alcool consommée est obligatoire');
          isValid = false;
        }

        const hasAnyTypeAlcool = Object.values(this.formData.typeAlcool || {}).some(v => v === true);
        if (!hasAnyTypeAlcool) {
          this.addValidationError('typeAlcool', 'Au moins un type d\'alcool doit être sélectionné');
          isValid = false;
        }
      }
    }

    return isValid;
  }

  private validateStep3(): boolean {
    let isValid = true;

    if (this.formData.consommationSpaEntourage === null) {
      this.addValidationError('consommationSpaEntourage', 'La consommation de SPA dans l\'entourage est obligatoire');
      isValid = false;
    }

    // Validation entourage SPA
    if (this.formData.consommationSpaEntourage === true) {
      const hasAnyEntourage = Object.values(this.formData.entourageSpa || {}).some(v => v === true);
      if (!hasAnyEntourage) {
        this.addValidationError('entourageSpa', 'Au moins un type d\'entourage doit être sélectionné');
        isValid = false;
      }

      if (this.formData.entourageSpa?.autre && !this.formData.entourageSpa.autrePrecision) {
        this.addValidationError('entourageAutrePrecision', 'La précision de l\'entourage "autre" est obligatoire');
        isValid = false;
      }

      const hasAnyTypeSpaEntourage = Object.values(this.formData.typeSpaEntourage || {}).some(v => v === true);
      if (!hasAnyTypeSpaEntourage) {
        this.addValidationError('typeSpaEntourage', 'Au moins un type de SPA dans l\'entourage doit être sélectionné');
        isValid = false;
      }

      // Validations conditionnelles types SPA entourage
      if (this.formData.typeSpaEntourage?.morphiniques && !this.formData.typeSpaEntourage.morphiniquesPrecision) {
        this.addValidationError('typeSpaEntourageMorphiniquesPrecision', 'La précision des morphiniques est obligatoire');
        isValid = false;
      }

      if (this.formData.typeSpaEntourage?.hypnotiques && !this.formData.typeSpaEntourage.hypnotiquesPrecision) {
        this.addValidationError('typeSpaEntourageHypnotiquesPrecision', 'La précision des hypnotiques est obligatoire');
        isValid = false;
      }

      if (this.formData.typeSpaEntourage?.autre && !this.formData.typeSpaEntourage.autrePrecision) {
        this.addValidationError('typeSpaEntourageAutrePrecision', 'La précision du type SPA "autre" est obligatoire');
        isValid = false;
      }
    }

    // Validation consommation personnelle
    if (this.formData.consommationSpaPersonnelle === null) {
      this.addValidationError('consommationSpaPersonnelle', 'La consommation personnelle de SPA est obligatoire');
      isValid = false;
    }

    if (this.formData.consommationSpaPersonnelle === true) {
      // Drogues actuelles
      const hasAnyDrogueActuelle = Object.values(this.formData.droguesActuelles || {}).some(v => v === true);
      if (!hasAnyDrogueActuelle) {
        this.addValidationError('droguesActuelles', 'Au moins une drogue actuelle doit être sélectionnée');
        isValid = false;
      }

      // Validations conditionnelles drogues actuelles
      if (this.formData.droguesActuelles?.morphiniques && !this.formData.droguesActuelles.morphiniquesPrecision) {
        this.addValidationError('droguesActuellesMorphiniquesPrecision', 'La précision des morphiniques est obligatoire');
        isValid = false;
      }

      if (this.formData.droguesActuelles?.hypnotiques && !this.formData.droguesActuelles.hypnotiquesPrecision) {
        this.addValidationError('droguesActuellesHypnotiquesPrecision', 'La précision des hypnotiques est obligatoire');
        isValid = false;
      }

      if (this.formData.droguesActuelles?.autre && !this.formData.droguesActuelles.autrePrecision) {
        this.addValidationError('droguesActuellesAutrePrecision', 'La précision de la drogue "autre" est obligatoire');
        isValid = false;
      }

      // Substance d'initiation
      const hasAnySubstanceInitiation = Object.values(this.formData.substanceInitiation || {}).some(v => v === true);
      if (!hasAnySubstanceInitiation) {
        this.addValidationError('substanceInitiation', 'Au moins une substance d\'initiation doit être sélectionnée');
        isValid = false;
      }

      // Validations conditionnelles substance initiation
      if (this.formData.substanceInitiation?.morphiniques && !this.formData.substanceInitiation.morphiniquesPrecision) {
        this.addValidationError('substanceInitiationMorphiniquesPrecision', 'La précision des morphiniques est obligatoire');
        isValid = false;
      }

      if (this.formData.substanceInitiation?.hypnotiques && !this.formData.substanceInitiation.hypnotiquesPrecision) {
        this.addValidationError('substanceInitiationHypnotiquesPrecision', 'La précision des hypnotiques est obligatoire');
        isValid = false;
      }

      if (this.formData.substanceInitiation?.autre && !this.formData.substanceInitiation.autrePrecision) {
        this.addValidationError('substanceInitiationAutrePrecision', 'La précision de la substance "autre" est obligatoire');
        isValid = false;
      }

      if (!this.formData.ageInitiationPremiere) {
        this.addValidationError('ageInitiationPremiere', 'L\'âge d\'initiation à la première substance est obligatoire');
        isValid = false;
      }

      // Validations conditionnelles substance principale
      if (this.formData.substancePrincipale?.morphiniques && !this.formData.substancePrincipale.morphiniquesPrecision) {
        this.addValidationError('substancePrincipaleMorphiniquesPrecision', 'La précision des morphiniques est obligatoire');
        isValid = false;
      }

      if (this.formData.substancePrincipale?.hypnotiques && !this.formData.substancePrincipale.hypnotiquesPrecision) {
        this.addValidationError('substancePrincipaleHypnotiquesPrecision', 'La précision des hypnotiques est obligatoire');
        isValid = false;
      }

      if (this.formData.substancePrincipale?.autre && !this.formData.substancePrincipale.autrePrecision) {
        this.addValidationError('substancePrincipaleAutrePrecision', 'La précision de la substance "autre" est obligatoire');
        isValid = false;
      }
    }

    // Autres comportements addictifs
    if (this.formData.troublesAlimentaires === null) {
      this.addValidationError('troublesAlimentaires', 'Les troubles alimentaires sont obligatoires');
      isValid = false;
    }

    if (this.formData.addictionJeux === null) {
      this.addValidationError('addictionJeux', 'L\'addiction aux jeux est obligatoire');
      isValid = false;
    }

    if (this.formData.addictionEcrans === null) {
      this.addValidationError('addictionEcrans', 'L\'addiction aux écrans est obligatoire');
      isValid = false;
    }

    if (this.formData.comportementsSexuels === null) {
      this.addValidationError('comportementsSexuels', 'Les comportements sexuels addictifs sont obligatoires');
      isValid = false;
    }

    return isValid;
  }

  private validateStep4(): boolean {
    let isValid = true;

    // Validation voie d'administration
    if (this.formData.voieAdministration?.autre && !this.formData.voieAdministration.autrePrecision) {
      this.addValidationError('voieAdministrationAutrePrecision', 'La précision de la voie d\'administration est obligatoire');
      isValid = false;
    }

    // Validation tests de dépistage
    if (this.formData.testVih?.realise === true && !this.formData.testVih.periode) {
      this.addValidationError('testVihPeriode', 'La période du test VIH est obligatoire');
      isValid = false;
    }

    if (this.formData.testVhc?.realise === true && !this.formData.testVhc.periode) {
      this.addValidationError('testVhcPeriode', 'La période du test VHC est obligatoire');
      isValid = false;
    }

    if (this.formData.testVhb?.realise === true && !this.formData.testVhb.periode) {
      this.addValidationError('testVhbPeriode', 'La période du test VHB est obligatoire');
      isValid = false;
    }

    if (this.formData.testSyphilis?.realise === true && !this.formData.testSyphilis.periode) {
      this.addValidationError('testSyphilisPeriode', 'La période du test Syphilis est obligatoire');
      isValid = false;
    }

    // Validation accompagnement sevrage
    if (this.formData.accompagnementSevrage === false && !this.formData.accompagnementSevrageNonRaison) {
      this.addValidationError('accompagnementSevrageNonRaison', 'La raison du refus d\'accompagnement est obligatoire');
      isValid = false;
    }

    // Validation tentative sevrage
    if (this.formData.tentativeSevrage === true) {
      if (this.formData.tentativeSevrageDetails?.structureSante && !this.formData.tentativeSevrageDetails.structureSantePrecision) {
        this.addValidationError('tentativeSevrageStructureSantePrecision', 'La précision de la structure de santé est obligatoire');
        isValid = false;
      }
    }

    return isValid;
  }

  private validateStep5(): boolean {
    let isValid = true;

    // Validation comorbidités
    if (this.formData.comorbiditePsychiatriquePersonnelle === true && !this.formData.comorbiditePsychiatriquePersonnellePrecision) {
      this.addValidationError('comorbiditePsychiatriquePersonnellePrecision', 'La précision des comorbidités psychiatriques personnelles est obligatoire');
      isValid = false;
    }

    if (this.formData.comorbiditeSomatiquePersonnelle === true && !this.formData.comorbiditeSomatiquePersonnellePrecision) {
      this.addValidationError('comorbiditeSomatiquePersonnellePrecision', 'La précision des comorbidités somatiques personnelles est obligatoire');
      isValid = false;
    }

    if (this.formData.comorbiditePsychiatriquePartenaire === true && !this.formData.comorbiditePsychiatriquePartenairePrecision) {
      this.addValidationError('comorbiditePsychiatriquePartenairePrecision', 'La précision des comorbidités psychiatriques des partenaires est obligatoire');
      isValid = false;
    }

    if (this.formData.comorbiditeSomatiquePartenaire === true && !this.formData.comorbiditeSomatiquePartenairePrecision) {
      this.addValidationError('comorbiditeSomatiquePartenairePrecision', 'La précision des comorbidités somatiques des partenaires est obligatoire');
      isValid = false;
    }

    return isValid;
  }

  private validateStep6(): boolean {
    // Étape 6 n'a pas de champs obligatoires
    return true;
  }

  private addValidationError(field: string, message: string): void {
    this.validationErrors.push({ field, message });
  }

  // Gestionnaires d'événements pour les champs conditionnels
  onSecteurChange(): void {
    if (this.formData.secteur !== 'ONG') {
      this.formData.ongPrecision = undefined;
    }
    if (this.formData.secteur !== 'PUBLIC') {
      this.formData.ministere = undefined;
    }
  }

  onResidenceChange(): void {
    if (this.formData.residence === 'ETRANGER') {
      this.formData.gouvernoratResidence = undefined;
      this.formData.delegationResidence = undefined;
    } else {
      this.formData.paysResidence = undefined;
    }
  }

  onAddictologieChange(): void {
    if (!this.formData.cadreConsultation.addictologie) {
      this.formData.cadreConsultation.addictologieType = undefined;
    }
  }

  onCadreAutreChange(): void {
    if (!this.formData.cadreConsultation.autre) {
      this.formData.cadreConsultation.autrePrecision = undefined;
    }
  }

  onOrigineAutreChange(): void {
    if (!this.formData.origineDemande.autre) {
      this.formData.origineDemande.autrePrecision = undefined;
    }
  }

  onConsultationAnterieureChange(): void {
    if (this.formData.consultationAnterieure === false) {
      this.formData.dateConsultationAnterieure = undefined;
      this.formData.motifConsultationAnterieure = undefined;
      this.formData.causeRecidive = undefined;
      this.formData.causeEchecSevrage = undefined;
    }
  }

  onMotifConsultationChange(): void {
    if (this.formData.motifConsultationAnterieure !== 'RECIDIVES') {
      this.formData.causeRecidive = undefined;
    }
    if (this.formData.motifConsultationAnterieure !== 'SEVRAGE') {
      this.formData.causeEchecSevrage = undefined;
    }
  }

  onSituationFamilialeChange(): void {
    if (this.formData.situationFamiliale !== 'AUTRE') {
      this.formData.situationFamilialeAutre = undefined;
    }
  }

  onLogement30JoursChange(): void {
    if (this.formData.logement30Jours !== 'AUTRE') {
      this.formData.logement30JoursAutre = undefined;
    }
  }

  onActiviteSportiveChange(): void {
    if (this.formData.activiteSportive === false) {
      this.formData.activiteSportiveFrequence = undefined;
      this.formData.activiteSportiveType = undefined;
      this.formData.dopage = undefined;
    }
  }

  onActiviteSportiveTypeChange(): void {
    if (this.formData.activiteSportiveType !== 'COMPETITION') {
      this.formData.dopage = undefined;
    }
  }

  onConsommationTabacChange(): void {
    if (this.formData.consommationTabac === 'NON_FUMEUR') {
      this.formData.agePremiereConsommationTabac = undefined;
      this.formData.consommationTabac30Jours = undefined;
      this.formData.frequenceTabac30Jours = undefined;
      this.formData.nombreCigarettesJour = undefined;
      this.formData.nombrePaquetsAnnee = undefined;
      this.formData.ageArretTabac = undefined;
      this.formData.soinsSevrageTabac = undefined;
      this.formData.sevrageAssiste = undefined;
    } else if (this.formData.consommationTabac === 'EX_FUMEUR') {
      this.formData.consommationTabac30Jours = undefined;
      this.formData.frequenceTabac30Jours = undefined;
      this.formData.nombreCigarettesJour = undefined;
      this.formData.nombrePaquetsAnnee = undefined;
      this.formData.soinsSevrageTabac = undefined;
      this.formData.sevrageAssiste = undefined;
    } else if (this.formData.consommationTabac === 'FUMEUR') {
      this.formData.ageArretTabac = undefined;
    }
  }

  onConsommationTabac30JoursChange(): void {
    if (this.formData.consommationTabac30Jours === false) {
      this.formData.frequenceTabac30Jours = undefined;
      this.formData.nombreCigarettesJour = undefined;
      this.formData.nombrePaquetsAnnee = undefined;
    }
  }

  onConsommationAlcoolChange(): void {
    if (this.formData.consommationAlcool === false) {
      this.formData.agePremiereConsommationAlcool = undefined;
      this.formData.consommationAlcool30Jours = undefined;
      this.formData.frequenceAlcool30Jours = undefined;
      this.formData.quantiteAlcoolPrise = undefined;
      this.formData.typeAlcool = {};
    }
  }

  onConsommationAlcool30JoursChange(): void {
    if (this.formData.consommationAlcool30Jours === false) {
      this.formData.frequenceAlcool30Jours = undefined;
      this.formData.quantiteAlcoolPrise = undefined;
      this.formData.typeAlcool = {};
    }
  }

  onConsommationSpaEntourageChange(): void {
    if (this.formData.consommationSpaEntourage === false) {
      this.formData.entourageSpa = {};
      this.formData.typeSpaEntourage = {};
    }
  }

  onEntourageAutreChange(): void {
    if (!this.formData.entourageSpa?.autre) {
      this.formData.entourageSpa!.autrePrecision = undefined;
    }
  }

  onTypeSpaEntourageMorphiniquesChange(): void {
    if (!this.formData.typeSpaEntourage?.morphiniques) {
      this.formData.typeSpaEntourage!.morphiniquesPrecision = undefined;
    }
  }

  onTypeSpaEntourageHypnotiquesChange(): void {
    if (!this.formData.typeSpaEntourage?.hypnotiques) {
      this.formData.typeSpaEntourage!.hypnotiquesPrecision = undefined;
    }
  }

  onTypeSpaEntourageAutreChange(): void {
    if (!this.formData.typeSpaEntourage?.autre) {
      this.formData.typeSpaEntourage!.autrePrecision = undefined;
    }
  }

  onConsommationSpaPersonnelleChange(): void {
    if (this.formData.consommationSpaPersonnelle === false) {
      this.formData.droguesActuelles = {};
      this.formData.substanceInitiation = {};
      this.formData.ageInitiationPremiere = undefined;
      this.formData.substancePrincipale = {};
      this.formData.ageInitiationPrincipale = undefined;
    }
  }

  onDroguesActuellesMorphiniquesChange(): void {
    if (!this.formData.droguesActuelles?.morphiniques) {
      this.formData.droguesActuelles!.morphiniquesPrecision = undefined;
    }
  }

  onDroguesActuellesHypnotiquesChange(): void {
    if (!this.formData.droguesActuelles?.hypnotiques) {
      this.formData.droguesActuelles!.hypnotiquesPrecision = undefined;
    }
  }

  onDroguesActuellesAutreChange(): void {
    if (!this.formData.droguesActuelles?.autre) {
      this.formData.droguesActuelles!.autrePrecision = undefined;
    }
  }

  onSubstanceInitiationMorphiniquesChange(): void {
    if (!this.formData.substanceInitiation?.morphiniques) {
      this.formData.substanceInitiation!.morphiniquesPrecision = undefined;
    }
  }

  onSubstanceInitiationHypnotiquesChange(): void {
    if (!this.formData.substanceInitiation?.hypnotiques) {
      this.formData.substanceInitiation!.hypnotiquesPrecision = undefined;
    }
  }

  onSubstanceInitiationAutreChange(): void {
    if (!this.formData.substanceInitiation?.autre) {
      this.formData.substanceInitiation!.autrePrecision = undefined;
    }
  }

  onSubstancePrincipaleMorphiniquesChange(): void {
    if (!this.formData.substancePrincipale?.morphiniques) {
      this.formData.substancePrincipale!.morphiniquesPrecision = undefined;
    }
  }

  onSubstancePrincipaleHypnotiquesChange(): void {
    if (!this.formData.substancePrincipale?.hypnotiques) {
      this.formData.substancePrincipale!.hypnotiquesPrecision = undefined;
    }
  }

  onSubstancePrincipaleAutreChange(): void {
    if (!this.formData.substancePrincipale?.autre) {
      this.formData.substancePrincipale!.autrePrecision = undefined;
    }
  }

  onVoieAdministrationAutreChange(): void {
    if (!this.formData.voieAdministration?.autre) {
      this.formData.voieAdministration!.autrePrecision = undefined;
    }
  }

  onTestVihChange(): void {
    if (this.formData.testVih?.realise === false) {
      this.formData.testVih!.periode = undefined;
    }
  }

  onTestVhcChange(): void {
    if (this.formData.testVhc?.realise === false) {
      this.formData.testVhc!.periode = undefined;
    }
  }

  onTestVhbChange(): void {
    if (this.formData.testVhb?.realise === false) {
      this.formData.testVhb!.periode = undefined;
    }
  }

  onTestSyphilisChange(): void {
    if (this.formData.testSyphilis?.realise === false) {
      this.formData.testSyphilis!.periode = undefined;
    }
  }

  onAccompagnementSevrageChange(): void {
    if (this.formData.accompagnementSevrage === true) {
      this.formData.accompagnementSevrageNonRaison = undefined;
    }
  }

  onTentativeSevrageChange(): void {
    if (this.formData.tentativeSevrage === false) {
      this.formData.tentativeSevrageDetails = {};
    }
  }

  onTentativeSevrageStructureSanteChange(): void {
    if (!this.formData.tentativeSevrageDetails?.structureSante) {
      this.formData.tentativeSevrageDetails!.structureSantePrecision = undefined;
    }
  }

  onComorbiditePsychiatriquePersonnelleChange(): void {
    if (this.formData.comorbiditePsychiatriquePersonnelle === false) {
      this.formData.comorbiditePsychiatriquePersonnellePrecision = undefined;
    }
  }

  onComorbiditeSomatiquePersonnelleChange(): void {
    if (this.formData.comorbiditeSomatiquePersonnelle === false) {
      this.formData.comorbiditeSomatiquePersonnellePrecision = undefined;
    }
  }

  onComorbiditePsychiatriquePartenaireChange(): void {
    if (this.formData.comorbiditePsychiatriquePartenaire === false) {
      this.formData.comorbiditePsychiatriquePartenairePrecision = undefined;
    }
  }

  onComorbiditeSomatiquePartenaireChange(): void {
    if (this.formData.comorbiditeSomatiquePartenaire === false) {
      this.formData.comorbiditeSomatiquePartenairePrecision = undefined;
    }
  }

  // Sauvegarde
  saveFormulaire(): void {
    if (!this.canSaveFormulaire()) {
      return;
    }

    this.isSaving = true;

    // Simulation de la sauvegarde
    setTimeout(() => {
      console.log('Formulaire sauvegardé:', this.formData);
      this.isSaving = false;
      
      // Redirection vers la liste des formulaires
      this.router.navigate(['/mes-formulaires']);
    }, 2000);
  }
}
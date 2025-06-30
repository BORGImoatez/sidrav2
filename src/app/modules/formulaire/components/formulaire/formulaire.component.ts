import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulaireData } from '../../../formulaire/models/formulaire.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="formulaire-container">
      <div class="page-header">
        <h1 class="page-title">Nouveau formulaire SIDRA</h1>
        <p class="page-description">
          Saisie des données d'un usager de substances psychoactives (SPA)
        </p>
      </div>

      <div class="formulaire-card card">
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #formulaireForm="ngForm">
            
            <!-- IUN (généré automatiquement) -->
            <div class="form-group">
              <label class="form-label">IUN (Identifiant Unique National)</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="formData.iun"
                name="iun"
                placeholder="Généré automatiquement par la plateforme"
                readonly
              >
              <small class="form-help">Réservé à l'INSP, généré systématiquement par la plateforme</small>
            </div>

            <!-- Secteur -->
            <div class="form-group">
              <label class="form-label required">Secteur</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.secteur === 'PUBLIC'"
                    (change)="onSecteurChange('PUBLIC')"
                    name="secteur_public"
                  >
                  <span class="checkbox-label">1. Public</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.secteur === 'PRIVE'"
                    (change)="onSecteurChange('PRIVE')"
                    name="secteur_prive"
                  >
                  <span class="checkbox-label">2. Privé</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.secteur === 'SOCIETE_CIVILE_ONG'"
                    (change)="onSecteurChange('SOCIETE_CIVILE_ONG')"
                    name="secteur_ong"
                  >
                  <span class="checkbox-label">3. Société civile (ONG)</span>
                </label>
              </div>
              
              <!-- Si ONG, préciser -->
              <div class="form-group-indent" *ngIf="formData.secteur === 'SOCIETE_CIVILE_ONG'">
                <label class="form-label required">1.a Si ONG, préciser</label>
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
            </div>

            <!-- Ministère -->
            <div class="form-group">
              <label class="form-label">Ministère</label>
              <select class="form-select" [(ngModel)]="formData.ministere" name="ministere">
                <option value="">Sélectionner un ministère</option>
                <option value="SANTE">Ministère de la Santé</option>
                <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                <option value="EDUCATION">Ministère de l'Éducation</option>
                <option value="ENSEIGNEMENT_SUPERIEUR">Ministère de l'Enseignement Supérieur</option>
                <option value="JUSTICE">Ministère de la Justice</option>
                <option value="INTERIEUR">Ministère de l'Intérieur</option>
              </select>
            </div>

            <!-- Structure/Centre -->
            <div class="form-group">
              <label class="form-label required">Structure / Centre</label>
              <select class="form-select" [(ngModel)]="formData.structure" name="structure" required>
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
                <option value="CSB">CSB</option>
                <option value="SERVICE_MEDICAL_PENITENTIAIRE">Service médical en milieu pénitentiaire</option>
              </select>
            </div>

            <!-- Gouvernorat de la Structure/Centre -->
            <div class="form-group">
              <label class="form-label required">3.a) Préciser le gouvernorat de la Structure/Centre</label>
              <select class="form-select" [(ngModel)]="formData.gouvernoratStructure" name="gouvernoratStructure" required>
                <option value="">Sélectionner un gouvernorat</option>
                <option value="TUNIS">Tunis</option>
                <option value="ARIANA">Ariana</option>
                <option value="BEN_AROUS">Ben Arous</option>
                <option value="MANOUBA">Manouba</option>
                <option value="NABEUL">Nabeul</option>
                <option value="ZAGHOUAN">Zaghouan</option>
                <option value="BIZERTE">Bizerte</option>
                <option value="BEJA">Béja</option>
                <option value="JENDOUBA">Jendouba</option>
                <option value="KEF">Kef</option>
                <option value="SILIANA">Siliana</option>
                <option value="SOUSSE">Sousse</option>
                <option value="MONASTIR">Monastir</option>
                <option value="MAHDIA">Mahdia</option>
                <option value="SFAX">Sfax</option>
                <option value="KAIROUAN">Kairouan</option>
                <option value="KASSERINE">Kasserine</option>
                <option value="SIDI_BOUZID">Sidi Bouzid</option>
                <option value="GABES">Gabès</option>
                <option value="MEDENINE">Médenine</option>
                <option value="TATAOUINE">Tataouine</option>
                <option value="GAFSA">Gafsa</option>
                <option value="TOZEUR">Tozeur</option>
                <option value="KEBILI">Kébili</option>
              </select>
            </div>

            <!-- Nom -->
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

            <!-- Prénom -->
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

            <!-- Code du patient -->
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

            <!-- Date de la consultation/entretien -->
            <div class="form-group">
              <label class="form-label required">4) Date de la consultation/entretien</label>
              <input
                type="date"
                class="form-input"
                [(ngModel)]="formData.dateConsultation"
                name="dateConsultation"
                required
              >
            </div>

            <!-- Genre -->
            <div class="form-group">
              <label class="form-label required">5) Genre</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.genre === 'HOMME'"
                    (change)="onGenreChange('HOMME')"
                    name="genre_homme"
                  >
                  <span class="checkbox-label">1. Homme</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.genre === 'FEMME'"
                    (change)="onGenreChange('FEMME')"
                    name="genre_femme"
                  >
                  <span class="checkbox-label">2. Femme</span>
                </label>
              </div>
            </div>

            <!-- Date de naissance -->
            <div class="form-group">
              <label class="form-label required">5) Date de naissance complète</label>
              <input
                type="date"
                class="form-input"
                [(ngModel)]="formData.dateNaissance"
                name="dateNaissance"
                required
              >
            </div>

            <!-- Nationalité -->
            <div class="form-group">
              <label class="form-label required">6) Nationalité</label>
              <select class="form-select" [(ngModel)]="formData.nationalite" name="nationalite" required>
                <option value="">Sélectionner une nationalité</option>
                <option value="TUNISIENNE">Tunisienne</option>
                <option value="ALGERIENNE">Algérienne</option>
                <option value="MAROCAINE">Marocaine</option>
                <option value="LIBYENNE">Libyenne</option>
                <option value="FRANCAISE">Française</option>
                <option value="ITALIENNE">Italienne</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>

            <!-- Résidence -->
            <div class="form-group">
              <label class="form-label required">7) Résidence</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.residence === 'TUNISIE'"
                    (change)="onResidenceChange('TUNISIE')"
                    name="residence_tunisie"
                  >
                  <span class="checkbox-label">1. En Tunisie</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.residence === 'ETRANGER'"
                    (change)="onResidenceChange('ETRANGER')"
                    name="residence_etranger"
                  >
                  <span class="checkbox-label">2. À l'étranger</span>
                </label>
              </div>

              <!-- Si en Tunisie -->
              <div class="form-group-indent" *ngIf="formData.residence === 'TUNISIE'">
                <div class="form-group">
                  <label class="form-label required">7.a. Gouvernorat</label>
                  <select class="form-select" [(ngModel)]="formData.gouvernoratResidence" name="gouvernoratResidence" required>
                    <option value="">Sélectionner un gouvernorat</option>
                    <option value="TUNIS">Tunis</option>
                    <option value="ARIANA">Ariana</option>
                    <option value="BEN_AROUS">Ben Arous</option>
                    <option value="MANOUBA">Manouba</option>
                    <option value="NABEUL">Nabeul</option>
                    <option value="ZAGHOUAN">Zaghouan</option>
                    <option value="BIZERTE">Bizerte</option>
                    <option value="BEJA">Béja</option>
                    <option value="JENDOUBA">Jendouba</option>
                    <option value="KEF">Kef</option>
                    <option value="SILIANA">Siliana</option>
                    <option value="SOUSSE">Sousse</option>
                    <option value="MONASTIR">Monastir</option>
                    <option value="MAHDIA">Mahdia</option>
                    <option value="SFAX">Sfax</option>
                    <option value="KAIROUAN">Kairouan</option>
                    <option value="KASSERINE">Kasserine</option>
                    <option value="SIDI_BOUZID">Sidi Bouzid</option>
                    <option value="GABES">Gabès</option>
                    <option value="MEDENINE">Médenine</option>
                    <option value="TATAOUINE">Tataouine</option>
                    <option value="GAFSA">Gafsa</option>
                    <option value="TOZEUR">Tozeur</option>
                    <option value="KEBILI">Kébili</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label required">7.b. Délégation</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.delegationResidence"
                    name="delegationResidence"
                    required
                  >
                </div>
              </div>

              <!-- Si à l'étranger -->
              <div class="form-group-indent" *ngIf="formData.residence === 'ETRANGER'">
                <div class="form-group">
                  <label class="form-label required">7.c. Pays</label>
                  <select class="form-select" [(ngModel)]="formData.paysResidence" name="paysResidence" required>
                    <option value="">Sélectionner un pays</option>
                    <option value="ALGERIE">Algérie</option>
                    <option value="MAROC">Maroc</option>
                    <option value="LIBYE">Libye</option>
                    <option value="FRANCE">France</option>
                    <option value="ITALIE">Italie</option>
                    <option value="ALLEMAGNE">Allemagne</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Cadre de la consultation/entretien -->
            <div class="form-group">
              <label class="form-label required">8) Cadre de la consultation/entretien</label>
              
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.addictologie"
                    name="cadre_addictologie"
                  >
                  <span class="checkbox-label">Consultation d'addictologie</span>
                </label>
              </div>

              <!-- Sous-options addictologie -->
              <div class="form-group-indent" *ngIf="formData.cadreConsultation.addictologie">
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input
                      type="checkbox"
                      [checked]="formData.cadreConsultation.addictologieType === 'SEVRAGE'"
                      (change)="onAddictologieTypeChange('SEVRAGE')"
                      name="addictologie_sevrage"
                    >
                    <span class="checkbox-label">1a. demande de sevrage</span>
                  </label>
                  <label class="checkbox-item">
                    <input
                      type="checkbox"
                      [checked]="formData.cadreConsultation.addictologieType === 'GESTION_ADDICTION'"
                      (change)="onAddictologieTypeChange('GESTION_ADDICTION')"
                      name="addictologie_gestion"
                    >
                    <span class="checkbox-label">1b. gestion d'une addiction sans substances ou autre</span>
                  </label>
                  <label class="checkbox-item">
                    <input
                      type="checkbox"
                      [checked]="formData.cadreConsultation.addictologieType === 'RISQUE_RECHUTE'"
                      (change)="onAddictologieTypeChange('RISQUE_RECHUTE')"
                      name="addictologie_risque"
                    >
                    <span class="checkbox-label">1c. risque de glissement ou de rechute</span>
                  </label>
                </div>
              </div>

              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.psychiatrie"
                    name="cadre_psychiatrie"
                  >
                  <span class="checkbox-label">Psychiatrie (troubles mentaux)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.psychologique"
                    name="cadre_psychologique"
                  >
                  <span class="checkbox-label">Consultation psychologique</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.medecineGenerale"
                    name="cadre_medecine"
                  >
                  <span class="checkbox-label">Médecine générale, médecine interne</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.neurologique"
                    name="cadre_neurologique"
                  >
                  <span class="checkbox-label">Troubles neurologiques</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.infectieux"
                    name="cadre_infectieux"
                  >
                  <span class="checkbox-label">Problèmes infectieux</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.espaceAmisJeunes"
                    name="cadre_espace_amis"
                  >
                  <span class="checkbox-label">Espace amis des jeunes</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.echangeMateriel"
                    name="cadre_echange"
                  >
                  <span class="checkbox-label">Échange/approvisionnement de matériels à usage unique</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.rehabilitation"
                    name="cadre_rehabilitation"
                  >
                  <span class="checkbox-label">Réhabilitation</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.urgenceMedicale"
                    name="cadre_urgence_medicale"
                  >
                  <span class="checkbox-label">Urgence médicale</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.urgenceChirurgicale"
                    name="cadre_urgence_chirurgicale"
                  >
                  <span class="checkbox-label">Urgence chirurgicale</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.depistage"
                    name="cadre_depistage"
                  >
                  <span class="checkbox-label">Dépistage</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.cadreConsultation.autre"
                    name="cadre_autre"
                  >
                  <span class="checkbox-label">Autre</span>
                </label>
              </div>

              <!-- Si autre, préciser -->
              <div class="form-group-indent" *ngIf="formData.cadreConsultation.autre">
                <label class="form-label required">13.a Si autre, préciser</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="formData.cadreConsultation.autrePrecision"
                  name="cadre_autre_precision"
                  required
                >
              </div>
            </div>

            <!-- Origine de la demande -->
            <div class="form-group">
              <label class="form-label required">Origine de la demande</label>
              
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.luiMeme"
                    name="origine_lui_meme"
                  >
                  <span class="checkbox-label">Lui-même</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.famille"
                    name="origine_famille"
                  >
                  <span class="checkbox-label">Famille</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.amis"
                    name="origine_amis"
                  >
                  <span class="checkbox-label">Amis</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.celluleEcoute"
                    name="origine_cellule"
                  >
                  <span class="checkbox-label">Cellule d'écoute de médecine scolaire et universitaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.autreCentre"
                    name="origine_autre_centre"
                  >
                  <span class="checkbox-label">Adressé par un autre centre</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.structureSociale"
                    name="origine_structure_sociale"
                  >
                  <span class="checkbox-label">Structure sociale</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.structureJudiciaire"
                    name="origine_structure_judiciaire"
                  >
                  <span class="checkbox-label">Structure judiciaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.jugeEnfance"
                    name="origine_juge_enfance"
                  >
                  <span class="checkbox-label">Le juge de l'enfance</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.origineDemande.autre"
                    name="origine_autre"
                  >
                  <span class="checkbox-label">Autre</span>
                </label>
              </div>

              <!-- Si autre, préciser -->
              <div class="form-group-indent" *ngIf="formData.origineDemande.autre">
                <label class="form-label required">Si autre, préciser</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="formData.origineDemande.autrePrecision"
                  name="origine_autre_precision"
                  required
                >
              </div>
            </div>

            <!-- Cause ou circonstance de l'abus -->
            <div class="form-group">
              <label class="form-label">9.a. LA CAUSE OU CIRCONSTANCE DE L'ABUS</label>
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
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.consultationAnterieure === true"
                    (change)="onConsultationAnterieureChange(true)"
                    name="consultation_anterieure_oui"
                  >
                  <span class="checkbox-label">1. Oui</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.consultationAnterieure === false"
                    (change)="onConsultationAnterieureChange(false)"
                    name="consultation_anterieure_non"
                  >
                  <span class="checkbox-label">2. Non</span>
                </label>
              </div>

              <!-- Si oui -->
              <div class="form-group-indent" *ngIf="formData.consultationAnterieure === true">
                <div class="form-group">
                  <label class="form-label required">10.a Date de la consultation antérieure (mois/année)</label>
                  <input
                    type="month"
                    class="form-input"
                    [(ngModel)]="formData.dateConsultationAnterieure"
                    name="dateConsultationAnterieure"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label required">10.b Motif de la consultation antérieure</label>
                  <select class="form-select" [(ngModel)]="formData.motifConsultationAnterieure" name="motifConsultationAnterieure" required>
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

                <!-- Si motif de récidive -->
                <div class="form-group-indent" *ngIf="formData.motifConsultationAnterieure === 'RECIDIVES'">
                  <label class="form-label required">10.c Si motif de récidive, cause de récidive</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.causeRecidive"
                    name="causeRecidive"
                    rows="3"
                    placeholder="Problème de soutien familial, scolaire, de l'entourage, problème social non résolu, mauvaise gestion des émotions, craving, influence des pairs, chômage et défaut d'occupation..."
                    required
                  ></textarea>
                </div>

                <!-- Si motif de sevrage -->
                <div class="form-group-indent" *ngIf="formData.motifConsultationAnterieure === 'SEVRAGE'">
                  <label class="form-label required">10.d Si motif de sevrage, cause de l'échec de sevrage</label>
                  <textarea
                    class="form-input"
                    [(ngModel)]="formData.causeEchecSevrage"
                    name="causeEchecSevrage"
                    rows="3"
                    placeholder="Non-observance du traitement, suivi interrompu, non convaincu de l'approche thérapeutique, séjour interrompu, maladie mentale sous-jacente, problème d'accessibilité..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Situation familiale -->
            <div class="form-group">
              <label class="form-label required">Situation familiale</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'CELIBATAIRE'"
                    (change)="onSituationFamilialeChange('CELIBATAIRE')"
                    name="situation_celibataire"
                  >
                  <span class="checkbox-label">Célibataire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'MARIE'"
                    (change)="onSituationFamilialeChange('MARIE')"
                    name="situation_marie"
                  >
                  <span class="checkbox-label">Marié(e)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'DIVORCE'"
                    (change)="onSituationFamilialeChange('DIVORCE')"
                    name="situation_divorce"
                  >
                  <span class="checkbox-label">Divorcé(e)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'SEPARE'"
                    (change)="onSituationFamilialeChange('SEPARE')"
                    name="situation_separe"
                  >
                  <span class="checkbox-label">Séparé(e)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'VEUF'"
                    (change)="onSituationFamilialeChange('VEUF')"
                    name="situation_veuf"
                  >
                  <span class="checkbox-label">Veuf(ve)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.situationFamiliale === 'AUTRE'"
                    (change)="onSituationFamilialeChange('AUTRE')"
                    name="situation_autre"
                  >
                  <span class="checkbox-label">Autre</span>
                </label>
              </div>

              <!-- Si autre, préciser -->
              <div class="form-group-indent" *ngIf="formData.situationFamiliale === 'AUTRE'">
                <label class="form-label required">11.a Si autre, préciser</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="formData.situationFamilialeAutre"
                  name="situationFamilialeAutre"
                  required
                >
              </div>
            </div>

            <!-- Logement durant les 30 derniers jours -->
            <div class="form-group">
              <label class="form-label required">Durant les 30 derniers jours précédant la consultation/dépistage, le patient vivait principalement</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'SEUL'"
                    (change)="onLogement30JoursChange('SEUL')"
                    name="logement_seul"
                  >
                  <span class="checkbox-label">Seul(e)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'FAMILLE_ORIGINE'"
                    (change)="onLogement30JoursChange('FAMILLE_ORIGINE')"
                    name="logement_famille"
                  >
                  <span class="checkbox-label">Avec sa famille d'origine (parents, etc.)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'PARTENAIRE'"
                    (change)="onLogement30JoursChange('PARTENAIRE')"
                    name="logement_partenaire"
                  >
                  <span class="checkbox-label">Avec son partenaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'ENFANTS'"
                    (change)="onLogement30JoursChange('ENFANTS')"
                    name="logement_enfants"
                  >
                  <span class="checkbox-label">Avec ses enfants</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'AMIS'"
                    (change)="onLogement30JoursChange('AMIS')"
                    name="logement_amis"
                  >
                  <span class="checkbox-label">Avec des amis ou d'autres personnes (sans relation familiale)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'INTERNAT'"
                    (change)="onLogement30JoursChange('INTERNAT')"
                    name="logement_internat"
                  >
                  <span class="checkbox-label">Dans un Internat</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'COLOCATION'"
                    (change)="onLogement30JoursChange('COLOCATION')"
                    name="logement_colocation"
                  >
                  <span class="checkbox-label">En colocation</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'FOYER'"
                    (change)="onLogement30JoursChange('FOYER')"
                    name="logement_foyer"
                  >
                  <span class="checkbox-label">Dans un foyer universitaire ou scolaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'DETENTION'"
                    (change)="onLogement30JoursChange('DETENTION')"
                    name="logement_detention"
                  >
                  <span class="checkbox-label">En détention</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'CENTRE_JEUNESSE'"
                    (change)="onLogement30JoursChange('CENTRE_JEUNESSE')"
                    name="logement_centre_jeunesse"
                  >
                  <span class="checkbox-label">Dans un centre intégré de la jeunesse</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'INSTITUTION'"
                    (change)="onLogement30JoursChange('INSTITUTION')"
                    name="logement_institution"
                  >
                  <span class="checkbox-label">En institution/refuge (pas de détention)</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.logement30Jours === 'AUTRE'"
                    (change)="onLogement30JoursChange('AUTRE')"
                    name="logement_autre"
                  >
                  <span class="checkbox-label">Autre</span>
                </label>
              </div>

              <!-- Si autre, préciser -->
              <div class="form-group-indent" *ngIf="formData.logement30Jours === 'AUTRE'">
                <label class="form-label required">12.a Si autre, préciser</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="formData.logement30JoursAutre"
                  name="logement30JoursAutre"
                  required
                >
              </div>
            </div>

            <!-- Nature de logement -->
            <div class="form-group">
              <label class="form-label required">Nature de logement</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.natureLogement === 'STABLE'"
                    (change)="onNatureLogementChange('STABLE')"
                    name="nature_stable"
                  >
                  <span class="checkbox-label">Logement stable</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.natureLogement === 'PRECAIRE'"
                    (change)="onNatureLogementChange('PRECAIRE')"
                    name="nature_precaire"
                  >
                  <span class="checkbox-label">Logement précaire/sans abri</span>
                </label>
              </div>
            </div>

            <!-- Profession -->
            <div class="form-group">
              <label class="form-label required">Profession</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'EMPLOYE'"
                    (change)="onProfessionChange('EMPLOYE')"
                    name="profession_employe"
                  >
                  <span class="checkbox-label">Employé</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'COMPTE_PROPRE'"
                    (change)="onProfessionChange('COMPTE_PROPRE')"
                    name="profession_compte_propre"
                  >
                  <span class="checkbox-label">Travaille pour son propre compte</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'JOURNALIER'"
                    (change)="onProfessionChange('JOURNALIER')"
                    name="profession_journalier"
                  >
                  <span class="checkbox-label">Journalier/travail irrégulier</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'SPORTIF'"
                    (change)="onProfessionChange('SPORTIF')"
                    name="profession_sportif"
                  >
                  <span class="checkbox-label">Sportif professionnel</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'CHOMAGE'"
                    (change)="onProfessionChange('CHOMAGE')"
                    name="profession_chomage"
                  >
                  <span class="checkbox-label">En chômage</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'ELEVE'"
                    (change)="onProfessionChange('ELEVE')"
                    name="profession_eleve"
                  >
                  <span class="checkbox-label">Élève</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'ETUDIANT'"
                    (change)="onProfessionChange('ETUDIANT')"
                    name="profession_etudiant"
                  >
                  <span class="checkbox-label">Étudiant</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'FORMATION'"
                    (change)="onProfessionChange('FORMATION')"
                    name="profession_formation"
                  >
                  <span class="checkbox-label">En formation professionnelle</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'RETRAITE'"
                    (change)="onProfessionChange('RETRAITE')"
                    name="profession_retraite"
                  >
                  <span class="checkbox-label">Retraité</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.profession === 'SANS_RESSOURCES'"
                    (change)="onProfessionChange('SANS_RESSOURCES')"
                    name="profession_sans_ressources"
                  >
                  <span class="checkbox-label">Sans ressources</span>
                </label>
              </div>
            </div>

            <!-- Niveau scolaire -->
            <div class="form-group">
              <label class="form-label required">Niveau scolaire</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'ANALPHABETE'"
                    (change)="onNiveauScolaireChange('ANALPHABETE')"
                    name="niveau_analphabete"
                  >
                  <span class="checkbox-label">Analphabète</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'PRESCOLAIRE'"
                    (change)="onNiveauScolaireChange('PRESCOLAIRE')"
                    name="niveau_prescolaire"
                  >
                  <span class="checkbox-label">Préscolaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'PRIMAIRE'"
                    (change)="onNiveauScolaireChange('PRIMAIRE')"
                    name="niveau_primaire"
                  >
                  <span class="checkbox-label">Primaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'COLLEGE'"
                    (change)="onNiveauScolaireChange('COLLEGE')"
                    name="niveau_college"
                  >
                  <span class="checkbox-label">Collège</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'SECONDAIRE'"
                    (change)="onNiveauScolaireChange('SECONDAIRE')"
                    name="niveau_secondaire"
                  >
                  <span class="checkbox-label">Secondaire</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'FORMATION_PROF'"
                    (change)="onNiveauScolaireChange('FORMATION_PROF')"
                    name="niveau_formation_prof"
                  >
                  <span class="checkbox-label">Formation professionnelle</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.niveauScolaire === 'UNIVERSITAIRE'"
                    (change)="onNiveauScolaireChange('UNIVERSITAIRE')"
                    name="niveau_universitaire"
                  >
                  <span class="checkbox-label">Universitaire</span>
                </label>
              </div>
            </div>

            <!-- Activité sportive -->
            <div class="form-group">
              <label class="form-label required">Est-ce que vous pratiquez une activité sportive ?</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.activiteSportive === true"
                    (change)="onActiviteSportiveChange(true)"
                    name="activite_sportive_oui"
                  >
                  <span class="checkbox-label">1. Oui</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [checked]="formData.activiteSportive === false"
                    (change)="onActiviteSportiveChange(false)"
                    name="activite_sportive_non"
                  >
                  <span class="checkbox-label">2. Non</span>
                </label>
              </div>

              <!-- Si oui -->
              <div class="form-group-indent" *ngIf="formData.activiteSportive === true">
                <div class="form-group">
                  <label class="form-label required">16.a) Si oui, vous pratiquez une activité sportive de façon</label>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.activiteSportiveFrequence === 'REGULIERE'"
                        (change)="onActiviteSportiveFrequenceChange('REGULIERE')"
                        name="frequence_reguliere"
                      >
                      <span class="checkbox-label">Régulière</span>
                    </label>
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.activiteSportiveFrequence === 'IRREGULIERE'"
                        (change)="onActiviteSportiveFrequenceChange('IRREGULIERE')"
                        name="frequence_irreguliere"
                      >
                      <span class="checkbox-label">Irrégulière</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">16.b) Si oui, vous pratiquez une activité sportive</label>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.activiteSportiveType === 'COMPETITION'"
                        (change)="onActiviteSportiveTypeChange('COMPETITION')"
                        name="type_competition"
                      >
                      <span class="checkbox-label">De compétition</span>
                    </label>
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.activiteSportiveType === 'LOISIR'"
                        (change)="onActiviteSportiveTypeChange('LOISIR')"
                        name="type_loisir"
                      >
                      <span class="checkbox-label">De loisir</span>
                    </label>
                  </div>
                </div>

                <!-- Si de compétition -->
                <div class="form-group-indent" *ngIf="formData.activiteSportiveType === 'COMPETITION'">
                  <label class="form-label required">16.b.1 (si de compétition), dopage</label>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.dopage === true"
                        (change)="onDopageChange(true)"
                        name="dopage_oui"
                      >
                      <span class="checkbox-label">1. Oui</span>
                    </label>
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        [checked]="formData.dopage === false"
                        (change)="onDopageChange(false)"
                        name="dopage_non"
                      >
                      <span class="checkbox-label">2. Non</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Espaces de loisirs -->
            <div class="form-group">
              <label class="form-label">Espaces de loisirs dans le quartier ou la zone de vie</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.espacesLoisirs"
                    name="espaces_loisirs"
                  >
                  <span class="checkbox-label">Oui</span>
                </label>
              </div>
            </div>

            <!-- Actions du formulaire -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!formulaireForm.valid || isSaving">
                <span *ngIf="!isSaving">Enregistrer</span>
                <span *ngIf="isSaving" class="flex items-center gap-2">
                  <div class="loading-spinner-sm"></div>
                  Enregistrement...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .formulaire-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: var(--spacing-6);
    }

    .page-header {
      margin-bottom: var(--spacing-8);
      text-align: center;
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

    .formulaire-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-6);
    }

    .form-group-indent {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 3px solid var(--primary-200);
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-4);
    }

    .form-group-indent .form-group {
      margin-bottom: var(--spacing-4);
    }

    .form-group-indent .form-group:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: var(--spacing-3);
      line-height: 1.4;
    }

    .form-label.required::after {
      content: ' *';
      color: var(--error-500);
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      font-size: 14px;
      line-height: 1.5;
      color: var(--gray-900);
      background-color: white;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-md);
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }

    .form-input[readonly] {
      background-color: var(--gray-100);
      color: var(--gray-600);
    }

    .form-help {
      display: block;
      margin-top: var(--spacing-1);
      font-size: 12px;
      color: var(--gray-500);
      font-style: italic;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-3);
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease-in-out;
    }

    .checkbox-item:hover {
      background-color: var(--gray-50);
    }

    .checkbox-item input[type="checkbox"] {
      margin: 0;
      width: 18px;
      height: 18px;
      accent-color: var(--primary-600);
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .checkbox-label {
      font-size: 14px;
      color: var(--gray-700);
      line-height: 1.4;
      cursor: pointer;
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
      margin-top: var(--spacing-8);
      padding-top: var(--spacing-6);
      border-top: 1px solid var(--gray-200);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .formulaire-container {
        padding: var(--spacing-4);
      }

      .form-group-indent {
        margin-left: var(--spacing-4);
        padding-left: var(--spacing-3);
      }

      .form-actions {
        flex-direction: column;
      }

      .checkbox-group {
        gap: var(--spacing-2);
      }

      .checkbox-item {
        padding: var(--spacing-3);
      }
    }
  `]
})
export class FormulaireComponent implements OnInit {
  formData: FormulaireData = {
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
    consommationSpaEntourage: null,
    consommationSpaPersonnelle: null,
    troublesAlimentaires: null,
    addictionJeux: null,
    addictionEcrans: null,
    comportementsSexuels: null
  };

  isSaving = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateIUN();
    this.initializeFormData();
  }

  private generateIUN(): void {
    // Générer un IUN temporaire pour la démo
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.formData.iun = `IUN${timestamp.slice(-6)}${random}`;
  }

  private initializeFormData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.structure) {
      this.formData.structure = currentUser.structure.nom;
      // Vous pouvez aussi pré-remplir d'autres champs selon la structure
    }
  }

  // Méthodes pour gérer les choix uniques avec checkboxes
  onSecteurChange(value: 'PUBLIC' | 'PRIVE' | 'SOCIETE_CIVILE_ONG'): void {
    this.formData.secteur = value;
    if (value !== 'SOCIETE_CIVILE_ONG') {
      this.formData.ongPrecision = undefined;
    }
  }

  onGenreChange(value: 'HOMME' | 'FEMME'): void {
    this.formData.genre = value;
  }

  onResidenceChange(value: 'TUNISIE' | 'ETRANGER'): void {
    this.formData.residence = value;
    if (value === 'ETRANGER') {
      this.formData.gouvernoratResidence = undefined;
      this.formData.delegationResidence = undefined;
    } else {
      this.formData.paysResidence = undefined;
    }
  }

  onAddictologieTypeChange(value: 'SEVRAGE' | 'GESTION_ADDICTION' | 'RISQUE_RECHUTE'): void {
    this.formData.cadreConsultation.addictologieType = value;
  }

  onConsultationAnterieureChange(value: boolean): void {
    this.formData.consultationAnterieure = value;
    if (!value) {
      this.formData.dateConsultationAnterieure = undefined;
      this.formData.motifConsultationAnterieure = undefined;
      this.formData.causeRecidive = undefined;
      this.formData.causeEchecSevrage = undefined;
    }
  }

  onSituationFamilialeChange(value: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'SEPARE' | 'VEUF' | 'AUTRE'): void {
    this.formData.situationFamiliale = value;
    if (value !== 'AUTRE') {
      this.formData.situationFamilialeAutre = undefined;
    }
  }

  onLogement30JoursChange(value: 'SEUL' | 'FAMILLE_ORIGINE' | 'PARTENAIRE' | 'ENFANTS' | 'AMIS' | 'INTERNAT' | 'COLOCATION' | 'FOYER' | 'DETENTION' | 'CENTRE_JEUNESSE' | 'INSTITUTION' | 'AUTRE'): void {
    this.formData.logement30Jours = value;
    if (value !== 'AUTRE') {
      this.formData.logement30JoursAutre = undefined;
    }
  }

  onNatureLogementChange(value: 'STABLE' | 'PRECAIRE'): void {
    this.formData.natureLogement = value;
  }

  onProfessionChange(value: 'EMPLOYE' | 'COMPTE_PROPRE' | 'JOURNALIER' | 'SPORTIF' | 'CHOMAGE' | 'ELEVE' | 'ETUDIANT' | 'FORMATION' | 'RETRAITE' | 'SANS_RESSOURCES'): void {
    this.formData.profession = value;
  }

  onNiveauScolaireChange(value: 'ANALPHABETE' | 'PRESCOLAIRE' | 'PRIMAIRE' | 'COLLEGE' | 'SECONDAIRE' | 'FORMATION_PROF' | 'UNIVERSITAIRE'): void {
    this.formData.niveauScolaire = value;
  }

  onActiviteSportiveChange(value: boolean): void {
    this.formData.activiteSportive = value;
    if (!value) {
      this.formData.activiteSportiveFrequence = undefined;
      this.formData.activiteSportiveType = undefined;
      this.formData.dopage = undefined;
    }
  }

  onActiviteSportiveFrequenceChange(value: 'REGULIERE' | 'IRREGULIERE'): void {
    this.formData.activiteSportiveFrequence = value;
  }

  onActiviteSportiveTypeChange(value: 'COMPETITION' | 'LOISIR'): void {
    this.formData.activiteSportiveType = value;
    if (value !== 'COMPETITION') {
      this.formData.dopage = undefined;
    }
  }

  onDopageChange(value: boolean): void {
    this.formData.dopage = value;
  }

  onSubmit(): void {
    if (!this.isSaving) {
      this.isSaving = true;
      
      // Simulation de l'enregistrement
      setTimeout(() => {
        console.log('Données du formulaire:', this.formData);
        this.isSaving = false;
        
        // Redirection vers la liste des formulaires
        this.router.navigate(['/mes-formulaires']);
      }, 2000);
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
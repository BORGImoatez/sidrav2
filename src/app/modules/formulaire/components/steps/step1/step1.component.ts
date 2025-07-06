import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Partie 1 : Informations sur la structure/centre de prise en charge & l'usager de SPA</h2>
        <p class="step-description">
          Renseignez les informations sur la structure et l'usager SPA
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- IUN (réservé) -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">IUN</label>
              <input 
                type="text" 
                class="form-input"
                value="(réservé à l'INSP, identifiant unique national généré systématiquement par la plateforme)"
                disabled
                readonly
              >
              <div class="field-help">Identifiant unique national généré automatiquement</div>
            </div>
          </div>

          <!-- 1. Secteur -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">1) Secteur</label>
              <div class="checkbox-options">
                <label class="checkbox-label" [class.error]="showErrors && !localData.secteur">
                  <input 
                    type="radio" 
                    name="secteur"
                    value="PUBLIC"
                    [(ngModel)]="localData.secteur"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">1. Public</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.secteur">
                  <input 
                    type="radio" 
                    name="secteur"
                    value="PRIVE"
                    [(ngModel)]="localData.secteur"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">2. Privé</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.secteur">
                  <input 
                    type="radio" 
                    name="secteur"
                    value="ONG"
                    [(ngModel)]="localData.secteur"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">3. Société civile (ONG)</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.secteur" class="form-error">
                Veuillez sélectionner un secteur
              </div>
            </div>

            <!-- 1.a Si ONG, préciser -->
            <div class="form-group sub-field" *ngIf="localData.secteur === 'ONG'">
              <label class="form-label required">1.a) Si ONG, préciser</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.ongPrecision"
                name="ongPrecision"
                [class.error]="showErrors && localData.secteur === 'ONG' && !localData.ongPrecision"
                (change)="onFieldChange()"
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
              <div *ngIf="showErrors && localData.secteur === 'ONG' && !localData.ongPrecision" class="form-error">
                Veuillez préciser l'ONG
              </div>
            </div>
          </div>

          <!-- 2. Ministère -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">2) Ministère</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.ministere"
                name="ministere"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner un ministère</option>
                <option value="SANTE">Ministère de la Santé</option>
                <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                <option value="EDUCATION">Ministère de l'Éducation</option>
                <option value="JEUNESSE_SPORT">Ministère de la Jeunesse et du Sport</option>
                <option value="JUSTICE">Ministère de la Justice</option>
              </select>
            </div>
          </div>

          <!-- 3. Structure/Centre -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">3) Structure / Centre</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.structure"
                name="structure"
                [class.error]="showErrors && !localData.structure"
                (change)="onFieldChange()"
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
                <option value="CSB">CSB</option>
                <option value="SERVICE_MEDICAL_PENITENTIAIRE">Service médical en milieu pénitentiaire</option>
              </select>
              <div *ngIf="showErrors && !localData.structure" class="form-error">
                Veuillez sélectionner une structure
              </div>
            </div>

            <!-- 3.a Gouvernorat de la structure -->
            <div class="form-group sub-field">
              <label class="form-label required">3.a) Préciser le gouvernorat de la Structure/Centre</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.gouvernoratStructure"
                name="gouvernoratStructure"
                [class.error]="showErrors && !localData.gouvernoratStructure"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner un gouvernorat</option>
                <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
              </select>
              <div *ngIf="showErrors && !localData.gouvernoratStructure" class="form-error">
                Veuillez sélectionner le gouvernorat de la structure
              </div>
            </div>
          </div>

          <!-- Informations patient -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">Nom</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.nom"
                name="nom"
                [class.error]="showErrors && !localData.nom"
                placeholder="Nom de famille"
                (input)="onFieldChange()"
              >
              <div *ngIf="showErrors && !localData.nom" class="form-error">
                Veuillez saisir le nom
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">Prénom</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.prenom"
                name="prenom"
                [class.error]="showErrors && !localData.prenom"
                placeholder="Prénom"
                (input)="onFieldChange()"
              >
              <div *ngIf="showErrors && !localData.prenom" class="form-error">
                Veuillez saisir le prénom
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">Code du patient</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.codePatient"
                name="codePatient"
                [class.error]="showErrors && !localData.codePatient"
                placeholder="Code d'identification du patient"
                (input)="onFieldChange()"
              >
              <div *ngIf="showErrors && !localData.codePatient" class="form-error">
                Veuillez saisir le code patient
              </div>
            </div>
          </div>

          <!-- 4. Date de consultation -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">4) Date de la consultation/entretien</label>
              <input 
                type="date" 
                class="form-input"
                [(ngModel)]="localData.dateConsultation"
                name="dateConsultation"
                [class.error]="showErrors && !localData.dateConsultation"
                (change)="onFieldChange()"
              >
              <div *ngIf="showErrors && !localData.dateConsultation" class="form-error">
                Veuillez saisir la date de consultation
              </div>
            </div>
          </div>

          <!-- 5. Genre -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">5) Genre</label>
              <div class="radio-options">
                <label class="radio-label" [class.error]="showErrors && !localData.genre">
                  <input 
                    type="radio" 
                    name="genre"
                    value="HOMME"
                    [(ngModel)]="localData.genre"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Homme</span>
                </label>
                <label class="radio-label" [class.error]="showErrors && !localData.genre">
                  <input 
                    type="radio" 
                    name="genre"
                    value="FEMME"
                    [(ngModel)]="localData.genre"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Femme</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.genre" class="form-error">
                Veuillez sélectionner le genre
              </div>
            </div>
          </div>

          <!-- 6. Date de naissance -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">6) Date de naissance complète</label>
              <input 
                type="date" 
                class="form-input"
                [(ngModel)]="localData.dateNaissance"
                name="dateNaissance"
                [class.error]="showErrors && !localData.dateNaissance"
                (change)="onFieldChange()"
              >
              <div *ngIf="showErrors && !localData.dateNaissance" class="form-error">
                Veuillez saisir la date de naissance
              </div>
            </div>
          </div>

          <!-- 7. Nationalité -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">7) Nationalité</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.nationalite"
                name="nationalite"
                [class.error]="showErrors && !localData.nationalite"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner une nationalité</option>
                <option value="TUNISIENNE">Tunisienne</option>
                <option value="ALGERIENNE">Algérienne</option>
                <option value="MAROCAINE">Marocaine</option>
                <option value="LIBYENNE">Libyenne</option>
                <option value="FRANCAISE">Française</option>
                <option value="AUTRE">Autre</option>
              </select>
              <div *ngIf="showErrors && !localData.nationalite" class="form-error">
                Veuillez sélectionner la nationalité
              </div>
            </div>
          </div>

          <!-- 8. Résidence -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">8) Résidence</label>
              <div class="radio-options">
                <label class="radio-label" [class.error]="showErrors && !localData.residence">
                  <input 
                    type="radio" 
                    name="residence"
                    value="TUNISIE"
                    [(ngModel)]="localData.residence"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. En Tunisie</span>
                </label>
                <label class="radio-label" [class.error]="showErrors && !localData.residence">
                  <input 
                    type="radio" 
                    name="residence"
                    value="ETRANGER"
                    [(ngModel)]="localData.residence"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. À l'étranger</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.residence" class="form-error">
                Veuillez sélectionner le lieu de résidence
              </div>
            </div>

            <!-- 8.a Gouvernorat (si en Tunisie) -->
            <div class="form-group sub-field" *ngIf="localData.residence === 'TUNISIE'">
              <label class="form-label required">8.a) Gouvernorat</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.gouvernoratResidence"
                name="gouvernoratResidence"
                [class.error]="showErrors && localData.residence === 'TUNISIE' && !localData.gouvernoratResidence"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner un gouvernorat</option>
                <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
              </select>
              <div *ngIf="showErrors && localData.residence === 'TUNISIE' && !localData.gouvernoratResidence" class="form-error">
                Veuillez sélectionner le gouvernorat de résidence
              </div>
            </div>

            <!-- 8.b Délégation (si en Tunisie) -->
            <div class="form-group sub-field" *ngIf="localData.residence === 'TUNISIE' && localData.gouvernoratResidence">
              <label class="form-label">8.b) Délégation</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.delegationResidence"
                name="delegationResidence"
                placeholder="Délégation"
                (input)="onFieldChange()"
              >
            </div>

            <!-- 8.c Pays (si à l'étranger) -->
            <div class="form-group sub-field" *ngIf="localData.residence === 'ETRANGER'">
              <label class="form-label required">8.c) Pays</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.paysResidence"
                name="paysResidence"
                [class.error]="showErrors && localData.residence === 'ETRANGER' && !localData.paysResidence"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner un pays</option>
                <option value="ALGERIE">Algérie</option>
                <option value="MAROC">Maroc</option>
                <option value="LIBYE">Libye</option>
                <option value="FRANCE">France</option>
                <option value="ITALIE">Italie</option>
                <option value="ALLEMAGNE">Allemagne</option>
                <option value="AUTRE">Autre</option>
              </select>
              <div *ngIf="showErrors && localData.residence === 'ETRANGER' && !localData.paysResidence" class="form-error">
                Veuillez sélectionner le pays de résidence
              </div>
            </div>
          </div>

          <!-- 9. Cadre de consultation -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">9) Cadre de la consultation/entretien</label>
              
              <div class="checkbox-list">
                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.addictologie"
                      name="addictologie"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">1. Consultation d'addictologie</span>
                  </label>
                  
                  <!-- Sous-options pour addictologie -->
                  <div class="sub-options" *ngIf="localData.cadreConsultation!.addictologie">
                    <div class="sub-checkbox-item">
                      <label class="checkbox-label">
                        <input 
                          type="radio" 
                          name="addictologieType"
                          value="SEVRAGE"
                          [(ngModel)]="localData.cadreConsultation!.addictologieType"
                          (change)="onFieldChange()"
                        >
                        <span class="checkbox-text">1.a) demande de sevrage</span>
                      </label>
                    </div>
                    <div class="sub-checkbox-item">
                      <label class="checkbox-label">
                        <input 
                          type="radio" 
                          name="addictologieType"
                          value="GESTION_ADDICTION"
                          [(ngModel)]="localData.cadreConsultation!.addictologieType"
                          (change)="onFieldChange()"
                        >
                        <span class="checkbox-text">1.b) gestion d'une addiction sans substances ou autre</span>
                      </label>
                    </div>
                    <div class="sub-checkbox-item">
                      <label class="checkbox-label">
                        <input 
                          type="radio" 
                          name="addictologieType"
                          value="RISQUE_RECHUTE"
                          [(ngModel)]="localData.cadreConsultation!.addictologieType"
                          (change)="onFieldChange()"
                        >
                        <span class="checkbox-text">1.c) risque de glissement ou de rechute</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.psychiatrie"
                      name="psychiatrie"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">2. Psychiatrie (troubles mentaux)</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.psychologique"
                      name="psychologique"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">3. Consultation psychologique</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.medecineGenerale"
                      name="medecineGenerale"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">4. Médecine générale, médecine interne</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.neurologique"
                      name="neurologique"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">5. Troubles neurologiques</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.infectieux"
                      name="infectieux"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">6. Problèmes infectieux</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.espaceAmisJeunes"
                      name="espaceAmisJeunes"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">7. Espace amis des jeunes</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.echangeMateriel"
                      name="echangeMateriel"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">8. Échange/approvisionnement de matériels à usage unique</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.rehabilitation"
                      name="rehabilitation"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">9. Réhabilitation</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.urgenceMedicale"
                      name="urgenceMedicale"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">10. Urgence médicale</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.urgenceChirurgicale"
                      name="urgenceChirurgicale"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">11. Urgence chirurgicale</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.depistage"
                      name="depistage"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">12. Dépistage</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="localData.cadreConsultation!.autre"
                      name="cadreAutre"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">13. Autre</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.cadreConsultation!.autre">
                    <label class="form-label required">13.a) Si autre, préciser</label>
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.cadreConsultation!.autrePrecision"
                      name="cadreAutrePrecision"
                      [class.error]="showErrors && localData.cadreConsultation!.autre && !localData.cadreConsultation!.autrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                    >
                    <div *ngIf="showErrors && localData.cadreConsultation!.autre && !localData.cadreConsultation!.autrePrecision" class="form-error">
                      Veuillez préciser le cadre de consultation
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="showErrors && !isCadreConsultationSelected()" class="form-error">
                Veuillez sélectionner au moins un cadre de consultation
              </div>
            </div>
          </div>

          <!-- 10. Origine de la demande -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">10) Origine de la demande</label>
              
              <div class="origin-list">
                <div class="origin-item">
                  <span class="origin-label">1. lui-même</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineLuiMeme"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.luiMeme"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineLuiMeme"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.luiMeme"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">2. Famille</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineFamille"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.famille"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineFamille"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.famille"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">3. Amis</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAmis"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.amis"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAmis"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.amis"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">4. Cellule d'écoute de médecine scolaire et universitaire</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineCelluleEcoute"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.celluleEcoute"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineCelluleEcoute"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.celluleEcoute"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">5. Adressé par un autre centre</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAutreCentre"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.autreCentre"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAutreCentre"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.autreCentre"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">6. Structure sociale</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineStructureSociale"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.structureSociale"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineStructureSociale"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.structureSociale"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">7. Structure judiciaire</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineStructureJudiciaire"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.structureJudiciaire"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineStructureJudiciaire"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.structureJudiciaire"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">8. Autre</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAutre"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.autre"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineAutre"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.autre"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <div class="origin-item">
                  <span class="origin-label">9. Le juge de l'enfance</span>
                  <div class="radio-options">
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineJugeEnfance"
                        [value]="true"
                        [(ngModel)]="localData.origineDemande!.jugeEnfance"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">1. Oui</span>
                    </label>
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        name="origineJugeEnfance"
                        [value]="false"
                        [(ngModel)]="localData.origineDemande!.jugeEnfance"
                        (change)="onFieldChange()"
                      >
                      <span class="radio-text">2. Non</span>
                    </label>
                  </div>
                </div>

                <!-- 10. Si autre, préciser -->
                <div class="origin-item sub-field" *ngIf="localData.origineDemande!.autre">
                  <label class="form-label required">10. Si autre, préciser</label>
                  <input 
                    type="text" 
                    class="form-input"
                    [(ngModel)]="localData.origineDemande!.autrePrecision"
                    name="origineAutrePrecision"
                    [class.error]="showErrors && localData.origineDemande!.autre && !localData.origineDemande!.autrePrecision"
                    placeholder="Préciser l'origine de la demande"
                    (input)="onFieldChange()"
                  >
                  <div *ngIf="showErrors && localData.origineDemande!.autre && !localData.origineDemande!.autrePrecision" class="form-error">
                    Veuillez préciser l'origine de la demande
                  </div>
                </div>
              </div>
              
              <div *ngIf="showErrors && !isOrigineDemandeSelected()" class="form-error">
                Veuillez répondre à au moins une origine de la demande
              </div>
            </div>
          </div>

          <!-- Validation errors summary -->
          <div *ngIf="showErrors && !isStepValid()" class="validation-summary">
            <h4 class="validation-title">⚠️ Veuillez compléter les champs obligatoires suivants :</h4>
            <ul class="validation-list">
              <li *ngIf="!localData.secteur">Secteur</li>
              <li *ngIf="localData.secteur === 'ONG' && !localData.ongPrecision">Précision ONG</li>
              <li *ngIf="!localData.structure">Structure / Centre</li>
              <li *ngIf="!localData.gouvernoratStructure">Gouvernorat de la structure</li>
              <li *ngIf="!localData.nom">Nom</li>
              <li *ngIf="!localData.prenom">Prénom</li>
              <li *ngIf="!localData.codePatient">Code du patient</li>
              <li *ngIf="!localData.dateConsultation">Date de consultation</li>
              <li *ngIf="!localData.genre">Genre</li>
              <li *ngIf="!localData.dateNaissance">Date de naissance</li>
              <li *ngIf="!localData.nationalite">Nationalité</li>
              <li *ngIf="!localData.residence">Résidence</li>
              <li *ngIf="localData.residence === 'TUNISIE' && !localData.gouvernoratResidence">Gouvernorat de résidence</li>
              <li *ngIf="localData.residence === 'ETRANGER' && !localData.paysResidence">Pays de résidence</li>
              <li *ngIf="!isCadreConsultationSelected()">Cadre de consultation</li>
              <li *ngIf="localData.cadreConsultation!.autre && !localData.cadreConsultation!.autrePrecision">Précision cadre de consultation</li>
              <li *ngIf="!isOrigineDemandeSelected()">Origine de la demande</li>
              <li *ngIf="localData.origineDemande!.autre && !localData.origineDemande!.autrePrecision">Précision origine de la demande</li>
            </ul>
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
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: var(--spacing-6);
    }

    .form-section:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .form-group {
      margin-bottom: var(--spacing-6);
    }

    .sub-field {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 3px solid var(--primary-200);
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
    }

    .field-help {
      font-size: 12px;
      color: var(--gray-500);
      margin-top: var(--spacing-2);
      font-style: italic;
    }

    /* Radio buttons styling */
    .radio-options {
      display: flex;
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      cursor: pointer;
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease-in-out;
      border: 1px solid transparent;
    }

    .radio-label:hover {
      background-color: var(--gray-50);
    }

    .radio-label.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .radio-label input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .radio-text {
      font-weight: 500;
      color: var(--gray-700);
    }

    /* Checkbox styling */
    .checkbox-options {
      display: flex;
      flex-direction: column;
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
      border: 1px solid transparent;
    }

    .checkbox-label:hover {
      background-color: var(--gray-50);
    }

    .checkbox-label.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .checkbox-label input[type="checkbox"],
    .checkbox-label input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .checkbox-text {
      font-weight: 500;
      color: var(--gray-700);
    }

    /* Checkbox list for cadre consultation */
    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .checkbox-item {
      display: flex;
      flex-direction: column;
    }

    .sub-options {
      margin-left: var(--spacing-6);
      margin-top: var(--spacing-3);
      padding: var(--spacing-4);
      background-color: var(--gray-50);
      border-radius: var(--radius-md);
      border-left: 3px solid var(--primary-200);
    }

    .sub-checkbox-item {
      margin-bottom: var(--spacing-2);
    }

    /* Origin list styling */
    .origin-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .origin-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      padding: var(--spacing-4);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background-color: var(--gray-50);
    }

    .origin-label {
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: var(--spacing-2);
    }

    /* Error styling */
    .form-input.error,
    .form-select.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .form-input.error:focus,
    .form-select.error:focus {
      box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
    }

    .form-error {
      margin-top: var(--spacing-2);
      font-size: 12px;
      color: var(--error-600);
      font-weight: 500;
    }

    /* Validation summary */
    .validation-summary {
      margin-top: var(--spacing-6);
      padding: var(--spacing-6);
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
      border-radius: var(--radius-md);
    }

    .validation-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--error-700);
      margin: 0 0 var(--spacing-4) 0;
    }

    .validation-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .validation-list li {
      padding: var(--spacing-2) 0;
      color: var(--error-600);
      font-weight: 500;
    }

    .validation-list li::before {
      content: "• ";
      color: var(--error-500);
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .radio-options {
        flex-direction: column;
      }
      
      .sub-field {
        margin-left: 0;
      }
      
      .sub-options {
        margin-left: var(--spacing-4);
      }
    }
  `]
})
export class Step1Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};
  showErrors = false;

  gouvernorats = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
  ];

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.localData = {
      ...this.data,
      cadreConsultation: this.data.cadreConsultation || {},
      origineDemande: this.data.origineDemande || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  private validateStep(): void {
    const isValid = this.isStepValid();
    this.validationChange.emit(isValid);
  }

  isStepValid(): boolean {
    const required = [
      'secteur', 'structure', 'gouvernoratStructure', 'nom', 'prenom',
      'codePatient', 'dateConsultation', 'genre', 'dateNaissance',
      'nationalite', 'residence'
    ];

    // Check conditional required fields
    if (this.localData.secteur === 'ONG' && !this.localData.ongPrecision) {
      return false;
    }

    if (this.localData.residence === 'TUNISIE' && !this.localData.gouvernoratResidence) {
      return false;
    }

    if (this.localData.residence === 'ETRANGER' && !this.localData.paysResidence) {
      return false;
    }

    // Check if cadre consultation "autre" is selected but not specified
    if (this.localData.cadreConsultation?.autre && !this.localData.cadreConsultation?.autrePrecision) {
      return false;
    }

    // Check if origine demande "autre" is selected but not specified
    if (this.localData.origineDemande?.autre && !this.localData.origineDemande?.autrePrecision) {
      return false;
    }

    // Check basic required fields
    const basicFieldsValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    // Check if at least one cadre de consultation is selected
    const cadreSelected = this.isCadreConsultationSelected();
    
    // Check if at least one origine de demande is selected
    const origineSelected = this.isOrigineDemandeSelected();

    return basicFieldsValid && cadreSelected && origineSelected;
  }

  isCadreConsultationSelected(): boolean {
    return Object.values(this.localData.cadreConsultation || {}).some(value => value === true);
  }

  isOrigineDemandeSelected(): boolean {
    return Object.values(this.localData.origineDemande || {}).some(value => value === true || value === false);
  }

  // Method to trigger validation display when user tries to proceed
  showValidationErrors(): void {
    this.showErrors = true;
  }
}
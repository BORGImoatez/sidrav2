import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../models/formulaire.model';

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

          <!-- 2. Ministère (seulement si secteur PUBLIC) -->
          <div class="form-section" *ngIf="localData.secteur === 'PUBLIC'">
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
                      type="radio" 
                      name="cadreConsultation"
                      value="addictologie"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('addictologie')"
                    >
                    <span class="checkbox-text">1. Consultation d'addictologie</span>
                  </label>
                  
                  <!-- Sous-options pour addictologie -->
                  <div class="sub-options" *ngIf="localData.cadreConsultationPrincipal === 'addictologie'">
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
                      type="radio" 
                      name="cadreConsultation"
                      value="psychiatrie"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('psychiatrie')"
                    >
                    <span class="checkbox-text">2. Psychiatrie (troubles mentaux)</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="psychologique"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('psychologique')"
                    >
                    <span class="checkbox-text">3. Consultation psychologique</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="medecineGenerale"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('medecineGenerale')"
                    >
                    <span class="checkbox-text">4. Médecine générale, médecine interne</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="neurologique"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('neurologique')"
                    >
                    <span class="checkbox-text">5. Troubles neurologiques</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="infectieux"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('infectieux')"
                    >
                    <span class="checkbox-text">6. Problèmes infectieux</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="espaceAmisJeunes"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('espaceAmisJeunes')"
                    >
                    <span class="checkbox-text">7. Espace amis des jeunes</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="echangeMateriel"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('echangeMateriel')"
                    >
                    <span class="checkbox-text">8. Échange/approvisionnement de matériels à usage unique</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="rehabilitation"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('rehabilitation')"
                    >
                    <span class="checkbox-text">9. Réhabilitation</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="urgenceMedicale"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('urgenceMedicale')"
                    >
                    <span class="checkbox-text">10. Urgence médicale</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="urgenceChirurgicale"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('urgenceChirurgicale')"
                    >
                    <span class="checkbox-text">11. Urgence chirurgicale</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="depistage"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('depistage')"
                    >
                    <span class="checkbox-text">12. Dépistage</span>
                  </label>
                </div>

                <div class="checkbox-item">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="cadreConsultation"
                      value="autre"
                      [(ngModel)]="localData.cadreConsultationPrincipal"
                      (change)="onCadreConsultationChange('autre')"
                    >
                    <span class="checkbox-text">13. Autre</span>
                  </label>
                  
                  <div class="sub-options" *ngIf="localData.cadreConsultationPrincipal === 'autre'">
                    <label class="form-label required">13.a) Si autre, préciser</label>
                    <input 
                      type="text" 
                      class="form-input"
                      [(ngModel)]="localData.cadreConsultation!.autrePrecision"
                      name="cadreAutrePrecision"
                      [class.error]="showErrors && localData.cadreConsultationPrincipal === 'autre' && !localData.cadreConsultation!.autrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                    >
                    <div *ngIf="showErrors && localData.cadreConsultationPrincipal === 'autre' && !localData.cadreConsultation!.autrePrecision" class="form-error">
                      Veuillez préciser le cadre de consultation
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="showErrors && !localData.cadreConsultationPrincipal" class="form-error">
                Veuillez sélectionner un cadre de consultation
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

          <!-- 10.a Cause ou circonstance de l'abus -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">10.a) LA CAUSE OU CIRCONSTANCE DE L'ABUS</label>
              <select 
                class="form-input"
                [(ngModel)]="localData.causeCirconstance"
                name="causeCirconstance"
                (change)="onFieldChange()"
              >
                <option value="">Sélectionner une cause</option>
                <option value="PROBLEME_SOCIAL">Problème social</option>
                <option value="PROBLEME_FINANCIER">Problème financier</option>
                <option value="PROBLEME_FAMILIAL">Problème familial</option>
                <option value="PROBLEME_SANTE_MENTALE">Problème de santé mentale</option>
                <option value="ADOLESCENCE">Adolescence</option>
              </select>
            </div>
          </div>

          <!-- 11. Consultation antérieure -->
          <div class="form-section">
            <div class="form-group">
              <span class="origin-label">11) Consultation antérieure</span>
              <div class="radio-options">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    name="consultationAnterieure"
                    [value]="true"
                    [(ngModel)]="localData.consultationAnterieure"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-label">
                  <input 
                    type="radio" 
                    name="consultationAnterieure"
                    [value]="false"
                    [(ngModel)]="localData.consultationAnterieure"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Si consultation antérieure = Oui -->
            <div class="sub-field" *ngIf="localData.consultationAnterieure">
              <div class="form-group">
                <label class="form-label">11.a) Date de la consultation antérieure (mois/année)</label>
                <input 
                  type="month" 
                  class="form-input"
                  [(ngModel)]="localData.dateConsultationAnterieure"
                  name="dateConsultationAnterieure"
                  (change)="onFieldChange()"
                >
              </div>

              <div class="form-group">
                <label class="form-label">11.b) Motif de la consultation antérieure</label>
                <select 
                  class="form-input"
                  [(ngModel)]="localData.motifConsultationAnterieure"
                  name="motifConsultationAnterieure"
                  (change)="onFieldChange()"
                >
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

              <!-- Si motif = récidive -->
              <div class="form-group" *ngIf="localData.motifConsultationAnterieure === 'RECIDIVES'">
                <label class="form-label">11.c) Si récidive, cause de récidive</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="localData.causeRecidive"
                  name="causeRecidive"
                  placeholder="Problème de soutien familial, scolaire, entourage, problème social non résolu, mauvaise gestion des émotions, craving, influence des pairs, chômage..."
                  rows="3"
                  (input)="onFieldChange()"
                ></textarea>
              </div>

              <!-- Si motif = sevrage -->
              <div class="form-group" *ngIf="localData.motifConsultationAnterieure === 'SEVRAGE'">
                <label class="form-label">11.d) Si sevrage, cause de l'échec de sevrage</label>
                <select 
                  class="form-input"
                  [(ngModel)]="localData.causeEchecSevrage"
                  name="causeEchecSevrage"
                  (change)="onFieldChange()"
                >
                  <option value="">Sélectionner une cause</option>
                  <option value="NON_OBSERVANCE">Non-observance du traitement</option>
                  <option value="SUIVI_INTERROMPU">Suivi interrompu</option>
                  <option value="NON_CONVAINCU">Non convaincu de l'approche thérapeutique</option>
                  <option value="SEJOUR_INTERROMPU">Séjour interrompu</option>
                  <option value="MALADIE_MENTALE">Maladie mentale sous-jacente</option>
                  <option value="PROBLEME_ACCESSIBILITE">Problème d'accessibilité financière ou géographique</option>
                  <option value="AUTRES">Autres</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 12. Situation familiale -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">12) Situation familiale</label>
              <div class="checkbox-options">
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="CELIBATAIRE"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">1. Célibataire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="MARIE"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">2. Marié(e)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="DIVORCE"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">3. Divorcé(e)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="SEPARE"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">4. Séparé(e)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="VEUF"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">5. Veuf(ve)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.situationFamiliale">
                  <input 
                    type="radio" 
                    name="situationFamiliale"
                    value="AUTRE"
                    [(ngModel)]="localData.situationFamiliale"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">6. Autre</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.situationFamiliale" class="form-error">
                Veuillez sélectionner la situation familiale
              </div>
            </div>

            <!-- 12.a Si autre, préciser -->
            <div class="form-group sub-field" *ngIf="localData.situationFamiliale === 'AUTRE'">
              <label class="form-label required">12.a) Si autre, préciser</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.situationFamilialeAutre"
                name="situationFamilialeAutre"
                [class.error]="showErrors && localData.situationFamiliale === 'AUTRE' && !localData.situationFamilialeAutre"
                placeholder="Préciser la situation familiale"
                (input)="onFieldChange()"
              >
              <div *ngIf="showErrors && localData.situationFamiliale === 'AUTRE' && !localData.situationFamilialeAutre" class="form-error">
                Veuillez préciser la situation familiale
              </div>
            </div>
          </div>

          <!-- 13. Logement 30 derniers jours -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">13) Durant les 30 derniers jours précédant la consultation/dépistage, le patient vivait principalement</label>
              <div class="checkbox-options">
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="SEUL"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">1. Seul(e)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="FAMILLE_ORIGINE"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">2. Avec sa famille d'origine (parents, etc.)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="PARTENAIRE"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">3. Avec son partenaire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="ENFANTS"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">4. Avec ses enfants</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="AMIS"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">5. Avec des amis ou d'autres personnes (sans relation familiale)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="INTERNAT"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">6. Dans un Internat</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="COLOCATION"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">7. En colocation</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="FOYER"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">8. Dans un foyer universitaire ou scolaire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="DETENTION"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">9. En détention</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="CENTRE_JEUNESSE"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">10. Dans un centre intégré de la jeunesse</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="INSTITUTION"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">11. En institution/refuge (pas de détention)</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.logement30Jours">
                  <input 
                    type="radio" 
                    name="logement30Jours"
                    value="AUTRE"
                    [(ngModel)]="localData.logement30Jours"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">12. Autre</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.logement30Jours" class="form-error">
                Veuillez sélectionner le type de logement
              </div>
            </div>

            <!-- 13.a Si autre, préciser -->
            <div class="form-group sub-field" *ngIf="localData.logement30Jours === 'AUTRE'">
              <label class="form-label required">13.a) Si autre, préciser</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="localData.logement30JoursAutre"
                name="logement30JoursAutre"
                [class.error]="showErrors && localData.logement30Jours === 'AUTRE' && !localData.logement30JoursAutre"
                placeholder="Préciser le type de logement"
                (input)="onFieldChange()"
              >
              <div *ngIf="showErrors && localData.logement30Jours === 'AUTRE' && !localData.logement30JoursAutre" class="form-error">
                Veuillez préciser le type de logement
              </div>
            </div>
          </div>

          <!-- 14. Nature de logement -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">14) Nature de logement</label>
              <div class="radio-options">
                <label class="radio-label" [class.error]="showErrors && !localData.natureLogement">
                  <input 
                    type="radio" 
                    name="natureLogement"
                    value="STABLE"
                    [(ngModel)]="localData.natureLogement"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Logement stable</span>
                </label>
                <label class="radio-label" [class.error]="showErrors && !localData.natureLogement">
                  <input 
                    type="radio" 
                    name="natureLogement"
                    value="PRECAIRE"
                    [(ngModel)]="localData.natureLogement"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Logement précaire/sans abri</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.natureLogement" class="form-error">
                Veuillez sélectionner la nature du logement
              </div>
            </div>
          </div>

          <!-- 15. Profession -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">15) Profession</label>
              <div class="checkbox-options">
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="EMPLOYE"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">1. Employé</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="COMPTE_PROPRE"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">2. Travaille pour son propre compte</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="JOURNALIER"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">3. Journalier/travail irrégulier</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="SPORTIF"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">4. Sportif professionnel</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="CHOMAGE"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">5. En chômage</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="ELEVE"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">6. Élève</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="ETUDIANT"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">7. Étudiant</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="FORMATION"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">8. En formation professionnelle</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="RETRAITE"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">9. Retraité</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.profession">
                  <input 
                    type="radio" 
                    name="profession"
                    value="SANS_RESSOURCES"
                    [(ngModel)]="localData.profession"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">10. Sans ressources</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.profession" class="form-error">
                Veuillez sélectionner la profession
              </div>
            </div>
          </div>

          <!-- 16. Niveau scolaire -->
          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">16) Niveau scolaire</label>
              <div class="checkbox-options">
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="ANALPHABETE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">1. Analphabète</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="PRESCOLAIRE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">2. Préscolaire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="PRIMAIRE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">3. Primaire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="COLLEGE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">4. Collège</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="SECONDAIRE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">5. Secondaire</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="FORMATION_PROF"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">6. Formation professionnelle</span>
                </label>
                <label class="checkbox-label" [class.error]="showErrors && !localData.niveauScolaire">
                  <input 
                    type="radio" 
                    name="niveauScolaire"
                    value="UNIVERSITAIRE"
                    [(ngModel)]="localData.niveauScolaire"
                    (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">7. Universitaire</span>
                </label>
              </div>
              <div *ngIf="showErrors && !localData.niveauScolaire" class="form-error">
                Veuillez sélectionner le niveau scolaire
              </div>
            </div>
          </div>

          <!-- 17. Activité sportive -->
          <div class="form-section">
            <div class="form-group">
              <span class="origin-label">17) Est-ce que vous pratiquez une activité sportive ?</span>
              <div class="radio-options">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    name="activiteSportive"
                    [value]="true"
                    [(ngModel)]="localData.activiteSportive"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-label">
                  <input 
                    type="radio" 
                    name="activiteSportive"
                    [value]="false"
                    [(ngModel)]="localData.activiteSportive"
                    (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Si activité sportive = Oui -->
            <div class="sub-field" *ngIf="localData.activiteSportive">
              <div class="form-group">
                <span class="origin-label">17.a) Si oui, vous pratiquez une activité sportive de façon</span>
                <div class="radio-options">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="activiteSportiveFrequence"
                      value="REGULIERE"
                      [(ngModel)]="localData.activiteSportiveFrequence"
                      (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Régulière</span>
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="activiteSportiveFrequence"
                      value="IRREGULIERE"
                      [(ngModel)]="localData.activiteSportiveFrequence"
                      (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Irrégulière</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <span class="origin-label">17.b) Si oui, vous pratiquez une activité sportive</span>
                <div class="checkbox-options">
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="activiteSportiveType"
                      value="COMPETITION"
                      [(ngModel)]="localData.activiteSportiveType"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">1. De compétition</span>
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="activiteSportiveType"
                      value="LOISIR"
                      [(ngModel)]="localData.activiteSportiveType"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">2. De loisir</span>
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="radio" 
                      name="espacesLoisirs"
                      [value]="true"
                      [(ngModel)]="localData.espacesLoisirs"
                      (change)="onFieldChange()"
                    >
                    <span class="checkbox-text">3. Espaces de loisirs dans le quartier ou la zone de vie</span>
                  </label>
                </div>
              </div>

              <!-- Si compétition, dopage -->
              <div class="form-group" *ngIf="localData.activiteSportiveType === 'COMPETITION'">
                <span class="origin-label">17.b.1) Si de compétition, dopage</span>
                <div class="radio-options">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="dopage"
                      [value]="true"
                      [(ngModel)]="localData.dopage"
                      (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="dopage"
                      [value]="false"
                      [(ngModel)]="localData.dopage"
                      (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
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
              <li *ngIf="!localData.cadreConsultationPrincipal">Cadre de consultation</li>
              <li *ngIf="localData.cadreConsultationPrincipal === 'autre' && !localData.cadreConsultation!.autrePrecision">Précision cadre de consultation</li>
              <li *ngIf="!isOrigineDemandeSelected()">Origine de la demande</li>
              <li *ngIf="localData.origineDemande!.autre && !localData.origineDemande!.autrePrecision">Précision origine de la demande</li>
              <li *ngIf="!localData.situationFamiliale">Situation familiale</li>
              <li *ngIf="localData.situationFamiliale === 'AUTRE' && !localData.situationFamilialeAutre">Précision situation familiale</li>
              <li *ngIf="!localData.logement30Jours">Type de logement</li>
              <li *ngIf="localData.logement30Jours === 'AUTRE' && !localData.logement30JoursAutre">Précision type de logement</li>
              <li *ngIf="!localData.natureLogement">Nature du logement</li>
              <li *ngIf="!localData.profession">Profession</li>
              <li *ngIf="!localData.niveauScolaire">Niveau scolaire</li>
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
      margin-top: var(--spacing-4);
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

  onCadreConsultationChange(type: string): void {
    // Reset cadre consultation object
    this.localData.cadreConsultation = {};
    
    // Set the selected type
    if (type === 'addictologie') {
      this.localData.cadreConsultation!.addictologie = true;
    } else if (type === 'autre') {
      this.localData.cadreConsultation!.autre = true;
    } else {
      (this.localData.cadreConsultation as any)[type] = true;
    }
    
    this.onFieldChange();
  }

  private validateStep(): void {
    const isValid = this.isStepValid();
    this.validationChange.emit(isValid);
  }

  isStepValid(): boolean {
    const required = [
      'secteur', 'structure', 'gouvernoratStructure', 'nom', 'prenom',
      'codePatient', 'dateConsultation', 'genre', 'dateNaissance',
      'nationalite', 'residence', 'situationFamiliale', 'logement30Jours',
      'natureLogement', 'profession', 'niveauScolaire'
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
    if (this.localData.cadreConsultationPrincipal === 'autre' && !this.localData.cadreConsultation?.autrePrecision) {
      return false;
    }

    // Check if origine demande "autre" is selected but not specified
    if (this.localData.origineDemande?.autre && !this.localData.origineDemande?.autrePrecision) {
      return false;
    }

    // Check if situation familiale "autre" is selected but not specified
    if (this.localData.situationFamiliale === 'AUTRE' && !this.localData.situationFamilialeAutre) {
      return false;
    }

    // Check if logement "autre" is selected but not specified
    if (this.localData.logement30Jours === 'AUTRE' && !this.localData.logement30JoursAutre) {
      return false;
    }

    // Check basic required fields
    const basicFieldsValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    // Check if cadre de consultation is selected
    const cadreSelected = !!this.localData.cadreConsultationPrincipal;
    
    // Check if at least one origine de demande is selected
    const origineSelected = this.isOrigineDemandeSelected();

    return basicFieldsValid && cadreSelected && origineSelected;
  }

  isOrigineDemandeSelected(): boolean {
    return Object.values(this.localData.origineDemande || {}).some(value => value === true || value === false);
  }

  // Method to trigger validation display when user tries to proceed
  showValidationErrors(): void {
    this.showErrors = true;
  }
}
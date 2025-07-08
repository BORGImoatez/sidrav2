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
        <h2 class="step-title">Étape 1 : Informations structure/centre & usager SPA</h2>
        <p class="step-description">
          Renseignez les informations sur la structure et l'usager SPA
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Section Structure -->
          <div class="form-section">
            <h3 class="section-title">Informations sur la structure</h3>

            <div class="form-fields">
              <!-- IUN (réservé à l'INSP) -->
              <div class="form-group">
                <label class="form-label">IUN (réservé à l'INSP, identifiant unique national généré systématiquement par la plateforme)</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.iun"
                    name="iun"
                    placeholder="Généré automatiquement"
                    readonly
                    disabled
                >
              </div>

              <!-- 1) Secteur -->
              <div class="form-group">
                <label class="form-label required">1) Secteur</label>
                <div class="checkbox-options">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.secteur === 'PUBLIC'"
                        (change)="onSecteurChange('PUBLIC')"
                        name="secteurPublic"
                    >
                    <span class="checkbox-text">1. Public</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.secteur === 'PRIVE'"
                        (change)="onSecteurChange('PRIVE')"
                        name="secteurPrive"
                    >
                    <span class="checkbox-text">2. Privé</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.secteur === 'ONG'"
                        (change)="onSecteurChange('ONG')"
                        name="secteurOng"
                    >
                    <span class="checkbox-text">3. Société civile (ONG)</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.secteur" class="form-error">
                  Le secteur est requis
                </div>
              </div>

              <!-- 1.a) Si ONG, préciser -->
              <div class="form-group sub-field" *ngIf="localData.secteur === 'ONG'">
                <label class="form-label required">1.a) Si ONG, préciser</label>
                <select
                    class="form-select"
                    [(ngModel)]="localData.ongPrecision"
                    name="ongPrecision"
                    [class.error]="showValidationErrors && localData.secteur === 'ONG' && !localData.ongPrecision"
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
                <div *ngIf="showValidationErrors && localData.secteur === 'ONG' && !localData.ongPrecision" class="form-error">
                  La précision ONG est requise
                </div>
              </div>

              <!-- 2) Ministère -->
              <div class="form-group" *ngIf="localData.secteur === 'PUBLIC'">
                <label class="form-label">2) Ministère</label>
                <select
                    class="form-select"
                    [(ngModel)]="localData.ministere"
                    name="ministere"
                >
                  <option value="">Sélectionner un ministère</option>
                  <option value="SANTE">Ministère de la Santé</option>
                  <option value="AFFAIRES_SOCIALES">Ministère des Affaires Sociales</option>
                  <option value="EDUCATION">Ministère de l'Éducation</option>
                  <option value="JEUNESSE_SPORT">Ministère de la Jeunesse et du Sport</option>
                </select>
              </div>

              <!-- 3) Structure / Centre -->
              <div class="form-group">
                <label class="form-label required">3) Structure / Centre</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.structure"
                    name="structure"
                    placeholder="Nom de la structure"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.structure"
                >
                <div *ngIf="showValidationErrors && !localData.structure" class="form-error">
                  La structure est requise
                </div>
              </div>

              <!-- 3.a) Gouvernorat de la structure -->
              <div class="form-group">
                <label class="form-label required">3.a) Préciser le gouvernorat de la Structure/Centre</label>
                <select
                    class="form-select"
                    [(ngModel)]="localData.gouvernoratStructure"
                    name="gouvernoratStructure"
                    (change)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.gouvernoratStructure"
                >
                  <option value="">Sélectionner un gouvernorat</option>
                  <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
                </select>
                <div *ngIf="showValidationErrors && !localData.gouvernoratStructure" class="form-error">
                  Le gouvernorat de la structure est requis
                </div>
              </div>
            </div>
          </div>

          <!-- Section Usager -->
          <div class="form-section">
            <h3 class="section-title">Informations sur l'usager SPA</h3>

            <div class="form-fields">
              <!-- Nom -->
              <div class="form-group">
                <label class="form-label required">Nom</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.nom"
                    name="nom"
                    placeholder="Nom de famille"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.nom"
                >
                <div *ngIf="showValidationErrors && !localData.nom" class="form-error">
                  Le nom est requis
                </div>
              </div>

              <!-- Prénom -->
              <div class="form-group">
                <label class="form-label required">Prénom</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.prenom"
                    name="prenom"
                    placeholder="Prénom"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.prenom"
                >
                <div *ngIf="showValidationErrors && !localData.prenom" class="form-error">
                  Le prénom est requis
                </div>
              </div>

              <!-- Code du patient -->
              <div class="form-group">
                <label class="form-label required">Code du patient</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.codePatient"
                    name="codePatient"
                    placeholder="Code d'identification du patient"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.codePatient"
                >
                <div *ngIf="showValidationErrors && !localData.codePatient" class="form-error">
                  Le code patient est requis
                </div>
              </div>

              <!-- 4) Date de consultation -->
              <div class="form-group">
                <label class="form-label required">4) Date de la consultation/entretien</label>
                <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="localData.dateConsultation"
                    name="dateConsultation"
                    (change)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.dateConsultation"
                >
                <div *ngIf="showValidationErrors && !localData.dateConsultation" class="form-error">
                  La date de consultation est requise
                </div>
              </div>

              <!-- 5) Genre -->
              <div class="form-group">
                <label class="form-label required">5) Genre</label>
                <div class="radio-options">
                  <label class="radio-label">
                    <input
                        type="radio"
                        name="genre"
                        value="HOMME"
                        [(ngModel)]="localData.genre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Homme</span>
                  </label>
                  <label class="radio-label">
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
                <div *ngIf="showValidationErrors && !localData.genre" class="form-error">
                  Le genre est requis
                </div>
              </div>

              <!-- 6) Date de naissance -->
              <div class="form-group">
                <label class="form-label required">6) Date de naissance complète</label>
                <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="localData.dateNaissance"
                    name="dateNaissance"
                    (change)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.dateNaissance"
                >
                <div *ngIf="showValidationErrors && !localData.dateNaissance" class="form-error">
                  La date de naissance est requise
                </div>
              </div>

              <!-- 7) Nationalité -->
              <div class="form-group">
                <label class="form-label required">7) Nationalité</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.nationalite"
                    name="nationalite"
                    placeholder="Nationalité"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && !localData.nationalite"
                >
                <div *ngIf="showValidationErrors && !localData.nationalite" class="form-error">
                  La nationalité est requise
                </div>
              </div>

              <!-- 8) Résidence -->
              <div class="form-group">
                <label class="form-label required">8) Résidence</label>
                <div class="radio-options">
                  <label class="radio-label">
                    <input
                        type="radio"
                        name="residence"
                        value="TUNISIE"
                        [(ngModel)]="localData.residence"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. En Tunisie</span>
                  </label>
                  <label class="radio-label">
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
                <div *ngIf="showValidationErrors && !localData.residence" class="form-error">
                  La résidence est requise
                </div>
              </div>

              <!-- 8.a) Gouvernorat de résidence -->
              <div class="form-group sub-field" *ngIf="localData.residence === 'TUNISIE'">
                <label class="form-label required">8.a) Gouvernorat</label>
                <select
                    class="form-select"
                    [(ngModel)]="localData.gouvernoratResidence"
                    name="gouvernoratResidence"
                    (change)="onFieldChange()"
                    [class.error]="showValidationErrors && localData.residence === 'TUNISIE' && !localData.gouvernoratResidence"
                >
                  <option value="">Sélectionner un gouvernorat</option>
                  <option *ngFor="let gov of gouvernorats" [value]="gov">{{ gov }}</option>
                </select>
                <div *ngIf="showValidationErrors && localData.residence === 'TUNISIE' && !localData.gouvernoratResidence" class="form-error">
                  Le gouvernorat de résidence est requis
                </div>
              </div>

              <!-- 8.b) Délégation -->
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

              <!-- 8.c) Pays -->
              <div class="form-group sub-field" *ngIf="localData.residence === 'ETRANGER'">
                <label class="form-label required">8.c) Pays</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="localData.paysResidence"
                    name="paysResidence"
                    placeholder="Pays de résidence"
                    (input)="onFieldChange()"
                    [class.error]="showValidationErrors && localData.residence === 'ETRANGER' && !localData.paysResidence"
                >
                <div *ngIf="showValidationErrors && localData.residence === 'ETRANGER' && !localData.paysResidence" class="form-error">
                  Le pays de résidence est requis
                </div>
              </div>
            </div>
          </div>

          <!-- 9) Cadre de consultation -->
          <div class="form-section">
            <h3 class="section-title">9) Cadre de la consultation/entretien</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez le cadre principal de consultation</label>
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'ADDICTOLOGIE'"
                        (change)="onCadreConsultationChange('ADDICTOLOGIE')"
                        name="cadreAddictologie"
                    >
                    <span class="checkbox-text">1. Consultation d'addictologie</span>
                  </label>

                  <!-- Sous-options pour addictologie -->
                  <div class="sub-options" *ngIf="localData.cadreConsultationPrincipal === 'ADDICTOLOGIE'">
                    <label class="checkbox-label sub-label">
                      <input
                          type="checkbox"
                          [(ngModel)]="localData.cadreConsultation!.addictologie"
                          name="addictologie"
                          (change)="onFieldChange()"
                      >
                      <span class="checkbox-text">1.a. Demande de sevrage</span>
                    </label>
                    <label class="checkbox-label sub-label">
                      <input
                          type="checkbox"
                          [(ngModel)]="localData.cadreConsultation!.addictologieType"
                          name="addictologieGestion"
                          (change)="onFieldChange()"
                      >
                      <span class="checkbox-text">1.b. Gestion d'une addiction sans substances ou autre</span>
                    </label>
                    <label class="checkbox-label sub-label">
                      <input
                          type="checkbox"
                          name="addictologieRisque"
                          (change)="onFieldChange()"
                      >
                      <span class="checkbox-text">1.c. Risque de glissement ou de rechute</span>
                    </label>
                  </div>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'PSYCHIATRIE'"
                        (change)="onCadreConsultationChange('PSYCHIATRIE')"
                        name="cadrePsychiatrie"
                    >
                    <span class="checkbox-text">2. Psychiatrie (troubles mentaux)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'PSYCHOLOGIQUE'"
                        (change)="onCadreConsultationChange('PSYCHOLOGIQUE')"
                        name="cadrePsychologique"
                    >
                    <span class="checkbox-text">3. Consultation psychologique</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'MEDECINE_GENERALE'"
                        (change)="onCadreConsultationChange('MEDECINE_GENERALE')"
                        name="cadreMedecineGenerale"
                    >
                    <span class="checkbox-text">4. Médecine générale, médecine interne</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'NEUROLOGIQUE'"
                        (change)="onCadreConsultationChange('NEUROLOGIQUE')"
                        name="cadreNeurologique"
                    >
                    <span class="checkbox-text">5. Troubles neurologiques</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'INFECTIEUX'"
                        (change)="onCadreConsultationChange('INFECTIEUX')"
                        name="cadreInfectieux"
                    >
                    <span class="checkbox-text">6. Problèmes infectieux</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'ESPACE_AMIS_JEUNES'"
                        (change)="onCadreConsultationChange('ESPACE_AMIS_JEUNES')"
                        name="cadreEspaceAmisJeunes"
                    >
                    <span class="checkbox-text">7. Espace amis des jeunes</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'ECHANGE_MATERIEL'"
                        (change)="onCadreConsultationChange('ECHANGE_MATERIEL')"
                        name="cadreEchangeMateriel"
                    >
                    <span class="checkbox-text">8. Échange/approvisionnement de matériels à usage unique</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'REHABILITATION'"
                        (change)="onCadreConsultationChange('REHABILITATION')"
                        name="cadreRehabilitation"
                    >
                    <span class="checkbox-text">9. Réhabilitation</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'URGENCE_MEDICALE'"
                        (change)="onCadreConsultationChange('URGENCE_MEDICALE')"
                        name="cadreUrgenceMedicale"
                    >
                    <span class="checkbox-text">10. Urgence médicale</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'URGENCE_CHIRURGICALE'"
                        (change)="onCadreConsultationChange('URGENCE_CHIRURGICALE')"
                        name="cadreUrgenceChirurgicale"
                    >
                    <span class="checkbox-text">11. Urgence chirurgicale</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'DEPISTAGE'"
                        (change)="onCadreConsultationChange('DEPISTAGE')"
                        name="cadreDepistage"
                    >
                    <span class="checkbox-text">12. Dépistage</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.cadreConsultationPrincipal === 'AUTRE'"
                        (change)="onCadreConsultationChange('AUTRE')"
                        name="cadreAutre"
                    >
                    <span class="checkbox-text">13. Autre</span>
                  </label>

                  <!-- Précision pour autre -->
                  <div class="sub-options" *ngIf="localData.cadreConsultationPrincipal === 'AUTRE'">
                    <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="localData.cadreConsultation!.autrePrecision"
                        name="cadreAutrePrecision"
                        placeholder="13.a Si autre, préciser"
                        (input)="onFieldChange()"
                        [class.error]="showValidationErrors && localData.cadreConsultationPrincipal === 'AUTRE' && !localData.cadreConsultation?.autrePrecision"
                    >
                    <div *ngIf="showValidationErrors && localData.cadreConsultationPrincipal === 'AUTRE' && !localData.cadreConsultation?.autrePrecision" class="form-error">
                      La précision est requise
                    </div>
                  </div>
                </div>
                <div *ngIf="showValidationErrors && !localData.cadreConsultationPrincipal" class="form-error">
                  Le cadre de consultation est requis
                </div>
              </div>
            </div>
          </div>

          <!-- 10) Origine de la demande -->
          <div class="form-section">
            <h3 class="section-title">10) Origine de la demande</h3>

            <div class="form-fields">
              <div class="form-group">
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <span class="checkbox-text">1. Lui-même</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineLuiMeme"
                            value="true"
                            [checked]="localData.origineDemande?.luiMeme === true"
                            (change)="onOrigineDemandeChange('luiMeme', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineLuiMeme"
                            value="false"
                            [checked]="localData.origineDemande?.luiMeme === false"
                            (change)="onOrigineDemandeChange('luiMeme', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">2. Famille</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineFamille"
                            value="true"
                            [checked]="localData.origineDemande?.famille === true"
                            (change)="onOrigineDemandeChange('famille', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineFamille"
                            value="false"
                            [checked]="localData.origineDemande?.famille === false"
                            (change)="onOrigineDemandeChange('famille', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">3. Amis</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAmis"
                            value="true"
                            [checked]="localData.origineDemande?.amis === true"
                            (change)="onOrigineDemandeChange('amis', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAmis"
                            value="false"
                            [checked]="localData.origineDemande?.amis === false"
                            (change)="onOrigineDemandeChange('amis', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">4. Cellule d'écoute de médecine scolaire et universitaire</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineCelluleEcoute"
                            value="true"
                            [checked]="localData.origineDemande?.celluleEcoute === true"
                            (change)="onOrigineDemandeChange('celluleEcoute', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineCelluleEcoute"
                            value="false"
                            [checked]="localData.origineDemande?.celluleEcoute === false"
                            (change)="onOrigineDemandeChange('celluleEcoute', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">5. Adressé par un autre centre</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAutreCentre"
                            value="true"
                            [checked]="localData.origineDemande?.autreCentre === true"
                            (change)="onOrigineDemandeChange('autreCentre', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAutreCentre"
                            value="false"
                            [checked]="localData.origineDemande?.autreCentre === false"
                            (change)="onOrigineDemandeChange('autreCentre', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">6. Structure sociale</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineStructureSociale"
                            value="true"
                            [checked]="localData.origineDemande?.structureSociale === true"
                            (change)="onOrigineDemandeChange('structureSociale', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineStructureSociale"
                            value="false"
                            [checked]="localData.origineDemande?.structureSociale === false"
                            (change)="onOrigineDemandeChange('structureSociale', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <label class="checkbox-label">
                    <span class="checkbox-text">7. Structure judiciaire</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineStructureJudiciaire"
                            value="true"
                            [checked]="localData.origineDemande?.structureJudiciaire === true"
                            (change)="onOrigineDemandeChange('structureJudiciaire', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineStructureJudiciaire"
                            value="false"
                            [checked]="localData.origineDemande?.structureJudiciaire === false"
                            (change)="onOrigineDemandeChange('structureJudiciaire', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>


                  <label class="checkbox-label">
                    <span class="checkbox-text">8. Le juge de l'enfance</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineJugeEnfance"
                            value="true"
                            [checked]="localData.origineDemande?.jugeEnfance === true"
                            (change)="onOrigineDemandeChange('jugeEnfance', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineJugeEnfance"
                            value="false"
                            [checked]="localData.origineDemande?.jugeEnfance === false"
                            (change)="onOrigineDemandeChange('jugeEnfance', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>
                  <label class="checkbox-label">
                    <span class="checkbox-text">9. Autre</span>
                    <div class="radio-inline">
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAutre"
                            value="true"
                            [checked]="localData.origineDemande?.autre === true"
                            (change)="onOrigineDemandeChange('autre', true)"
                        >
                        <span class="radio-text">1. Oui</span>
                      </label>
                      <label class="radio-label-inline">
                        <input
                            type="radio"
                            name="origineAutre"
                            value="false"
                            [checked]="localData.origineDemande?.autre === false"
                            (change)="onOrigineDemandeChange('autre', false)"
                        >
                        <span class="radio-text">2. Non</span>
                      </label>
                    </div>
                  </label>

                  <!-- Précision pour autre -->
                  <div class="sub-options" *ngIf="localData.origineDemande?.autre === true">
                    <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="localData.origineDemande!.autrePrecision"
                        name="origineAutrePrecision"
                        placeholder="10. Si autre, préciser"
                        (input)="onFieldChange()"
                        [class.error]="showValidationErrors && localData.origineDemande?.autre === true && !localData.origineDemande?.autrePrecision"
                    >
                    <div *ngIf="showValidationErrors && localData.origineDemande?.autre === true && !localData.origineDemande?.autrePrecision" class="form-error">
                      La précision est requise
                    </div>
                  </div>
                </div>
              </div>

              <!-- 10.a) Cause ou circonstance -->
              <div class="form-group">
                <label class="form-label">10.a) La cause ou circonstance de l'abus</label>
                <select
                    class="form-select"
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
          </div>

          <!-- 11) Consultation antérieure -->
          <div class="form-section">
            <h3 class="section-title">11) Consultation antérieure</h3>

            <div class="form-fields">
              <div class="form-group">
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

              <!-- Sous-questions si consultation antérieure = oui -->
              <div class="sub-section" *ngIf="localData.consultationAnterieure === true">
                <div class="form-group sub-field">
                  <label class="form-label required">11.a) Date de la consultation antérieure (mois/année)</label>
                  <input
                      type="month"
                      class="form-input"
                      [(ngModel)]="localData.dateConsultationAnterieure"
                      name="dateConsultationAnterieure"
                      (input)="onFieldChange()"
                      [class.error]="showValidationErrors && localData.consultationAnterieure === true && !localData.dateConsultationAnterieure"
                  >
                  <div *ngIf="showValidationErrors && localData.consultationAnterieure === true && !localData.dateConsultationAnterieure" class="form-error">
                    La date de consultation antérieure est requise
                  </div>
                </div>

                <div class="form-group sub-field">
                  <label class="form-label required">11.b) Motif de la consultation antérieure</label>
                  <select
                      class="form-select"
                      [(ngModel)]="localData.motifConsultationAnterieure"
                      name="motifConsultationAnterieure"
                      (change)="onFieldChange()"
                      [class.error]="showValidationErrors && localData.consultationAnterieure === true && !localData.motifConsultationAnterieure"
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
                  <div *ngIf="showValidationErrors && localData.consultationAnterieure === true && !localData.motifConsultationAnterieure" class="form-error">
                    Le motif de consultation antérieure est requis
                  </div>
                </div>

                <!-- Sous-questions selon le motif -->
                <div class="form-group sub-field" *ngIf="localData.motifConsultationAnterieure === 'RECIDIVES'">
                  <label class="form-label required">11.c) Si motif de récidive, cause de récidive</label>
                  <textarea
                      class="form-input"
                      [(ngModel)]="localData.causeRecidive"
                      name="causeRecidive"
                      placeholder="Problème de soutien familial, scolaire, de l'entourage, problème social non résolu, mauvaise gestion des émotions, craving, influence des pairs, chômage..."
                      rows="3"
                      (input)="onFieldChange()"
                      [class.error]="showValidationErrors && localData.motifConsultationAnterieure === 'RECIDIVES' && !localData.causeRecidive"
                  ></textarea>
                  <div *ngIf="showValidationErrors && localData.motifConsultationAnterieure === 'RECIDIVES' && !localData.causeRecidive" class="form-error">
                    La cause de récidive est requise
                  </div>
                </div>

                <div class="form-group sub-field" *ngIf="localData.motifConsultationAnterieure === 'SEVRAGE'">
                  <label class="form-label required">11.d) Si motif de sevrage, cause de l'échec de sevrage</label>
                  <select
                      class="form-select"
                      [(ngModel)]="localData.causeEchecSevrage"
                      name="causeEchecSevrage"
                      (change)="onFieldChange()"
                      [class.error]="showValidationErrors && localData.motifConsultationAnterieure === 'SEVRAGE' && !localData.causeEchecSevrage"
                  >
                    <option value="">Sélectionner une cause</option>
                    <option value="NON_OBSERVANCE">Non-observance du traitement</option>
                    <option value="SUIVI_INTERROMPU">Suivi interrompu</option>
                    <option value="NON_CONVAINCU">Non convaincu de l'approche thérapeutique</option>
                    <option value="SEJOUR_INTERROMPU">Séjour interrompu</option>
                    <option value="MALADIE_MENTALE">Maladie mentale sous-jacente</option>
                    <option value="PROBLEME_ACCESSIBILITE">Problème d'accessibilité au service</option>
                    <option value="AUTRES">Autres</option>
                  </select>
                  <div *ngIf="showValidationErrors && localData.motifConsultationAnterieure === 'SEVRAGE' && !localData.causeEchecSevrage" class="form-error">
                    La cause d'échec de sevrage est requise
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 12) Situation familiale -->
          <div class="form-section">
            <h3 class="section-title">12) Situation familiale</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez votre situation familiale</label>
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'CELIBATAIRE'"
                        (change)="onSituationFamilialeChange('CELIBATAIRE')"
                        name="situationCelibataire"
                    >
                    <span class="checkbox-text">1. Célibataire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'MARIE'"
                        (change)="onSituationFamilialeChange('MARIE')"
                        name="situationMarie"
                    >
                    <span class="checkbox-text">2. Marié(e)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'DIVORCE'"
                        (change)="onSituationFamilialeChange('DIVORCE')"
                        name="situationDivorce"
                    >
                    <span class="checkbox-text">3. Divorcé(e)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'SEPARE'"
                        (change)="onSituationFamilialeChange('SEPARE')"
                        name="situationSepare"
                    >
                    <span class="checkbox-text">4. Séparé(e)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'VEUF'"
                        (change)="onSituationFamilialeChange('VEUF')"
                        name="situationVeuf"
                    >
                    <span class="checkbox-text">5. Veuf(ve)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.situationFamiliale === 'AUTRE'"
                        (change)="onSituationFamilialeChange('AUTRE')"
                        name="situationAutre"
                    >
                    <span class="checkbox-text">6. Autre</span>
                  </label>

                  <!-- Précision pour autre -->
                  <div class="sub-options" *ngIf="localData.situationFamiliale === 'AUTRE'">
                    <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="localData.situationFamilialeAutre"
                        name="situationFamilialeAutre"
                        placeholder="12.a Si autre, préciser"
                        (input)="onFieldChange()"
                        [class.error]="showValidationErrors && localData.situationFamiliale === 'AUTRE' && !localData.situationFamilialeAutre"
                    >
                    <div *ngIf="showValidationErrors && localData.situationFamiliale === 'AUTRE' && !localData.situationFamilialeAutre" class="form-error">
                      La précision est requise
                    </div>
                  </div>
                </div>
                <div *ngIf="showValidationErrors && !localData.situationFamiliale" class="form-error">
                  La situation familiale est requise
                </div>
              </div>
            </div>
          </div>

          <!-- 13) Logement 30 jours -->
          <div class="form-section">
            <h3 class="section-title">13) Durant les 30 derniers jours précédant la consultation/dépistage, le patient vivait principalement</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez votre situation de logement</label>
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'SEUL'"
                        (change)="onLogement30JoursChange('SEUL')"
                        name="logementSeul"
                    >
                    <span class="checkbox-text">1. Seul(e)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'FAMILLE_ORIGINE'"
                        (change)="onLogement30JoursChange('FAMILLE_ORIGINE')"
                        name="logementFamilleOrigine"
                    >
                    <span class="checkbox-text">2. Avec sa famille d'origine (parents, etc.)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'PARTENAIRE'"
                        (change)="onLogement30JoursChange('PARTENAIRE')"
                        name="logementPartenaire"
                    >
                    <span class="checkbox-text">3. Avec son partenaire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'ENFANTS'"
                        (change)="onLogement30JoursChange('ENFANTS')"
                        name="logementEnfants"
                    >
                    <span class="checkbox-text">4. Avec ses enfants</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'AMIS'"
                        (change)="onLogement30JoursChange('AMIS')"
                        name="logementAmis"
                    >
                    <span class="checkbox-text">5. Avec des amis ou d'autres personnes (sans relation familiale)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'INTERNAT'"
                        (change)="onLogement30JoursChange('INTERNAT')"
                        name="logementInternat"
                    >
                    <span class="checkbox-text">6. Dans un Internat</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'COLOCATION'"
                        (change)="onLogement30JoursChange('COLOCATION')"
                        name="logementColocation"
                    >
                    <span class="checkbox-text">7. En colocation</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'FOYER'"
                        (change)="onLogement30JoursChange('FOYER')"
                        name="logementFoyer"
                    >
                    <span class="checkbox-text">8. Dans un foyer universitaire ou scolaire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'DETENTION'"
                        (change)="onLogement30JoursChange('DETENTION')"
                        name="logementDetention"
                    >
                    <span class="checkbox-text">9. En détention</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'CENTRE_JEUNESSE'"
                        (change)="onLogement30JoursChange('CENTRE_JEUNESSE')"
                        name="logementCentreJeunesse"
                    >
                    <span class="checkbox-text">10. Dans un centre intégré de la jeunesse</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'INSTITUTION'"
                        (change)="onLogement30JoursChange('INSTITUTION')"
                        name="logementInstitution"
                    >
                    <span class="checkbox-text">11. En institution/refuge (pas de détention)</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.logement30Jours === 'AUTRE'"
                        (change)="onLogement30JoursChange('AUTRE')"
                        name="logementAutre"
                    >
                    <span class="checkbox-text">12. Autre</span>
                  </label>

                  <!-- Précision pour autre -->
                  <div class="sub-options" *ngIf="localData.logement30Jours === 'AUTRE'">
                    <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="localData.logement30JoursAutre"
                        name="logement30JoursAutre"
                        placeholder="12.a Si autre, préciser"
                        (input)="onFieldChange()"
                        [class.error]="showValidationErrors && localData.logement30Jours === 'AUTRE' && !localData.logement30JoursAutre"
                    >
                    <div *ngIf="showValidationErrors && localData.logement30Jours === 'AUTRE' && !localData.logement30JoursAutre" class="form-error">
                      La précision est requise
                    </div>
                  </div>
                </div>
                <div *ngIf="showValidationErrors && !localData.logement30Jours" class="form-error">
                  La situation de logement est requise
                </div>
              </div>
            </div>
          </div>

          <!-- 14) Nature de logement -->
          <div class="form-section">
            <h3 class="section-title">14) Nature de logement</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez la nature de votre logement</label>
                <div class="checkbox-options">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.natureLogement === 'STABLE'"
                        (change)="onNatureLogementChange('STABLE')"
                        name="natureLogementStable"
                    >
                    <span class="checkbox-text">1. Logement stable</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.natureLogement === 'PRECAIRE'"
                        (change)="onNatureLogementChange('PRECAIRE')"
                        name="natureLogementPrecaire"
                    >
                    <span class="checkbox-text">2. Logement précaire/sans abri</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.natureLogement" class="form-error">
                  La nature de logement est requise
                </div>
              </div>
            </div>
          </div>

          <!-- 15) Profession -->
          <div class="form-section">
            <h3 class="section-title">15) Profession</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez votre profession</label>
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'EMPLOYE'"
                        (change)="onProfessionChange('EMPLOYE')"
                        name="professionEmploye"
                    >
                    <span class="checkbox-text">1. Employé</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'COMPTE_PROPRE'"
                        (change)="onProfessionChange('COMPTE_PROPRE')"
                        name="professionComptePropre"
                    >
                    <span class="checkbox-text">2. Travaille pour son propre compte</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'JOURNALIER'"
                        (change)="onProfessionChange('JOURNALIER')"
                        name="professionJournalier"
                    >
                    <span class="checkbox-text">3. Journalier/travail irrégulier</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'SPORTIF'"
                        (change)="onProfessionChange('SPORTIF')"
                        name="professionSportif"
                    >
                    <span class="checkbox-text">4. Sportif professionnel</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'CHOMAGE'"
                        (change)="onProfessionChange('CHOMAGE')"
                        name="professionChomage"
                    >
                    <span class="checkbox-text">5. En chômage</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'ELEVE'"
                        (change)="onProfessionChange('ELEVE')"
                        name="professionEleve"
                    >
                    <span class="checkbox-text">6. Élève</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'ETUDIANT'"
                        (change)="onProfessionChange('ETUDIANT')"
                        name="professionEtudiant"
                    >
                    <span class="checkbox-text">7. Étudiant</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'FORMATION'"
                        (change)="onProfessionChange('FORMATION')"
                        name="professionFormation"
                    >
                    <span class="checkbox-text">8. En formation professionnelle</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'RETRAITE'"
                        (change)="onProfessionChange('RETRAITE')"
                        name="professionRetraite"
                    >
                    <span class="checkbox-text">9. Retraité</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.profession === 'SANS_RESSOURCES'"
                        (change)="onProfessionChange('SANS_RESSOURCES')"
                        name="professionSansRessources"
                    >
                    <span class="checkbox-text">10. Sans ressources</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.profession" class="form-error">
                  La profession est requise
                </div>
              </div>
            </div>
          </div>

          <!-- 16) Niveau scolaire -->
          <div class="form-section">
            <h3 class="section-title">16) Niveau scolaire</h3>

            <div class="form-fields">
              <div class="form-group">
                <label class="form-label required">Sélectionnez votre niveau scolaire</label>
                <div class="checkbox-options-vertical">
                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'ANALPHABETE'"
                        (change)="onNiveauScolaireChange('ANALPHABETE')"
                        name="niveauAnalphabete"
                    >
                    <span class="checkbox-text">1. Analphabète</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'PRESCOLAIRE'"
                        (change)="onNiveauScolaireChange('PRESCOLAIRE')"
                        name="niveauPrescolaire"
                    >
                    <span class="checkbox-text">2. Préscolaire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'PRIMAIRE'"
                        (change)="onNiveauScolaireChange('PRIMAIRE')"
                        name="niveauPrimaire"
                    >
                    <span class="checkbox-text">3. Primaire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'COLLEGE'"
                        (change)="onNiveauScolaireChange('COLLEGE')"
                        name="niveauCollege"
                    >
                    <span class="checkbox-text">4. Collège</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'SECONDAIRE'"
                        (change)="onNiveauScolaireChange('SECONDAIRE')"
                        name="niveauSecondaire"
                    >
                    <span class="checkbox-text">5. Secondaire</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'FORMATION_PROF'"
                        (change)="onNiveauScolaireChange('FORMATION_PROF')"
                        name="niveauFormationProf"
                    >
                    <span class="checkbox-text">6. Formation professionnelle</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                        type="checkbox"
                        [checked]="localData.niveauScolaire === 'UNIVERSITAIRE'"
                        (change)="onNiveauScolaireChange('UNIVERSITAIRE')"
                        name="niveauUniversitaire"
                    >
                    <span class="checkbox-text">7. Universitaire</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.niveauScolaire" class="form-error">
                  Le niveau scolaire est requis
                </div>
              </div>
            </div>
          </div>

          <!-- 17) Activité sportive -->
          <div class="form-section">
            <h3 class="section-title">17) Est-ce que vous pratiquez une activité sportive ?</h3>

            <div class="form-fields">
              <div class="form-group">
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

              <!-- Sous-questions si activité sportive = oui -->
              <div class="sub-section" *ngIf="localData.activiteSportive === true">
                <div class="form-group sub-field">
                  <label class="form-label required">17.a) Si oui, vous pratiquez une activité sportive de façon</label>
                  <div class="checkbox-options">
                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          [checked]="localData.activiteSportiveFrequence === 'REGULIERE'"
                          (change)="onActiviteSportiveFrequenceChange('REGULIERE')"
                          name="activiteReguliere"
                      >
                      <span class="checkbox-text">1. Régulière</span>
                    </label>

                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          [checked]="localData.activiteSportiveFrequence === 'IRREGULIERE'"
                          (change)="onActiviteSportiveFrequenceChange('IRREGULIERE')"
                          name="activiteIrreguliere"
                      >
                      <span class="checkbox-text">2. Irrégulière</span>
                    </label>
                  </div>
                  <div *ngIf="showValidationErrors && localData.activiteSportive === true && !localData.activiteSportiveFrequence" class="form-error">
                    La fréquence d'activité sportive est requise
                  </div>
                </div>

                <div class="form-group sub-field">
                  <label class="form-label required">17.b) Si oui, vous pratiquez une activité sportive</label>
                  <div class="checkbox-options-vertical">
                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          [checked]="localData.activiteSportiveType === 'COMPETITION'"
                          (change)="onActiviteSportiveTypeChange('COMPETITION')"
                          name="activiteCompetition"
                      >
                      <span class="checkbox-text">1. De compétition</span>
                    </label>

                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          [checked]="localData.activiteSportiveType === 'LOISIR'"
                          (change)="onActiviteSportiveTypeChange('LOISIR')"
                          name="activiteLoisir"
                      >
                      <span class="checkbox-text">2. De loisir</span>
                    </label>

                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          [(ngModel)]="localData.espacesLoisirs"
                          name="espacesLoisirs"
                          (change)="onFieldChange()"
                      >
                      <span class="checkbox-text">3. Espaces de loisirs dans le quartier ou la zone de vie</span>
                    </label>
                  </div>
                  <div *ngIf="showValidationErrors && localData.activiteSportive === true && !localData.activiteSportiveType" class="form-error">
                    Le type d'activité sportive est requis
                  </div>
                </div>

                <!-- Dopage si compétition -->
                <div class="form-group sub-field" *ngIf="localData.activiteSportiveType === 'COMPETITION'">
                  <label class="form-label required">17.b.1) Si de compétition, dopage</label>
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
                  <div *ngIf="showValidationErrors && localData.activiteSportiveType === 'COMPETITION' && localData.dopage === null" class="form-error">
                    La réponse sur le dopage est requise
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

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-6) 0;
      padding-bottom: var(--spacing-3);
      border-bottom: 2px solid var(--primary-200);
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .sub-field {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 3px solid var(--primary-200);
    }

    .sub-section {
      margin-top: var(--spacing-4);
      padding: var(--spacing-4);
      background-color: var(--gray-50);
      border-radius: var(--radius-md);
    }

    .checkbox-options {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-4);
    }

    .checkbox-options-vertical {
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

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .checkbox-text {
      font-weight: 500;
      color: var(--gray-700);
      flex: 1;
    }

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
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease-in-out;
    }

    .radio-label:hover {
      background-color: var(--gray-50);
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

    .radio-inline {
      display: flex;
      gap: var(--spacing-4);
      margin-left: var(--spacing-4);
    }

    .radio-label-inline {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
    }

    .radio-label-inline:hover {
      background-color: var(--gray-50);
    }

    .sub-options {
      margin-left: var(--spacing-6);
      margin-top: var(--spacing-3);
    }

    .sub-label {
      margin-left: var(--spacing-4);
      font-size: 14px;
    }

    .form-error {
      color: var(--error-500);
      font-size: 12px;
      margin-top: var(--spacing-1);
    }

    .form-input.error,
    .form-select.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .checkbox-label.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    @media (max-width: 768px) {
      .checkbox-options {
        flex-direction: column;
      }

      .radio-options {
        flex-direction: column;
      }

      .radio-inline {
        flex-direction: column;
        gap: var(--spacing-2);
      }

      .sub-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }
    }
  `]
})
export class Step1Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};
  showValidationErrors = false;

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

  // Méthodes pour gérer les choix uniques avec checkboxes
  onSecteurChange(secteur: string): void {
    this.localData.secteur = this.localData.secteur === secteur ? undefined : secteur as any;
    if (this.localData.secteur !== 'ONG') {
      this.localData.ongPrecision = undefined;
    }
    this.onFieldChange();
  }

  onCadreConsultationChange(cadre: string): void {
    this.localData.cadreConsultationPrincipal = this.localData.cadreConsultationPrincipal === cadre ? undefined : cadre;
    // Reset des sous-options si on change de cadre
    if (this.localData.cadreConsultationPrincipal !== 'AUTRE') {
      if (this.localData.cadreConsultation) {
        this.localData.cadreConsultation.autrePrecision = undefined;
      }
    }
    this.onFieldChange();
  }

  onOrigineDemandeChange(origine: string, value: boolean): void {
    if (!this.localData.origineDemande) {
      this.localData.origineDemande = {};
    }
    (this.localData.origineDemande as any)[origine] = value;

    // Reset précision si autre n'est pas sélectionné
    if (origine === 'autre' && !value) {
      this.localData.origineDemande.autrePrecision = undefined;
    }

    this.onFieldChange();
  }

  onSituationFamilialeChange(situation: string): void {
    this.localData.situationFamiliale = this.localData.situationFamiliale === situation ? undefined : situation as any;
    if (this.localData.situationFamiliale !== 'AUTRE') {
      this.localData.situationFamilialeAutre = undefined;
    }
    this.onFieldChange();
  }

  onLogement30JoursChange(logement: string): void {
    this.localData.logement30Jours = this.localData.logement30Jours === logement ? undefined : logement as any;
    if (this.localData.logement30Jours !== 'AUTRE') {
      this.localData.logement30JoursAutre = undefined;
    }
    this.onFieldChange();
  }

  onNatureLogementChange(nature: string): void {
    this.localData.natureLogement = this.localData.natureLogement === nature ? undefined : nature as any;
    this.onFieldChange();
  }

  onProfessionChange(profession: string): void {
    this.localData.profession = this.localData.profession === profession ? undefined : profession as any;
    this.onFieldChange();
  }

  onNiveauScolaireChange(niveau: string): void {
    this.localData.niveauScolaire = this.localData.niveauScolaire === niveau ? undefined : niveau as any;
    this.onFieldChange();
  }

  onActiviteSportiveFrequenceChange(frequence: string): void {
    this.localData.activiteSportiveFrequence = this.localData.activiteSportiveFrequence === frequence ? undefined : frequence as any;
    this.onFieldChange();
  }

  onActiviteSportiveTypeChange(type: string): void {
    this.localData.activiteSportiveType = this.localData.activiteSportiveType === type ? undefined : type as any;
    if (this.localData.activiteSportiveType !== 'COMPETITION') {
      this.localData.dopage = undefined;
    }
    this.onFieldChange();
  }



  private validateStep(): void {
    const required = [
      'secteur', 'structure', 'gouvernoratStructure', 'nom', 'prenom',
      'codePatient', 'dateConsultation', 'genre', 'dateNaissance',
      'nationalite', 'residence', 'cadreConsultationPrincipal',
      'situationFamiliale', 'logement30Jours', 'natureLogement',
      'profession', 'niveauScolaire'
    ];

    // Check conditional required fields
    if (this.localData.secteur === 'ONG') {
      required.push('ongPrecision');
    }

    if (this.localData.residence === 'TUNISIE') {
      required.push('gouvernoratResidence');
    }

    if (this.localData.residence === 'ETRANGER') {
      required.push('paysResidence');
    }

    if (this.localData.cadreConsultationPrincipal === 'AUTRE') {
      if (!this.localData.cadreConsultation?.autrePrecision) {
        this.validationChange.emit(false);
        return;
      }
    }

    if (this.localData.situationFamiliale === 'AUTRE' && !this.localData.situationFamilialeAutre) {
      this.validationChange.emit(false);
      return;
    }

    if (this.localData.logement30Jours === 'AUTRE' && !this.localData.logement30JoursAutre) {
      this.validationChange.emit(false);
      return;
    }

    if (this.localData.origineDemande?.autre === true && !this.localData.origineDemande?.autrePrecision) {
      this.validationChange.emit(false);
      return;
    }

    if (this.localData.consultationAnterieure === true) {
      if (!this.localData.dateConsultationAnterieure || !this.localData.motifConsultationAnterieure) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.motifConsultationAnterieure === 'RECIDIVES' && !this.localData.causeRecidive) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.motifConsultationAnterieure === 'SEVRAGE' && !this.localData.causeEchecSevrage) {
        this.validationChange.emit(false);
        return;
      }
    }

    if (this.localData.activiteSportive === true) {
      if (!this.localData.activiteSportiveFrequence || !this.localData.activiteSportiveType) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.activiteSportiveType === 'COMPETITION' && this.localData.dopage === null) {
        this.validationChange.emit(false);
        return;
      }
    }

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    this.validationChange.emit(isValid);
  }
}

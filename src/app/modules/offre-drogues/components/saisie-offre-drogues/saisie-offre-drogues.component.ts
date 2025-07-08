import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OffreDroguesService } from '../../../../services/offre-drogues.service';
import { OffreDrogues } from '../../../../models/offre-drogues.model';

@Component({
  selector: 'app-saisie-offre-drogues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="saisie-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ isEditMode ? 'Modifier' : 'Nouvelle saisie' }} - Indicateurs de l'offre de drogues</h1>
          <p class="page-description">
            Renseignez les indicateurs relatifs à l'offre de drogues pour la date sélectionnée
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

      <form (ngSubmit)="onSubmit()" #dataForm="ngForm" class="saisie-form">
        <!-- Date de saisie -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">Date de saisie</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label required">Date de saisie</label>
              <input
                type="date"
                class="form-input"
                [(ngModel)]="dateSaisieString"
                name="dateSaisie"
                required
                [disabled]="isSaving"
              >
            </div>
          </div>
        </div>

        <!-- 1. Quantité de drogues saisies -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">1. Quantité de drogues saisies selon la substance</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-input-table">
                <thead>
                  <tr>
                    <th>Nature de la substance saisie</th>
                    <th>Quantité saisie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cannabis (kg)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.cannabis"
                        name="cannabis"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Comprimés Tableau A</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.comprimesTableauA"
                        name="comprimesTableauA"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Ecstasy (comprimé)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.ecstasyComprime"
                        name="ecstasyComprime"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Ecstasy (poudre ; en g)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.ecstasyPoudre"
                        name="ecstasyPoudre"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Subutex (comprimé)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.subutex"
                        name="subutex"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Cocaïne (g)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.cocaine"
                        name="cocaine"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Héroïne (g)</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.heroine"
                        name="heroine"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 2. Répartition des personnes inculpées selon la nature d'accusation -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">2. Répartition des personnes inculpées selon la nature d'accusation</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-input-table">
                <thead>
                  <tr>
                    <th>Nature d'accusation</th>
                    <th>Nombre</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Consommateur</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.consommateur.nombre"
                        name="consommateurNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                        (input)="calculatePercentages('personnesInculpees')"
                      >
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.consommateur.pourcentage"
                        name="consommateurPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                        readonly
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Vendeur</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.vendeur.nombre"
                        name="vendeurNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                        (input)="calculatePercentages('personnesInculpees')"
                      >
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.vendeur.pourcentage"
                        name="vendeurPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                        readonly
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Trafiquant</td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.trafiquant.nombre"
                        name="trafiquantNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                        (input)="calculatePercentages('personnesInculpees')"
                      >
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.trafiquant.pourcentage"
                        name="trafiquantPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                        readonly
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. Caractéristiques sociodémographiques -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">3. Répartition des personnes inculpées selon les caractéristiques sociodémographiques</h3>
          </div>
          <div class="card-body">
            
            <!-- Genre -->
            <div class="subsection">
              <h4 class="subsection-title">Genre</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>Caractéristiques sociodémographiques</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Masculin</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.masculin.nombre"
                          name="masculinNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('genre')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.masculin.pourcentage"
                          name="masculinPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Féminin</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.feminin.nombre"
                          name="femininNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('genre')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.feminin.pourcentage"
                          name="femininPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Âge -->
            <div class="subsection">
              <h4 class="subsection-title">Âge</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>Tranche d'âge</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>&lt;12 ans</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins12ans.nombre"
                          name="moins12ansNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('age')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins12ans.pourcentage"
                          name="moins12ansPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>&lt;18 ans</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins18ans.nombre"
                          name="moins18ansNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('age')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins18ans.pourcentage"
                          name="moins18ansPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>18-40</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.entre18et40.nombre"
                          name="entre18et40Nombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('age')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.entre18et40.pourcentage"
                          name="entre18et40Pourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>&gt; 40</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.plus40ans.nombre"
                          name="plus40ansNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('age')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.age.plus40ans.pourcentage"
                          name="plus40ansPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Nationalité -->
            <div class="subsection">
              <h4 class="subsection-title">Nationalité</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>Nationalité</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tunisienne</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.tunisienne.nombre"
                          name="tunisienneNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('nationalite')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.tunisienne.pourcentage"
                          name="tunisiennePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Maghrébine</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.maghrebine.nombre"
                          name="maghrebineNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('nationalite')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.maghrebine.pourcentage"
                          name="maghrebinePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Autres</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.autres.nombre"
                          name="autresNationaliteNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('nationalite')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.autres.pourcentage"
                          name="autresNationalitePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- État civil -->
            <div class="subsection">
              <h4 class="subsection-title">État civil</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>État civil</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Célibataire</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.celibataire.nombre"
                          name="celibataireNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatCivil')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.celibataire.pourcentage"
                          name="celibatairePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Marié</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.marie.nombre"
                          name="marieNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatCivil')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.marie.pourcentage"
                          name="mariePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Divorcé</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.divorce.nombre"
                          name="divorceNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatCivil')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.divorce.pourcentage"
                          name="divorcePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Veuf</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.veuf.nombre"
                          name="veufNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatCivil')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.veuf.pourcentage"
                          name="veufPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- État professionnel -->
            <div class="subsection">
              <h4 class="subsection-title">État professionnel</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>Profession</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Élève</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.eleve.nombre"
                          name="eleveNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatProfessionnel')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.eleve.pourcentage"
                          name="elevePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Étudiant</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.nombre"
                          name="etudiantNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatProfessionnel')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.pourcentage"
                          name="etudiantPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Ouvrier</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.nombre"
                          name="ouvrierNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatProfessionnel')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.pourcentage"
                          name="ouvrierPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>Fonctionnaire</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.nombre"
                          name="fonctionnaireNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('etatProfessionnel')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.pourcentage"
                          name="fonctionnairePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Niveau socioéconomique -->
            <div class="subsection">
              <h4 class="subsection-title">Niveau socioéconomique selon carnet du CNAM</h4>
              <div class="table-responsive">
                <table class="data-input-table">
                  <thead>
                    <tr>
                      <th>Type de carnet</th>
                      <th>Nombre</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Carte d'indigent 1 ou 2 ou carte AMEN</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.nombre"
                          name="carteIndigentNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('niveauSocioeconomique')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.pourcentage"
                          name="carteIndigentPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>CARNET CNAM de santé publique</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.nombre"
                          name="carnetCnamPubliqueNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('niveauSocioeconomique')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.pourcentage"
                          name="carnetCnamPubliquePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>CARNET CNAM de médecine de famille</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.nombre"
                          name="carnetCnamFamilleNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('niveauSocioeconomique')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.pourcentage"
                          name="carnetCnamFamillePourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>CARNET CNAM de remboursement</td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.nombre"
                          name="carnetCnamRemboursementNombre"
                          min="0"
                          placeholder="0"
                          [disabled]="isSaving"
                          (input)="calculatePercentages('niveauSocioeconomique')"
                        >
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-input table-input"
                          [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.pourcentage"
                          name="carnetCnamRemboursementPourcentage"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          [disabled]="isSaving"
                          readonly
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions card">
          <div class="card-body">
            <div class="actions-buttons">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="goBack()"
                [disabled]="isSaving"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!dataForm.valid || isSaving"
              >
                <span *ngIf="!isSaving">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
                <span *ngIf="isSaving" class="flex items-center gap-2">
                  <div class="loading-spinner-sm"></div>
                  {{ isEditMode ? 'Modification...' : 'Enregistrement...' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .saisie-container {
      max-width: 1200px;
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

    .form-section {
      margin-bottom: var(--spacing-6);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .subsection {
      margin-bottom: var(--spacing-8);
    }

    .subsection:last-child {
      margin-bottom: 0;
    }

    .subsection-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 var(--spacing-4) 0;
      padding-bottom: var(--spacing-2);
      border-bottom: 1px solid var(--gray-300);
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-input-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: var(--spacing-4);
    }

    .data-input-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-3);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
    }

    .data-input-table td {
      padding: var(--spacing-3);
      border: 1px solid var(--gray-200);
      vertical-align: middle;
    }

    .table-input {
      width: 100%;
      min-width: 80px;
      margin: 0;
    }

    .form-actions {
      position: sticky;
      bottom: var(--spacing-4);
      z-index: 10;
    }

    .actions-buttons {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
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
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .data-input-table {
        font-size: 14px;
      }
      
      .data-input-table th,
      .data-input-table td {
        padding: var(--spacing-2);
      }
      
      .actions-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class SaisieOffreDroguesComponent implements OnInit {
  formData: OffreDrogues = this.initializeFormData();
  dateSaisieString = '';
  isEditMode = false;
  isSaving = false;
  itemId: number | null = null;

  constructor(
    private offreDroguesService: OffreDroguesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.itemId = +params['id'];
        this.isEditMode = true;
        this.loadData();
      } else {
        this.dateSaisieString = new Date().toISOString().split('T')[0];
      }
    });
  }

  private initializeFormData(): OffreDrogues {
    return {
      dateSaisie: new Date(),
      quantitesDrogues: {
        cannabis: null,
        comprimesTableauA: null,
        ecstasyComprime: null,
        ecstasyPoudre: null,
        subutex: null,
        cocaine: null,
        heroine: null
      },
      personnesInculpees: {
        consommateur: { nombre: null, pourcentage: null },
        vendeur: { nombre: null, pourcentage: null },
        trafiquant: { nombre: null, pourcentage: null }
      },
      caracteristiquesSociodemographiques: {
        genre: {
          masculin: { nombre: null, pourcentage: null },
          feminin: { nombre: null, pourcentage: null }
        },
        age: {
          moins12ans: { nombre: null, pourcentage: null },
          moins18ans: { nombre: null, pourcentage: null },
          entre18et40: { nombre: null, pourcentage: null },
          plus40ans: { nombre: null, pourcentage: null }
        },
        nationalite: {
          tunisienne: { nombre: null, pourcentage: null },
          maghrebine: { nombre: null, pourcentage: null },
          autres: { nombre: null, pourcentage: null }
        },
        etatCivil: {
          celibataire: { nombre: null, pourcentage: null },
          marie: { nombre: null, pourcentage: null },
          divorce: { nombre: null, pourcentage: null },
          veuf: { nombre: null, pourcentage: null }
        },
        etatProfessionnel: {
          eleve: { nombre: null, pourcentage: null },
          etudiant: { nombre: null, pourcentage: null },
          ouvrier: { nombre: null, pourcentage: null },
          fonctionnaire: { nombre: null, pourcentage: null }
        },
        niveauSocioeconomique: {
          carteIndigent: { nombre: null, pourcentage: null },
          carnetCnamPublique: { nombre: null, pourcentage: null },
          carnetCnamFamille: { nombre: null, pourcentage: null },
          carnetCnamRemboursement: { nombre: null, pourcentage: null }
        }
      }
    };
  }

  private loadData(): void {
    if (!this.itemId) return;

    this.offreDroguesService.getOffreDroguesById(this.itemId).subscribe({
      next: (data) => {
        if (data) {
          this.formData = data;
          this.dateSaisieString = data.dateSaisie.toISOString().split('T')[0];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.router.navigate(['/offre-drogues']);
      }
    });
  }

  calculatePercentages(category: string): void {
    let total = 0;
    let items: any[] = [];

    switch (category) {
      case 'personnesInculpees':
        items = [
          this.formData.personnesInculpees.consommateur,
          this.formData.personnesInculpees.vendeur,
          this.formData.personnesInculpees.trafiquant
        ];
        break;
      case 'genre':
        items = [
          this.formData.caracteristiquesSociodemographiques.genre.masculin,
          this.formData.caracteristiquesSociodemographiques.genre.feminin
        ];
        break;
      case 'age':
        items = [
          this.formData.caracteristiquesSociodemographiques.age.moins12ans,
          this.formData.caracteristiquesSociodemographiques.age.moins18ans,
          this.formData.caracteristiquesSociodemographiques.age.entre18et40,
          this.formData.caracteristiquesSociodemographiques.age.plus40ans
        ];
        break;
      case 'nationalite':
        items = [
          this.formData.caracteristiquesSociodemographiques.nationalite.tunisienne,
          this.formData.caracteristiquesSociodemographiques.nationalite.maghrebine,
          this.formData.caracteristiquesSociodemographiques.nationalite.autres
        ];
        break;
      case 'etatCivil':
        items = [
          this.formData.caracteristiquesSociodemographiques.etatCivil.celibataire,
          this.formData.caracteristiquesSociodemographiques.etatCivil.marie,
          this.formData.caracteristiquesSociodemographiques.etatCivil.divorce,
          this.formData.caracteristiquesSociodemographiques.etatCivil.veuf
        ];
        break;
      case 'etatProfessionnel':
        items = [
          this.formData.caracteristiquesSociodemographiques.etatProfessionnel.eleve,
          this.formData.caracteristiquesSociodemographiques.etatProfessionnel.etudiant,
          this.formData.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier,
          this.formData.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire
        ];
        break;
      case 'niveauSocioeconomique':
        items = [
          this.formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent,
          this.formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique,
          this.formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille,
          this.formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement
        ];
        break;
    }

    // Calculer le total
    total = items.reduce((sum, item) => sum + (item.nombre || 0), 0);

    // Calculer les pourcentages
    if (total > 0) {
      items.forEach(item => {
        if (item.nombre !== null && item.nombre !== undefined) {
          item.pourcentage = Math.round((item.nombre / total) * 100 * 10) / 10;
        } else {
          item.pourcentage = null;
        }
      });
    } else {
      items.forEach(item => {
        item.pourcentage = null;
      });
    }
  }

  onSubmit(): void {
    if (!this.dateSaisieString) return;

    this.isSaving = true;
    this.formData.dateSaisie = new Date(this.dateSaisieString);

    const operation = this.isEditMode
      ? this.offreDroguesService.updateOffreDrogues(this.itemId!, this.formData)
      : this.offreDroguesService.createOffreDrogues(this.formData);

    operation.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/offre-drogues']);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Erreur lors de la sauvegarde:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/offre-drogues']);
  }
}
export interface FormulaireData {
  // Partie 1: Informations structure/centre & usager SPA
  iun?: string; // Généré automatiquement
  secteur: 'PUBLIC' | 'PRIVE' | 'ONG';
  ongPrecision?: string;
  ministere?: string;
  structure: string;
  gouvernoratStructure: string;
  nom: string;
  prenom: string;
  codePatient: string;
  dateConsultation: Date;
  genre: 'HOMME' | 'FEMME';
  dateNaissance: Date;
  nationalite: string;
  residence: 'TUNISIE' | 'ETRANGER';
  gouvernoratResidence?: string;
  delegationResidence?: string;
  paysResidence?: string;
  
  // Cadre de consultation (multiple)
  cadreConsultation: {
    addictologie?: boolean;
    addictologieType?: 'SEVRAGE' | 'GESTION_ADDICTION' | 'RISQUE_RECHUTE';
    psychiatrie?: boolean;
    psychologique?: boolean;
    medecineGenerale?: boolean;
    neurologique?: boolean;
    infectieux?: boolean;
    espaceAmisJeunes?: boolean;
    echangeMateriel?: boolean;
    rehabilitation?: boolean;
    urgenceMedicale?: boolean;
    urgenceChirurgicale?: boolean;
    depistage?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };
  
  // Origine de la demande (multiple)
  origineDemande: {
    luiMeme?: boolean;
    famille?: boolean;
    amis?: boolean;
    celluleEcoute?: boolean;
    autreCentre?: boolean;
    structureSociale?: boolean;
    structureJudiciaire?: boolean;
    jugeEnfance?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };
  
  causeCirconstance: string;
  consultationAnterieure: boolean;
  dateConsultationAnterieure?: string;
  motifConsultationAnterieure?: string;
  causeRecidive?: string;
  causeEchecSevrage?: string;
  
  situationFamiliale: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'SEPARE' | 'VEUF' | 'AUTRE';
  situationFamilialeAutre?: string;
  
  logement30Jours: 'SEUL' | 'FAMILLE_ORIGINE' | 'PARTENAIRE' | 'ENFANTS' | 'AMIS' | 'INTERNAT' | 'COLOCATION' | 'FOYER' | 'DETENTION' | 'CENTRE_JEUNESSE' | 'INSTITUTION' | 'AUTRE';
  logement30JoursAutre?: string;
  
  natureLogement: 'STABLE' | 'PRECAIRE';
  
  profession: 'EMPLOYE' | 'COMPTE_PROPRE' | 'JOURNALIER' | 'SPORTIF' | 'CHOMAGE' | 'ELEVE' | 'ETUDIANT' | 'FORMATION' | 'RETRAITE' | 'SANS_RESSOURCES';
  
  niveauScolaire: 'ANALPHABETE' | 'PRESCOLAIRE' | 'PRIMAIRE' | 'COLLEGE' | 'SECONDAIRE' | 'FORMATION_PROF' | 'UNIVERSITAIRE';
  
  activiteSportive: boolean;
  activiteSportiveFrequence?: 'REGULIERE' | 'IRREGULIERE';
  activiteSportiveType?: 'COMPETITION' | 'LOISIR';
  espacesLoisirs?: boolean;
  dopage?: boolean;
  
  // Partie 2: Consommation tabac & alcool
  consommationTabac: 'FUMEUR' | 'NON_FUMEUR' | 'EX_FUMEUR';
  agePremiereConsommationTabac?: number;
  consommationTabac30Jours?: boolean;
  frequenceTabac30Jours?: 'QUOTIDIEN' | '2_3_JOURS' | 'HEBDOMADAIRE' | 'OCCASIONNEL';
  nombreCigarettesJour?: number;
  nombrePaquetsAnnee?: number;
  ageArretTabac?: number;
  soinsSevrageTabac?: 'OUI_SATISFAIT' | 'OUI_NON_SATISFAIT' | 'NON';
  sevrageAssiste?: boolean;
  
  consommationAlcool: boolean;
  agePremiereConsommationAlcool?: number;
  consommationAlcool30Jours?: boolean;
  frequenceAlcool30Jours?: 'QUOTIDIEN' | '2_3_JOURS' | 'HEBDOMADAIRE' | 'OCCASIONNEL';
  quantiteAlcoolPrise?: number;
  typeAlcool?: {
    biere?: boolean;
    liqueurs?: boolean;
    alcoolBruler?: boolean;
    legmi?: boolean;
    boukha?: boolean;
  };
}

export interface FormulaireStep {
  id: number;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}
export const schema = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: '#/Permissions',
  type: 'object',
  title: 'Permissions',
  required: ["Dashboard", "Map","Zones","VehiculesPlusProches","Rapports","Eco","Parametrage","Maintenance","Notifications","TrajetPlanner"],
  properties: {
    Dashboard: {
      $id: '#/Permissions/dashboard',
      type: 'string',
      title: 'Consulter le Dashboard',
      default: "Afficher",
      examples: [
        "Afficher ou pas d'access"
      ],
      enum: ["Pas d'access", "Afficher"]
    },
    Map: {
      $id: '#/Permissions/map',
      type: 'object',
      title: 'Consulter les Cart',
      required: ["Vehicules", "Comparaison"],
      properties: {
        Vehicules: {
          $id: '#/Permissions/map/consulter',
          type: 'string',
          title: 'Consulter la Cart des vehicules',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
        Comparaison: {
          $id: '#/Permissions/map/compare',
          type: 'string',
          title: 'Comparer deux Cart',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
      }
    }, 
    Zones: {
      $id: '#/Permissions/Dashboard',
      type: 'string',
      title: 'Gestion des Zones',
      default: "Ajouter",
      examples: [
        "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
      ],
      enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
    },
    VehiculesPlusProches: {
      $id: '#/Permissions/vehiculesPlusProches',
      title: 'Consulter les Véhicules les plus proches',
      type: 'string',
      default: "Afficher",
      examples: [
        "Afficher ou pas d'access"
      ],
      enum: ["Pas d'access", "Afficher"]
    },
    Rapports: {
      $id: '#/Permissions/rapports',
      type: 'object',
      title: 'Consulter les rapports',
      required: ["RapportsDetailles", "RapportsJournalier", "RapportSynthetique"],
      properties: {
        RapportsDetailles: {
          $id: '#/Permissions/rapports/rapportsDetailles',
          type: 'string',
          title: 'Consulter les Rapports Détaillés',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
        RapportsJournalier: {
          $id: '#/Permissions/rapports/rapportsJournalier',
          type: 'string',
          title:  'Consulter les Rapports Journalier',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
        RapportSynthetique: {
          $id: '#/Permissions/rapports/rapportSynthetique',
          type: 'string',
          title:  'Consulter le Rapport Synthétique',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
        RapportAutomatique: {
          $id: '#/Permissions/rapports/rapportAutomatique',
          type: 'string',
          title:  'Gestion des Rapports Automatiques',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
      }
    },
    Eco: {
      $id: '#/Permissions/eco',
      type: 'object',
      title: 'Consulter l\'Eco Conduite',
      required: ["EcoConduite", "EcoDetailles"],
      properties: {
        EcoConduite: {
          $id: '#/Permissions/eco/EcoConduite',
          type: 'string',
          title: 'Consulter l\'Eco Conduite',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
        EcoDetailles: {
          $id: '#/Permissions/eco/ecoDetailles',
          type: 'string',
          title:  'Consulter l\'Eco Conduite Détaillés',
          default: "Afficher",
          examples: [
            "Afficher ou pas d'access"
          ],
          enum: ["Pas d'access", "Afficher"],
        },
      }
    },
    Parametrage: {
      $id: '#/Permissions/parametrage',
      type: 'object',
      title: 'Gestion des paramétres',
      required: ["Conducteur", "Vehicules", "Utilisateur", "CarteCarburant", "GroupeVehicules", "Alertes"],
      properties: {
        Conducteur: {
          $id: '#/Permissions/parametrage/conducteur',
          type: 'string',
          title: 'Gestion des Conducteurs',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Vehicules: {
          $id: '#/Permissions/parametrage/vehicules',
          type: 'string',
          title: 'Gestion des Véhicules',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Utilisateur: {
          $id: '#/Permissions/parametrage/utilisateur',
          type: 'string',
          title: 'Gestion des Utilisateurs',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        CarteCarburant: {
          $id: '#/Permissions/parametrage/carteCarburant',
          type: 'string',
          title: 'Gestion des Cartes Carburant',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        GroupeVehicules: {
          $id: '#/Permissions/parametrage/groupeVehicules',
          type: 'string',
          title: 'Gestion des Groupes des Vehicules',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Alertes: {
          $id: '#/Permissions/parametrage/alertes',
          type: 'string',
          title: 'Gestion des Alertes',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
      }
    },
    Maintenance: {
      $id: '#/Permissions/maintenance',
      type: 'object',
      title: 'Gestion de Maintenance',
      required: ["PlanEntretien", "Pneu", "Accidents", "Consommation"],
      properties: {
        PlanEntretien: {
          $id: '#/Permissions/maintenance/planEntretien',
          type: 'string',
          title: 'Gestion des Plans d\'Entretien',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Pneu: {
          $id: '#/Permissions/maintenance/pneu',
          type: 'string',
          title: 'Gestion des Pneus',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Accidents: {
          $id: '#/Permissions/maintenance/accidents',
          type: 'string',
          title: 'Gestion des Accidents',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
        Consommation: {
          $id: '#/Permissions/maintenance/consommation',
          type: 'string',
          title: 'Gestion des Consommations',
          default: "Ajouter",
          examples: [
            "Ajouter -> Mettre a jour -> Afficher ou pas d'access"
          ],
          enum: ["Pas d'access","Ajouter", "Mettre a jour", "Afficher"]
        },
      }
    },
    Notifications: {
      $id: '#/Permissions/notifications',
      type: 'string',
      title: 'Consulter les Notifications',
      default: "Afficher",
      examples: [
        "Afficher ou pas d'access"
      ],
      enum: ["Pas d'access", "Afficher"]
    },
    TrajetPlanner: {
      $id: '#/Permissions/trajetPlanner',
      type: 'string',
      title: 'Acceder le TrajetPlanner',
      default: "Ajouter",
      examples: [
        "Ajouter ou pas d'access"
      ],
      enum: ["Pas d'access", "Ajouter"]
    },
  }
}

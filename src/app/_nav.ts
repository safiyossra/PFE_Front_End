import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },
  // {
  //   title: true,
  //   name: 'Map'
  // },
  // {
  //   name: 'Map',
  //   url: '/map/vehicule',
  //   icon: 'cil-map'
  // },
  {
    name: 'Map',
    url: '/Map',
    icon: 'cil-map',
    children: [
      {
        name: 'Map',
        url: '/map/vehicule',
        icon: 'cil-map'
      },
      {
        name: 'Comparer Trajets',
        url: '/map/comparer',
        icon: 'cil-map'
      }
    ]
  },
  {
    name: 'Zones',
    url: '/map/zones',
    icon: 'cil-location-pin'
  },
  {
    name: 'Vehicules Plus Proches',
    url: '/map/closest',
    icon: 'cil-vector'
  },
  {
    name: 'Rapports',
    icon: 'icon-docs',
    children: [
      {
        name: 'Rapports Détaillés',
        url: '/rapports/detaille',
        icon: 'icon-book-open'
      },
      {
        name: 'Rapports journalier',
        url: '/rapports/journalier',
        icon: 'icon-graph'
      },
      {
        name: 'Rapports Synthétiques',
        url: '/rapports/synthetiques',
        icon: 'icon-pie-chart'
      },
      {
        name: 'Rapports Automatiques',
        url: '/rapports/automatique',
        icon: 'cil-settings'
      }
    ]
  },
  {
    name: 'Eco',
    url: '/eco',
    icon: 'cil-apple',
    children: [
      {
        name: 'Eco-Conduite',
        url: '/eco/rank',
        icon: 'icon-graph'
      },
      {
        name: 'Eco-Détaillés',
        url: '/eco/details',
        icon: 'icon-book-open'
      }
    ]
  },
  {
    name: 'Paramétrage',
    url: '/parametrage',
    icon: 'cil-settings'
  },
  {
    name: 'Maintenance',
    url: '/maintenance',
    icon: 'cil-recycle'
  },
  {
    name: 'Notifications',
    url: '/notifications/alerts',
    icon: 'icon-bell',
  },
  {
    name: 'Trajet Planner',
    url: '/map/planner',
    icon: 'icon-graph'
  },
  {
    name: 'Achat',
    url: '/achat',
    icon: 'cil-money'
  },
  // {
  //   name: 'AI Optimisation',
  //   url: 'http://backup.sendatrack.com:8081/',
  //   icon: 'icon-rocket'
  // },
];

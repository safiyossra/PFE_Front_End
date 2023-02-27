import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class Constant {

  constructor() { }
  public polylineStyle = [{ color: 'black', weight: 16, stroke: true, opacity: .2 }, { color: 'white', weight: 13, stroke: true, opacity: .8 }, { color: 'green', weight: 10, stroke: true, opacity: 1 }]
  
  public defaultPermissions = {
    Dashboard: "Afficher",
    Map: {
        Vehicules: "Afficher",
        Comparaison:"Afficher"
    }, 
    Zones: "Ajouter",
    VehiculesPlusProches: "Afficher",
    Rapports: {
        RapportsDetailles: "Afficher",
        RapportsJournalier: "Afficher",
        RapportSynthetique: "Afficher",
        RapportAutomatique: "Ajouter"
      },
    Eco: {
        EcoConduite:"Afficher",
        EcoDetailles:"Afficher"
    },
    Parametrage: {
        Conducteur:  "Ajouter",
        Vehicules: "Ajouter",
        Utilisateur:  "Afficher",
        CarteCarburant:  "Ajouter",
        GroupeVehicules: "Ajouter",
        Alertes:  "Ajouter"
      },
    Maintenance: {
        PlanEntretien:  "Pas d'access",
        Pneu: "Pas d'access",
        Accidents:"Pas d'access",
        Consommation: "Pas d'access"
    },
    Notifications:"Afficher",
    TrajetPlanner:"Pas d'access"
  };

  public defaultAccountPermissions = {
    Dashboard: "Ajouter",
    Map: {
        Vehicules: "Ajouter",
        Comparaison:"Ajouter"
    }, 
    Zones: "Ajouter",
    VehiculesPlusProches: "Ajouter",
    Rapports: {
        RapportsDetailles: "Ajouter",
        RapportsJournalier: "Ajouter",
        RapportSynthetique: "Ajouter",
        RapportAutomatique: "Ajouter"
      },
    Eco: {
        EcoConduite:"Ajouter",
        EcoDetailles:"Ajouter"
    },
    Parametrage: {
        Conducteur:  "Ajouter",
        Vehicules: "Ajouter",
        Utilisateur:  "Ajouter",
        CarteCarburant:  "Ajouter",
        GroupeVehicules: "Ajouter",
        Alertes:  "Ajouter"
      },
    Maintenance: {
        PlanEntretien:  "Pas d'access",
        Pneu: "Pas d'access",
        Accidents:"Pas d'access",
        Consommation: "Pas d'access"
    },
    Notifications:"Ajouter",
    TrajetPlanner:"Pas d'access"
  };

  public guestPermissions = {
    Dashboard: "Afficher",
    Map: {
        Vehicules: "Afficher",
        Comparaison:"Afficher"
    }, 
    Zones: "Afficher",
    VehiculesPlusProches: "Afficher",
    Rapports: {
        RapportsDetailles: "Afficher",
        RapportsJournalier: "Afficher",
        RapportSynthetique: "Afficher",
        RapportAutomatique: "Afficher"
      },
    Eco: {
        EcoConduite:"Afficher",
        EcoDetailles:"Afficher"
    },
    Parametrage: {
        Conducteur:  "Afficher",
        Vehicules: "Afficher",
        Utilisateur:  "Pas d'access",
        CarteCarburant:  "Afficher",
        GroupeVehicules: "Afficher",
        Alertes:  "Pas d'access"
      },
    Maintenance: {
        PlanEntretien:  "Pas d'access",
        Pneu: "Pas d'access",
        Accidents:"Pas d'access",
        Consommation: "Pas d'access"
    },
    Notifications:"Afficher",
    TrajetPlanner:"Pas d'access"
  };
  
  public userPermissions = {
    Dashboard: "Afficher",
    Map: {
        Vehicules: "Afficher",
        Comparaison:"Afficher"
    }, 
    Zones: "Afficher",
    VehiculesPlusProches: "Afficher",
    Rapports: {
        RapportsDetailles: "Afficher",
        RapportsJournalier: "Afficher",
        RapportSynthetique: "Afficher",
        RapportAutomatique: "Ajouter"
      },
    Eco: {
        EcoConduite:"Afficher",
        EcoDetailles:"Afficher"
    },
    Parametrage: {
        Conducteur:  "Mettre a jour",
        Vehicules: "Mettre a jour",
        Utilisateur:  "Pas d'access",
        CarteCarburant:  "Afficher",
        GroupeVehicules: "Afficher",
        Alertes:  "Afficher"
      },
    Maintenance: {
        PlanEntretien:  "Pas d'access",
        Pneu: "Pas d'access",
        Accidents:"Pas d'access",
        Consommation: "Pas d'access"
    },
    Notifications:"Afficher",
    TrajetPlanner:"Pas d'access"
  };

  public permissions = ["Pas d'access", "Afficher", "Mettre a jour", "Ajouter"];
  
  public timezone = [
    {
      label: "GMT+00:00",
      data: "GMT+00:00"
    },
    {
      label: "GMT+01:00",
      data: "GMT+01:00"
    },
    {
      label: "GMT+02:00",
      data: "GMT+02:00"
    },
    {
      label: "GMT+03:00",
      data: "GMT+03:00"
    },
    {
      label: "GMT+04:00",
      data: "GMT+04:00"
    },
    {
      label: "GMT+05:00",
      data: "GMT+05:00"
    },
    {
      label: "GMT+05:30",
      data: "GMT+05:30"
    },
    {
      label: "GMT+06:00",
      data: "GMT+06:00"
    },
    {
      label: "GMT+07:00",
      data: "GMT+07:00"
    },
    {
      label: "GMT+08:00",
      data: "GMT+08:00"
    },
    {
      label: "GMT+09:00",
      data: "GMT+09:00"
    },
    {
      label: "GMT+10:00",
      data: "GMT+10:00"
    },
    {
      label: "GMT+11:00",
      data: "GMT+11:00"
    },
    {
      label: "GMT+12:00",
      data: "GMT+12:00"
    },
    {
      label: "GMT+13:00",
      data: "GMT+13:00"
    },
    {
      label: "GMT+14:00",
      data: "GMT+14:00"
    },
    {
      label: "GMT-01:00",
      data: "GMT-01:00"
    },
    {
      label: "GMT-02:00",
      data: "GMT-02:00"
    },
    {
      label: "GMT-03:00",
      data: "GMT-03:00"
    },
    {
      label: "GMT-04:00",
      data: "GMT-04:00"
    },
    {
      label: "GMT-05:00",
      data: "GMT-05:00"
    },
    {
      label: "GMT-06:00",
      data: "GMT-06:00"
    },
    {
      label: "GMT-07:00",
      data: "GMT-07:00"
    },
    {
      label: "GMT-08:00",
      data: "GMT-08:00"
    },
    {
      label: "GMT-09:00",
      data: "GMT-09:00"
    },
    {
      label: "GMT-10:00",
      data: "GMT-10:00"
    },
    {
      label: "GMT-11:00",
      data: "GMT-11:00"
    },
    {
      label: "GMT-12:00",
      data: "GMT-12:00"
    },
    {
      label: "US/Hawaii",
      data: "US/Hawaii"
    },
    {
      label: "US/Alaska",
      data: "US/Alaska"
    },
    {
      label: "US/Pacific",
      data: "US/Pacific"
    },
    {
      label: "US/Arizona",
      data: "US/Arizona"
    },
    {
      label: "US/Mountain",
      data: "US/Mountain"
    },
    {
      label: "US/Central",
      data: "US/Central"
    },
    {
      label: "US/Eastern",
      data: "US/Eastern"
    },
    {
      label: "Canada/Pacific",
      data: "Canada/Pacific"
    },
    {
      label: "Canada/Mountain",
      data: "Canada/Mountain"
    },
    {
      label: "Canada/Central",
      data: "Canada/Central"
    },
    {
      label: "Canada/Eastern",
      data: "Canada/Eastern"
    },
    {
      label: "Canada/Atlantic",
      data: "Canada/Atlantic"
    },
    {
      label: "Mexico/BajaNorte",
      data: "Mexico/BajaNorte"
    },
    {
      label: "Mexico/BajaSur",
      data: "Mexico/BajaSur"
    },
    {
      label: "Mexico/General",
      data: "Mexico/General"
    },
    {
      label: "Europe/Athens",
      data: "Europe/Athens"
    },
    {
      label: "Europe/Berlin",
      data: "Europe/Berlin"
    },

    {
      label: "Europe/Dublin",
      data: "Europe/Dublin"
    },
    {
      label: "Europe/Helsinki",
      data: "Europe/Helsinki"
    },
    {
      label: "Europe/Kiev",
      data: "Europe/Kiev"
    },
    {
      label: "Europe/Lisbon",
      data: "Europe/Lisbon"
    },
    {
      label: "Europe/London",
      data: "Europe/London"
    },
    {
      label: "Europe/Madrid",
      data: "Europe/Madrid"
    },
    {
      label: "Europe/Moscow",
      data: "Europe/Moscow"
    },
    {
      label: "Europe/Oslo",
      data: "Europe/Oslo"
    },
    {
      label: "Europe/Paris",
      data: "Europe/Paris"
    },
    {
      label: "Europe/Rome",
      data: "Europe/Rome"
    },
    {
      label: "Europe/Stockholm",
      data: "Europe/Stockholm"
    },
    {
      label: "Europe/Zurich",
      data: "Europe/Zurich"
    },
    {
      label: "Pacific/Auckland",
      data: "Pacific/Auckland"
    },
    {
      label: " Pacific/Chatham",
      data: " Pacific/Chatham"
    },
  ];
  
  vehicleIcons = [{ name: "Voiture", id: "default", img: "car" }, { name: "Motor", id: "moto", img: "motor" }, { name: "Camion", id: "fleetGreen", img: "camion" },
  { name: "Sprinter", id: "bus", img: "sprinter" }, { name: "Remorque", id: "trailer", img: "remork" }, { name: "Tracteur Remorque", id: "remolque", img: "truck" },
  { name: "Tracteur", id: "volvo2", img: "truck-head" }]
  motor = ["moto", "grnbike",]
  camions = ['fleetGreen', 'fleet', 'ffight', 'yeltruck', 'blktruck', 'rgntruck', 'excav', 'grua', 'h100', 'mzcldr', 'pickup',]
  remorque = ["trailer"]
  sprinter = ['bus']
  truck = ["remolque", "volvo1",]
  truck_head = ['volvo2']
  // cars = ["", "black","brown","red","orange","yellow","green", "blue", "purple", "gray", "white", "darkred", "darkgreen", "darkblue", "darkpurple", "teal", 
  // "salmon", "gold", "pink", "lime", "bluegray", "magenta", "reddot", "greendot", "bluedot", "stop", "slow", "moving", 
  // "last", "greenh", "yellowh", "heading", "lastlabel", "lastage", "devlabel", "devlbl_r", "devlbl_g", "devlbl_b", "devlbl_y", "pp_arrow_c", 
  // "pp_arrow_y", "arrow_spd", "arrow_grn", "indexed", "4x4", "medi", "bcar", "rcar", "rgray", "banco", "rflag", "burro", 
  // "dino", "fabrica", "farmacia", "gas", "home", "hospital", "milenium", "naboo", "patito", "persona", "peru", "pinguino", "policia", "probox", "r2d2", 
  // "raton", "sniper", "taxi", "templo", "tibirium", "tiefight",  "tren", "xwing"]

  //Demarrage

  zoneIcons = [{ name: "default" }, { name: "Airport" }, { name: "ClientCustomer" }, { name: "CoffeeRestauran" }, { name: "Company" }, { name: "Desktop" },
  { name: "Factory" }, { name: "Fire_Station" }, { name: "Gas_Station" }, { name: "Hospital" }, { name: "Hotel" }, { name: "House" },
  { name: "Market" }, { name: "Mosque" }, { name: "Parking" }, { name: "Port" }, { name: "Supermarket" }, { name: "Warehouse" },]

  regExpDemarrage = /\(true\)/i
  //Speeding
  RegExpSpeed = /(?<=\$Speeding\()[a-z0-9A-Z]+(?=\))/i
  //Fuel 
  RegExpFuel = /(?<=\(\$FuelDelta\(\)<=)0\.[0-9][0-9](?=\))/i

  //InZone
  RegExpInZone = /(?<=\$InZone\(")[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+|\s(?="\))/i

  //Depart
  RegExpDepart = /(?<=\$DEPART\(")[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+|\s(?="\))/i

  //Arrive
  RegExpArrive = /(?<=\$ARRIVE\(")[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+|\s(?="\))/i

  planOperations = [
    { name: "Vidange complète", id: '6' },
    { name: "Vidange partielle", id: '5' },
    { name: "Vidange Huile Moteur", id: '10' },
    { name: "Vidange Boite a vitesse", id: '11' },
    { name: "Vidange Pont-arrière", id: '12' },
    { name: "Plaquette d'avant", id: '1' },
    { name: "Plaquette d'arrière", id: '2' },
    { name: "Disques d'avant", id: '3' },
    { name: "Disque d'arrières", id: '4' },
    { name: "Courroie de distribution", id: '7' },
    { name: "Pneus avant", id: '8' },
    { name: "Pneu d'arrière", id: '9' },
    { name: "Filtre à air", id: '13' },
    { name: "Filtre sécheur", id: '14' },
    { name: "Courroie Alternateur", id: '15' },
    { name: "Courroie Moteur", id: '16' },
    { name: "Tendeur courroie Alternateur", id: '17' },
    { name: "Tendeur courroie Moteur", id: '18' },
    { name: "Poulie de courroie", id: '19' },
    { name: "Plaquette Avant", id: '20' },
    { name: "Plaquette Arriere", id: '21' },
    { name: "Disque de freins avant", id: '22' },
    { name: "Disque de freins arrière", id: '23' },
    { name: "Disque d'embrayage", id: '24' },
    { name: "Butée d'embrayage", id: '25' },
    { name: "Plateaux d'embrayage", id: '26' },
    { name: "Kit d'embrayage", id: '27' },
    { name: "Batterie M15", id: '28' },
    { name: "Batterie M16", id: '29' },
    { name: "Batterie L3", id: '30' },
    { name: "Capteur d'huile", id: '31' },
    { name: "Capteur batterie", id: '32' },
    { name: "Démarreur", id: '33' },
    { name: "Alternateur", id: '34' },
    { name: "Tambour Avant", id: '35' },
    { name: "Tambour Arriere", id: '36' },
    { name: "Garniture avant", id: '37' },
    { name: "Garniture arrière", id: '38' },
    { name: "Eaux de refroidissement", id: '39' },
    { name: "Echarpe de direction", id: '40' },
    { name: "Turbo", id: '41' },
    { name: "Reglage soupape", id: '42' },
    { name: "Pompe à eaux", id: '43' },
    { name: "Pompe d'embrayage / servo", id: '44' }
  ]
  movingStatusCodes = [61714,61722,61723,61724,61726,61727,61728,61731,61734,61738,61792,61793,61794,61795,61796,61807,61825,61826,63792,63793,63794,63795,63799,63800,63801,63802,63840,63841,63842]
  onStatusCodes  = [62465,61713,61715,61725,62476,63809,63810,63811,63812]
  statusCodes = [
    { val: "0", name: "All Codes" },
    { val: "61713", name: "Start" },//on
    { val: "61714", name: "EnRoute" },//moving
    { val: "61715", name: "Stop" },//on
    { val: "61716", name: "Dormant" },
    { val: "61717", name: "Stopped" },
    { val: "61718", name: "Idle" },
    { val: "61719", name: "Idle_End" },
    { val: "61720", name: "Excess_Idle" },
    { val: "61722", name: "Speeding" },//moving
    { val: "61723", name: "Speeding_2" },//moving
    { val: "61724", name: "Moving" },//moving
    { val: "61725", name: "Stop_Pending" },//on
    { val: "61726", name: "Motion_Change" },//moving
    { val: "61727", name: "Heading_Change" },//moving
    { val: "61728", name: "Accelerometer" },//moving
    { val: "61731", name: "Acceleration" },//moving
    { val: "61734", name: "Deceleration" },//moving
    { val: "61738", name: "Speeding_Recover" },//moving
    { val: "57603", name: "GFMI_SendMsg3" },
    { val: "57604", name: "GFMI_SendMsg4" },
    { val: "57605", name: "GFMI_SendMsg5" },
    { val: "57606", name: "GFMI_StopLoc6" },
    { val: "57608", name: "GFMI_ReqETA8" },
    { val: "57609", name: "GFMI_AutoArr9" },
    { val: "57616", name: "GFMI_LinkOff" },
    { val: "57617", name: "GFMI_LinkOn" },
    { val: "57760", name: "GFMI_ACK" },
    { val: "57777", name: "GFMI_Message" },
    { val: "57778", name: "GFMI_MsgACK" },
    { val: "57793", name: "GFMI_StopStatus" },
    { val: "57794", name: "GFMI_StopStatus2" },
    { val: "57795", name: "GFMI_StopStatus3" },
    { val: "57796", name: "GFMI_StopStatus4" },
    { val: "57801", name: "GFMI_ETA" },
    { val: "57809", name: "GFMI_DriverID" },
    { val: "57811", name: "GFMI_DriverStat" },
    { val: "61456", name: "Initialized" },
    { val: "61472", name: "Location" },//off
    { val: "61473", name: "Location_1" },//off
    { val: "61474", name: "Location_2" },//off
    { val: "61475", name: "Location_3" },//off
    { val: "61476", name: "Location_4" },//off
    { val: "61477", name: "Last_Location" },//off
    { val: "61481", name: "Cell_Location" },//off
    { val: "61484", name: "Distance" },
    { val: "61485", name: "Distance_1" },
    { val: "61486", name: "Distance_2" },
    { val: "61488", name: "Waymark_0" },
    { val: "61489", name: "Waymark_1" },
    { val: "61490", name: "Waymark_2" },
    { val: "61491", name: "Waymark_3" },
    { val: "61492", name: "Waymark_4" },
    { val: "61493", name: "Waymark_5" },
    { val: "61494", name: "Waymark_6" },
    { val: "61495", name: "Waymark_7" },
    { val: "61496", name: "Waymark_8" },
    { val: "61497", name: "Waymark_9" },
    { val: "61504", name: "Query" },
    { val: "61508", name: "Notify" },//off
    { val: "61513", name: "Log" },//off
    { val: "61520", name: "Sample_0" },//off
    { val: "61521", name: "Sample_1" },//off
    { val: "61522", name: "Sample_2" },//off
    { val: "61536", name: "Heartbeat" },//off
    { val: "61546", name: "GPS_First_Fix" },//off
    { val: "61552", name: "POI_0" },
    { val: "61553", name: "POI_1" },
    { val: "61554", name: "POI_2" },
    { val: "61555", name: "POI_3" },
    { val: "61556", name: "POI_4" },
    { val: "61568", name: "DataMessage" },//off
    { val: "61569", name: "DataMessage_1" },//off
    { val: "61570", name: "DataMessage_2" },//off
    { val: "61584", name: "Voice" },//off
    { val: "61588", name: "Voice_Outgoing" },//off
    { val: "61592", name: "Voice_Incoming" },//off
    { val: "61600", name: "RFID_0" },//off
    { val: "61601", name: "RFID_1" },//off
    { val: "61602", name: "RFID_2" },//off
    { val: "61744", name: "Odometer_0" },
    { val: "61745", name: "Odometer_1" },
    { val: "61746", name: "Odometer_2" },
    { val: "61747", name: "Odometer_3" },
    { val: "61748", name: "Odometer_4" },
    { val: "61749", name: "Odometer_5" },
    { val: "61750", name: "Odometer_6" },
    { val: "61751", name: "Odometer_7" },
    { val: "61760", name: "OdoLimit_0" },
    { val: "61761", name: "OdoLimit_1" },
    { val: "61762", name: "OdoLimit_2" },
    { val: "61763", name: "OdoLimit_3" },
    { val: "61764", name: "OdoLimit_4" },
    { val: "61765", name: "OdoLimit_5" },
    { val: "61766", name: "OdoLimit_6" },
    { val: "61767", name: "OdoLimit_7" },
    { val: "61776", name: "Maintenance_0" },
    { val: "61777", name: "Maintenance_1" },
    { val: "61778", name: "Maintenance_2" },
    { val: "61779", name: "Maintenance_3" },
    { val: "61780", name: "Maintenance_4" },
    { val: "61792", name: "Speeding_Begin" },//moving
    { val: "61793", name: "Speeding_Limit 1" },//moving
    { val: "61794", name: "Speeding_Limit 2" },//moving
    { val: "61795", name: "Speeding_Limit 3" },//moving
    { val: "61796", name: "Speeding_Limit 4" },//moving
    { val: "61807", name: "Speeding_End" },//moving
    { val: "61825", name: "Track_Start" },//moving
    { val: "61826", name: "Track_Location" },//moving
    { val: "61827", name: "Track_Stop" },//off
    { val: "61831", name: "Job_Start" },
    { val: "61832", name: "Job_Stop" },
    { val: "61968", name: "Arrive" },
    { val: "61971", name: "Corridor_Arrive" },
    { val: "61973", name: "Job_Arrive" },
    { val: "61977", name: "Proximity_Arrive" },
    { val: "62000", name: "Depart" },
    { val: "62003", name: "Corridor_Depart" },
    { val: "62005", name: "Job_Depart" },
    { val: "62009", name: "Proximity_Depart" },
    { val: "62032", name: "Geofence" },
    { val: "62040", name: "Geo_Corridor" },
    { val: "62064", name: "Geof_Active" },
    { val: "62072", name: "Corr_Active" },
    { val: "62080", name: "Geof_Inactive" },
    { val: "62088", name: "Corr_Inactive" },
    { val: "62112", name: "Boundary_Enter" },
    { val: "62128", name: "Boundary_Exit" },
    { val: "62144", name: "Parked" },
    { val: "62147", name: "Excess_Park" },
    { val: "62150", name: "UnParked" },
    { val: "62160", name: "AltitudeViolation" },
    { val: "62464", name: "Inputs" },
    { val: "62465", name: "Moteur on" },//On
    { val: "62466", name: "Input_On" },
    { val: "62467", name: "Moteur OFF" },//off
    { val: "62468", name: "Input_Off" },
    { val: "62470", name: "Outputs" },
    { val: "62472", name: "Output_On" },
    { val: "62474", name: "Output_Off" },
    { val: "62476", name: "Engine_Start" },//On
    { val: "62477", name: "Engine_Stop" },//off
    { val: "62496", name: "InputOn_0" },
    { val: "62497", name: "InputOn_1" },
    { val: "62498", name: "InputOn_2" },
    { val: "62499", name: "InputOn_3" },
    { val: "62500", name: "InputOn_4" },
    { val: "62501", name: "InputOn_5" },
    { val: "62502", name: "InputOn_6" },
    { val: "62503", name: "InputOn_7" },
    { val: "62504", name: "InputOn_8" },
    { val: "62505", name: "InputOn_9" },
    { val: "62506", name: "InputOn_10" },
    { val: "62507", name: "InputOn_11" },
    { val: "62508", name: "InputOn_12" },
    { val: "62509", name: "InputOn_13" },
    { val: "62510", name: "InputOn_14" },
    { val: "62511", name: "InputOn_15" },
    { val: "62512", name: "InputOn_16" },
    { val: "62513", name: "InputOn_17" },
    { val: "62514", name: "InputOn_18" },
    { val: "62515", name: "InputOn_19" },
    { val: "62516", name: "InputOn_20" },
    { val: "62517", name: "InputOn_21" },
    { val: "62518", name: "InputOn_22" },
    { val: "62519", name: "InputOn_23" },
    { val: "62520", name: "InputOn_24" },
    { val: "62521", name: "InputOn_25" },
    { val: "62522", name: "InputOn_26" },
    { val: "62528", name: "InputOff_0" },
    { val: "62529", name: "InputOff_1" },
    { val: "62530", name: "InputOff_2" },
    { val: "62531", name: "InputOff_3" },
    { val: "62532", name: "InputOff_4" },
    { val: "62533", name: "InputOff_5" },
    { val: "62534", name: "InputOff_6" },
    { val: "62535", name: "InputOff_7" },
    { val: "62536", name: "InputOff_8" },
    { val: "62537", name: "InputOff_9" },
    { val: "62538", name: "InputOff_10" },
    { val: "62539", name: "InputOff_11" },
    { val: "62540", name: "InputOff_12" },
    { val: "62541", name: "InputOff_13" },
    { val: "62542", name: "InputOff_14" },
    { val: "62543", name: "InputOff_15" },
    { val: "62544", name: "InputOff_16" },
    { val: "62545", name: "InputOff_17" },
    { val: "62546", name: "InputOff_18" },
    { val: "62547", name: "InputOff_19" },
    { val: "62548", name: "InputOff_20" },
    { val: "62549", name: "InputOff_21" },
    { val: "62550", name: "InputOff_22" },
    { val: "62551", name: "InputOff_23" },
    { val: "62552", name: "InputOff_24" },
    { val: "62553", name: "InputOff_25" },
    { val: "62554", name: "InputOff_26" },
    { val: "62560", name: "OutputOn_0" },
    { val: "62561", name: "OutputOn_1" },
    { val: "62562", name: "OutputOn_2" },
    { val: "62563", name: "OutputOn_3" },
    { val: "62564", name: "OutputOn_4" },
    { val: "62565", name: "OutputOn_5" },
    { val: "62566", name: "OutputOn_6" },
    { val: "62567", name: "OutputOn_7" },
    { val: "62568", name: "OutputOn_8" },
    { val: "62569", name: "OutputOn_9" },
    { val: "62592", name: "OutputOff_0" },
    { val: "62593", name: "OutputOff_1" },
    { val: "62594", name: "OutputOff_2" },
    { val: "62595", name: "OutputOff_3" },
    { val: "62596", name: "OutputOff_4" },
    { val: "62597", name: "OutputOff_5" },
    { val: "62598", name: "OutputOff_6" },
    { val: "62599", name: "OutputOff_7" },
    { val: "62600", name: "OutputOff_8" },
    { val: "62601", name: "OutputOff_9" },
    { val: "62624", name: "Elapse_0" },
    { val: "62625", name: "Elapse_1" },
    { val: "62626", name: "Elapse_2" },
    { val: "62627", name: "Elapse_3" },
    { val: "62628", name: "Elapse_4" },
    { val: "62629", name: "Elapse_5" },
    { val: "62630", name: "Elapse_6" },
    { val: "62631", name: "Elapse_7" },
    { val: "62640", name: "ElaLimit_0" },
    { val: "62641", name: "ElaLimit_1" },
    { val: "62642", name: "ElaLimit_2" },
    { val: "62643", name: "ElaLimit_3" },
    { val: "62644", name: "ElaLimit_4" },
    { val: "62645", name: "ElaLimit_5" },
    { val: "62646", name: "ElaLimit_6" },
    { val: "62647", name: "ElaLimit_7" },
    { val: "62672", name: "DoorOpen" },//off
    { val: "62673", name: "DoorOpen_1" },//off
    { val: "62674", name: "DoorOpen_2" },//off
    { val: "62675", name: "DoorOpen_3" },//off
    { val: "62676", name: "DoorOpen_4" },//off
    { val: "62677", name: "DoorOpen_5" },//off
    { val: "62682", name: "SeatbeltOn" },
    { val: "62683", name: "SeatbeltOn_1" },
    { val: "62684", name: "SeatbeltOn_2" },
    { val: "62685", name: "SeatbeltOn_3" },
    { val: "62688", name: "DoorClose" },//off
    { val: "62689", name: "DoorClose_1" },//off
    { val: "62690", name: "DoorClose_2" },//off
    { val: "62691", name: "DoorClose_3" },//off
    { val: "62692", name: "DoorClose_4" },//off
    { val: "62693", name: "DoorClose_5" },//off
    { val: "62698", name: "SeatbeltOff" },//off
    { val: "62699", name: "SeatbeltOff_1" },//off
    { val: "62700", name: "SeatbeltOff_2" },//off
    { val: "62701", name: "SeatbeltOff_3" },//off
    { val: "62976", name: "Analog_0" },
    { val: "62977", name: "Analog_1" },
    { val: "62978", name: "Analog_2" },
    { val: "62979", name: "Analog_3" },
    { val: "62980", name: "Analog_4" },
    { val: "62981", name: "Analog_5" },
    { val: "62982", name: "Analog_6" },
    { val: "62983", name: "Analog_7" },
    { val: "63008", name: "AnalogRange_0" },
    { val: "63009", name: "AnalogRange_1" },
    { val: "63010", name: "AnalogRange_2" },
    { val: "63011", name: "AnalogRange_3" },
    { val: "63012", name: "AnalogRange_4" },
    { val: "63013", name: "AnalogRange_5" },
    { val: "63014", name: "AnalogRange_6" },
    { val: "63015", name: "AnalogRange_7" },
    { val: "63072", name: "HumidityLow" },
    { val: "63088", name: "HumidityHigh" },
    { val: "63104", name: "HumidityRange" },
    { val: "63136", name: "PressureLow" },
    { val: "63152", name: "PressureHigh" },
    { val: "63168", name: "PressureRange" },
    { val: "63248", name: "Temp_0" },
    { val: "63249", name: "Temp_1" },
    { val: "63250", name: "Temp_2" },
    { val: "63251", name: "Temp_3" },
    { val: "63252", name: "Temp_4" },
    { val: "63253", name: "Temp_5" },
    { val: "63254", name: "Temp_6" },
    { val: "63255", name: "Temp_7" },
    { val: "63280", name: "TempRange_0" },
    { val: "63281", name: "TempRange_1" },
    { val: "63282", name: "TempRange_2" },
    { val: "63283", name: "TempRange_3" },
    { val: "63284", name: "TempRange_4" },
    { val: "63285", name: "TempRange_5" },
    { val: "63286", name: "TempRange_6" },
    { val: "63287", name: "TempRange_7" },
    { val: "63296", name: "Temp_Low" },
    { val: "63312", name: "Temp_High" },
    { val: "63473", name: "Temp_All" },
    { val: "63505", name: "Login" },
    { val: "63506", name: "Logout" },
    { val: "63511", name: "Armed" },
    { val: "63512", name: "Disarmed" },
    { val: "63517", name: "Tag_Battery_Low" },
    { val: "63520", name: "Entity_State" },
    { val: "63521", name: "Connect" },
    { val: "63522", name: "Disconnect" },
    { val: "63523", name: "Inventory" },
    { val: "63524", name: "Trailer_State" },
    { val: "63525", name: "Trailer_Hook" },
    { val: "63526", name: "Trailer_Unhook" },
    { val: "63527", name: "Trailer_Invntory" },
    { val: "63528", name: "RFID_State" },
    { val: "63529", name: "RFID_Connect" },
    { val: "63530", name: "RFID_Disconn" },
    { val: "63531", name: "RFID_Inventory" },
    { val: "63532", name: "Person_Embark" },
    { val: "63533", name: "Person_Disembark" },
    { val: "63534", name: "Person_Inventory" },
    { val: "63535", name: "Person_State" },
    { val: "63537", name: "Ack" },
    { val: "63538", name: "Nak" },
    { val: "63539", name: "Command_Ack" },
    { val: "63540", name: "Command_Nak" },
    { val: "63543", name: "Duty_On" },
    { val: "63544", name: "Duty_Off" },
    { val: "63553", name: "Panic" },
    { val: "63554", name: "Panic_Off" },
    { val: "63555", name: "Push_To_Talk" },
    { val: "63556", name: "Push_To_Talk_Off" },
    { val: "63559", name: "Alarm" },
    { val: "63560", name: "Alarm_Off" },
    { val: "63563", name: "Sensor_On" },
    { val: "63564", name: "Sensor_Off" },
    { val: "63569", name: "Assist" },
    { val: "63570", name: "Assist_Off" },
    { val: "63573", name: "ManDown" },
    { val: "63574", name: "ManDown_Off" },
    { val: "63585", name: "Medical" },
    { val: "63586", name: "Medical_Off" },
    { val: "63590", name: "Driver_Auth" },
    { val: "63591", name: "Driver_Unauth" },
    { val: "63592", name: "Driver_Drowsy" },
    { val: "63593", name: "Driver_Sleep" },
    { val: "63594", name: "Driver_Wake" },
    { val: "63601", name: "Tow" },
    { val: "63602", name: "Tow_Stop" },
    { val: "63603", name: "Tow_Enroute" },
    { val: "63617", name: "Intrusion" },
    { val: "63618", name: "Intrusion_Off" },
    { val: "63621", name: "Tamper" },
    { val: "63622", name: "Tamper_Off" },
    { val: "63625", name: "Breach" },
    { val: "63626", name: "Breach_Off" },
    { val: "63627", name: "Clasp_On" },
    { val: "63628", name: "Clasp_Off" },
    { val: "63629", name: "Safety_On" },
    { val: "63630", name: "Safety_Off" },
    { val: "63633", name: "Vibration" },
    { val: "63634", name: "Vibration_Off" },
    { val: "63641", name: "PTO_On" },
    { val: "63642", name: "PTO_Off" },
    { val: "63645", name: "Online" },
    { val: "63646", name: "Offline" },
    { val: "63648", name: "Lighting_Changed" },
    { val: "63651", name: "Lighting_Bright" },
    { val: "63654", name: "Lighting_Dark" },
    { val: "63664", name: "Carjack_Disable" },
    { val: "63665", name: "Carjack_Enable" },
    { val: "63666", name: "Carjack_StandBy" },
    { val: "63667", name: "Carjack_Armed" },
    { val: "63669", name: "Carjack_Trigger" },
    { val: "63671", name: "Carjack_Cancel" },
    { val: "63680", name: "Vehicle_Disable" },
    { val: "63681", name: "Vehicle_Enable" },
    { val: "63744", name: "OBD_Info_0" },
    { val: "63745", name: "OBD_Info_1" },
    { val: "63746", name: "OBD_Info_2" },
    { val: "63747", name: "OBD_Info_3" },
    { val: "63748", name: "OBD_Info_4" },
    { val: "63759", name: "OBD_Connect" },
    { val: "63760", name: "OBD_Disconnect" },
    { val: "63761", name: "OBD_Fault" },
    { val: "63765", name: "Check_Engine_On" },
    { val: "63766", name: "Check_Engine_Off" },
    { val: "63776", name: "OBD_Range" },
    { val: "63778", name: "RPM_Range" },
    { val: "63779", name: "RPM_OK" },
    { val: "63780", name: "OBD_Fuel" },
    { val: "63782", name: "OBD_Oil" },
    { val: "63784", name: "OBD_Temp_Range" },
    { val: "63786", name: "Engine_Load" },
    { val: "63788", name: "OBD_Coolant_Range" },
    { val: "63789", name: "OBD_Coolant_OK" },
    { val: "63790", name: "Harsh_Behavior" },
    { val: "63792", name: "Braking" },//moving
    { val: "63793", name: "Braking_2" },//moving
    { val: "63794", name: "Braking_3" },//moving
    { val: "63795", name: "Braking_4" },//moving
    { val: "63799", name: "Cornering" },//moving
    { val: "63800", name: "Cornering_2" },//moving
    { val: "63801", name: "Cornering_3" },//moving
    { val: "63802", name: "Cornering_4" },//moving
    { val: "63809", name: "Impact" },//on
    { val: "63810", name: "Impact_Data_1" },//on
    { val: "63811", name: "Impact_Data_2" },//on
    { val: "63812", name: "Impact_Data_3" },//on
    { val: "63813", name: "FreeFall" },
    { val: "63825", name: "Fuel_Refill" },
    { val: "63826", name: "Fuel_Theft" },
    { val: "63828", name: "Fuel_Low" },
    { val: "63834", name: "Fuel_Dirty" },
    { val: "63838", name: "Fuel_Sensor" },
    { val: "63840", name: "Excess_Accel" },//moving
    { val: "63841", name: "Excess_Accel_2" },//moving
    { val: "63842", name: "Excess_Accel_3" },//moving
    { val: "64000", name: "Day_Summary" },
    { val: "64064", name: "Trip_Summary" },
    { val: "64416", name: "Tire_Temp_Range" },
    { val: "64432", name: "Tire_Pressure" },
    { val: "64448", name: "Tire_Low" },
    { val: "64464", name: "Tire_Battery_Low" },
    { val: "64769", name: "IP_Address" },
    { val: "64771", name: "SIM_Card" },
    { val: "64774", name: "Low Voltage" },
    { val: "64775", name: "High Voltage" },
    { val: "64778", name: "Battery_Volts" },
    { val: "64780", name: "Backup_Volts" },
    { val: "64782", name: "Battery_Charge" },
    { val: "64783", name: "Charge_Complete" },
    { val: "64784", name: "Low_Battery" },
    { val: "64785", name: "Battery_Level" },
    { val: "64787", name: "Power_Disconnect" },
    { val: "64788", name: "Power_Alarm" },
    { val: "64789", name: "Power_Connect" },
    { val: "64791", name: "Power_Off" },
    { val: "64793", name: "Power_On" },
    { val: "64795", name: "Low_Power_Mode" },
    { val: "64796", name: "Full_Power_Mode" },
    { val: "64798", name: "GPS_Off" },
    { val: "64799", name: "GPS_On" },
    { val: "64801", name: "GPS_Expired" },
    { val: "64802", name: "GPS_Failure" },
    { val: "64803", name: "GPS_AntOpen" },
    { val: "64804", name: "GPS_AntShort" },
    { val: "64805", name: "GPS_Jamming" },
    { val: "64806", name: "GPS_Restored" },
    { val: "64807", name: "GPS_Lost" },
    { val: "64810", name: "CalibrationStart" },
    { val: "64811", name: "CalibrationEnd" },
    { val: "64812", name: "CalibrationFail" },
    { val: "64816", name: "Diagnostic" },
    { val: "64817", name: "Connect_Failure" },
    { val: "64818", name: "Connect_Restore" },
    { val: "64819", name: "Modem_Failure" },
    { val: "64821", name: "Intern_Failure" },
    { val: "64825", name: "Modem_Jamming" },
    { val: "64826", name: "Modem_Restored" },
    { val: "64833", name: "Config_Reset" },
    { val: "64834", name: "Config_Start" },
    { val: "64835", name: "Config_Complete" },
    { val: "64836", name: "Config_Failed" },
    { val: "64837", name: "Shutdown" },
    { val: "64840", name: "Suspend" },
    { val: "64842", name: "Resume" },
    { val: "64849", name: "Roaming" },
    { val: "64850", name: "Roaming_Off" },
    { val: "64851", name: "Roaming_Unknown" },
    { val: "64864", name: "Image_0" },
    { val: "64865", name: "Image_1" },
    { val: "64866", name: "Image_2" },
    { val: "64867", name: "Image_3" },
    { val: "64868", name: "Image_4" },
    { val: "64880", name: "ImageLoc_0" },
    { val: "64881", name: "ImageLoc_1" },
    { val: "64882", name: "ImageLoc_2" },
    { val: "64883", name: "ImageLoc_3" },
    { val: "64884", name: "ImageLoc_4" },
    { val: "65280", name: "Rule_0" },
    { val: "65281", name: "Rule_1" },
    { val: "65282", name: "Rule_2" },
    { val: "65283", name: "Rule_3" },
    { val: "65284", name: "Rule_4" },
    { val: "65285", name: "Rule_5" },
    { val: "65286", name: "Rule_6" },
    { val: "65287", name: "Rule_7" }
  ]


  public marques: any = [
    {

      name: 'BARUM',
      models: [
        { name: 'BARUM bravuris 3' },
        { name: 'BARUM bravuris 5' },
        { name: 'BARUM bravuris 4x4' },
        { name: 'BARUM bravuris 2' },
        { name: 'BARUM polaris 5' },
        { name: 'BARUM polaris 3' },
        { name: 'BARUM quartaris 5' }
      ]
    },

    {

      name: 'BRIDGESTONE',
      models: [
        { name: 'BRIDGESTONE turanza t005' },
        { name: 'BRIDGESTONE turanza er3' },
        { name: 'BRIDGESTONE turanza er' },
        { name: 'BRIDGESTONE turanza e' },
        { name: 'BRIDGESTONE turanza er4' },
        { name: 'BRIDGESTONE blizzak lm-' },
        { name: 'BRIDGESTONE weather c' },
        { name: 'BRIDGESTONE potenza spo' },
        { name: 'BRIDGESTONE potenza s00' },
        { name: 'BRIDGESTONE ecopia ep15' },
      ]
    },
    {

      name: 'CONTINENTAL',
      models: [
        { name: 'CONTINENTAL ecocontact' },
        { name: 'CONTINENTAL premiumco' },
        { name: 'CONTINENTAL sportconta' },
        { name: 'CONTINENTAL contisportcon' },
        { name: 'CONTINENTAL contiecocon' },
        { name: 'CONTINENTAL contisport' },
        { name: 'CONTINENTAL contipremiu' },
        { name: 'CONTINENTAL contiecoc' },
        { name: 'CONTINENTAL winterconta' },
        { name: 'CONTINENTAL premiumco' },
        { name: 'CONTINENTAL contiwinte' },
        { name: 'CONTINENTAL contiwint' },
      ]
    },
    {

      name: 'DUNLOP',
      models: [
        { name: 'DUNLOP sport maxx race 2' },
        { name: 'DUNLOP sport blurespons' },
        { name: 'DUNLOP sport classic' },
        { name: 'DUNLOP streetresponse 2' },
        { name: 'DUNLOP sp sport fastrespo' },
        { name: 'DUNLOP sp sport maxx tt' },
        { name: 'DUNLOP sp sport 01 a' },
        { name: 'DUNLOP sp sport maxx g' },
        { name: 'DUNLOP sport maxx rt 2' },
        { name: 'DUNLOP sp sport maxx gt' },
        { name: 'DUNLOP sp sport maxx' },
        { name: 'DUNLOP sp sport 01' },
        { name: 'DUNLOP sp sport 270' },
        { name: 'DUNLOP winter sport 5' },
        { name: 'DUNLOP winter response' },
        { name: 'DUNLOP sp sinter respons' },
        { name: 'DUNLOP sp wintersport 4d' },
        { name: 'DUNLOP sp winter sport' },
        { name: 'DUNLOP sp winter sport 3d' },
        { name: 'DUNLOP sport allseason' }

      ]
    },
    {

      name: 'GOODYEAR',
      models: [
        { name: 'GOODYEAR efficientgrip p' },
        { name: 'GOODYEAR eagle f1 supe' },
        { name: 'GOODYEAR eagle f1 super' },
        { name: 'GOODYEAR eagle f1 asy' },
        { name: 'GOODYEAR eagle f1 asym' },
        { name: 'GOODYEAR efficientgrip' },
        { name: 'GOODYEAR excellence' },
        { name: 'GOODYEAR efficientgrip c' },
        { name: 'GOODYEAR cargo vector 2' },
        { name: 'GOODYEAR ultragrip pe' },
        { name: 'GOODYEAR ultragrip perf' },
        { name: 'GOODYEAR ultragrip perfo' },
        { name: 'GOODYEAR ultragrip 8 p' },

      ]
    },
    {

      name: 'HAIDA',
      models: [
        { name: 'HAIDA hd667' },
        { name: 'HAIDA hd927' },

      ]
    },
    {

      name: 'HANKOOK',
      models: [
        { name: 'HANKOOK k715' },
        { name: 'HANKOOK k435' },
        { name: 'HANKOOK k125' },
        { name: 'HANKOOK k115' },
        { name: 'HANKOOK k117' },
        { name: 'HANKOOK k120' },
        { name: 'HANKOOK k127' },
        { name: 'HANKOOK k17a' },

      ]
    },
    {

      name: 'LAUFENN',
      models: [
        { name: 'LAUFENN lh71' },
        { name: 'LAUFENN lk01' },
        { name: 'LAUFENN lk41' },

      ]
    },
    {

      name: 'MABOR',
      models: [
        { name: 'MABOR sport-jet 3' },
        { name: 'MABOR winter-jet 3' },
      ]
    },
    {

      name: 'MICHELIN',
      models: [
        { name: 'MICHELIN e primacy' },
        { name: 'MICHELIN primacy 4' },
        { name: 'MICHELIN pilot sport 4' },
        { name: 'MICHELIN primacy 3' },
        { name: 'MICHELIN pilot sport 3' },
        { name: 'MICHELIN pilot super sport' },
        { name: 'MICHELIN pilot sport cup' },
        { name: 'MICHELIN pilot sport cup 2' },
        { name: 'MICHELIN alpin 5' },
        { name: 'MICHELIN pilot alpin 5' },
        { name: 'MICHELIN pilot alpin pa4' },
        { name: 'MICHELIN pilot sport cup 2' },
        { name: 'MICHELIN pilot sport ev' },
      ]
    },
    {

      name: 'NEXEN',
      models: [
        { name: 'NEXEN n blue hd plus' },
        { name: 'NEXEN n blue eco' },
        { name: 'NEXEN n fera sport' },
        { name: 'NEXEN n blue hd' },
        { name: 'NEXEN n fera ru1' },
        { name: 'NEXEN n fera premium' },
        { name: 'NEXEN roadian hp' },
        { name: 'NEXEN n blue hd' },
        { name: 'NEXEN n fera primus' },
        { name: 'NEXEN winguard sport' },
        { name: 'NEXEN winguard sport 2' },
        { name: 'NEXEN n sfera su4' },
        { name: 'NEXEN n sfera ru1' },

      ]
    },
    {

      name: 'PIRELLI',
      models: [
        { name: 'PIRELLI p zero corsa' },
        { name: 'PIRELLI p zero corsa system' },
        { name: 'PIRELLI p zero' },
        { name: 'PIRELLI p zero rosso' },
        { name: 'PIRELLI p zero nero gt' },
        { name: 'PIRELLI cinturato p7' },
        { name: 'PIRELLI cinturato p7 blue' },
        { name: 'PIRELLI p zero winter' },
        { name: 'PIRELLI cinturato winter 2' },
        { name: 'PIRELLI cinturato all season' },
        { name: 'PIRELLI cinturato all seas' },
        { name: 'PIRELLI cinturato all seaso' },
      ]
    },
    {

      name: 'SAILUN',
      models: [
        { name: 'SAILUN atrezzo eco' },
        { name: 'SAILUN atrezzo elite' },
        { name: 'SAILUN atrezzo zsr' },
        { name: 'SAILUN atrezzo zsr run-flat' },
        { name: 'SAILUN atrezzo 4seasons' },
        { name: 'SAILUN atrezzo z4+as' },
      ]
    },
  ];

  public dimentions: any = [
    { name: '1' },
    { name: '2' }
  ];
  public motifs: any = [
    { name: 'Fin de vie' },
  ]


  public etats: any = [
    { name: 'Neuf' },
    { name: 'Occasion' },
  ]

  typeDocuments = [{ name: "Assurance" }, { name: "Autorisation Circulation" }, { name: "Carnet Métrologique" },
  { name: "Carte Grise" }, { name: "Carte Vert" }, { name: "Taxe" }, { name: "Vignette" }, { name: "Visites Technique" }]

  permisTypes = [
    {
      value: 'A',
    },
    {
      value: 'A1',
    },
    {
      value: 'B',
    },
    {
      value: 'C',
    },
    {
      value: 'D',
    },
    {
      value: 'EC',
    },
    {
      value: 'EB',
    },
    {
      value: 'ED',
    },
  ]

    /******* bloc added ********** */
    degatTypes = [{
      value: 'Dégât Matériel',
      icon: 'materiel'
    },
    {
      value: 'Dégât Corporel',
      icon: 'corporel'
    },
    {
      value: 'Dégât Mortel',
      icon: 'mortel'
    },]

    reportTypes = [
    {val:':',text:"---"},
    {val:'RWD_EventDetail_Group',text:"Groupe de véhicules Detail: Détail par groupe"},
    {val:'EventDetail_Group',text:"Groupe de véhicules Detail: Détail par groupe"},
    {val:'TripReport_Group:default',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Par défaut]"},
    {val:'TripReport_Group:ignition',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupé par les codes d'allumage 'On/Off' envoyés par les équipements]"},
    {val:'TripReport_Group:startstop',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupé par les codes 'Start/Stop' envoyés par les équipements]"},
    {val:'TripReport_Group:engine',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Based on Engine Start/Stop Status Codes]"},
    {val:'TripReport_Group:motion0',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Based on 0 Minute Minimum Stop]"},
    {val:'TripReport_Group:motion5',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupés par des arrêts de plus de 5 minutes]"},
    {val:'TripReport_Group:motion10',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupés par des arrêts de plus de 10 minutes]"},
    {val:'TripReport_Group:motion20',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupés par des arrêts de plus de 20 minutes]"},
    {val:'TripReport_Group:motion30',text:"Groupe de véhicules Detail: Trip Report Detail (by Group) [Groupés par des arrêts de plus de 30 minutes]"},
    {val:'MotionSummary_Group:default',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Default]"},
    {val:'MotionSummary_Group:ignition',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on Ignition On/Off Status Codes]"},
    {val:'MotionSummary_Group:startstop',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on Motion Start/Stop Status Codes]"},
    {val:'MotionSummary_Group:engine',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on Engine Start/Stop Status Codes]"},
    {val:'MotionSummary_Group:motion0',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on 0 Minute Minimum Stop]"},
    {val:'MotionSummary_Group:motion5',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on 5 Minute Minimum Stop]"},
    {val:'MotionSummary_Group:motion10',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on 10 Minute Minimum Stop]"},
    {val:'MotionSummary_Group:motion20',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on 20 Minute Minimum Stop]"},
    {val:'MotionSummary_Group:motion30',text:"Groupe de véhicules Detail: Driving/Stopped Time Summary (by Group) [Based on 30 Minute Minimum Stop]"},
    {val:'GeozoneReport_Group:ALL',text:"Groupe de véhicules Detail: Rapport de Geozone par groupe"},
    {val:'GeozoneReport_Group:tanger',text:"Groupe de véhicules Detail: Rapport de Geozone par groupe"},
    {val:'GeozoneDriving_Group:ALL',text:"Groupe de véhicules Detail: Geozone Arrival Report (by Group) [All Geozones (ALL)]"},
    {val:'GeozoneDriving_Group:tanger',text:"Groupe de véhicules Detail: Geozone Arrival Report (by Group) [Custom Zone (tanger)]"},
    {val:'EventSpeedOption_Group:45mph',text:"Groupe de véhicules Detail: Speeds over 72 Km/H"},
    {val:'EventSpeedOption_Group:50mph',text:"Groupe de véhicules Detail: Speeds over 80 Km/H"},
    {val:'EventSpeedOption_Group:55mph',text:"Groupe de véhicules Detail: Speeds over 89 Km/H"},
    {val:'EventSpeedOption_Group:60mph',text:"Groupe de véhicules Detail: Speeds over 97 Km/H"},
    {val:'EventSpeedOption_Group:65mph',text:"Groupe de véhicules Detail: Speeds over 105 Km/H"},
    {val:'EventSpeedOption_Group:70mph',text:"Groupe de véhicules Detail: Speeds over 113 Km/H"},
    {val:'EventSpeedOption_Group:75mph',text:"Groupe de véhicules Detail: Speeds over 121 Km/H"},
    {val:'EventExcessSpeed_Group',text:"Groupe de véhicules Detail: Excès de vitesse"},
    {val:'DigitalInputDetailReport_Group:input0',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #0]"},
    {val:'DigitalInputDetailReport_Group:input1',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #1]"},
    {val:'DigitalInputDetailReport_Group:input2',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #2]"},
    {val:'DigitalInputDetailReport_Group:input3',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #3]"},
    {val:'DigitalInputDetailReport_Group:input4',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #4]"},
    {val:'DigitalInputDetailReport_Group:input5',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #5]"},
    {val:'DigitalInputDetailReport_Group:input6',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #6]"},
    {val:'DigitalInputDetailReport_Group:input7',text:"Groupe de véhicules Detail: Digital Input Detail Report [Input #7]"},
    {val:'NotifyQueueDetail_Group',text:"Groupe de véhicules Detail: Véhicule Alert Detail"},
    {val:'EventDataSummary:all',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode0',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode1',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode2',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode3',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode4',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode5',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode6',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode7',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode8',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode9',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode10',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode11',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'EventDataSummary:statuscode12',text:"Rapports résumés de la flotte:: Résumé des dernières positions connues"},
    {val:'FirstEventSummary:all',text:"Rapports résumés de la flotte:: Premier Ev\u00E9nement Véhicule arr\u00E9t\u00E9 [Ignition On]"},
    {val:'FirstEventSummary:motion',text:"Rapports résumés de la flotte:: Premier Ev\u00E9nement Véhicule arr\u00E9t\u00E9 [Moving]"},
    {val:'ExcessiveLastCheckIn:1day',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[Pus de 1 jour]"},
    {val:'ExcessiveLastCheckIn:2days',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[Plus de 2 jours]"},
    {val:'ExcessiveLastCheckIn:3days',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[Plus de 3 jours]"},
    {val:'ExcessiveLastCheckIn:7days',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[plus de 7 jours]"},
    {val:'ExcessiveLastCheckIn:30days',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[plus de 30 jours]"},
    {val:'ExcessiveLastCheckIn:100days',text:"Rapports résumés de la flotte:: Contr\u00f4le retard positions re\u00e7us[plus de 100 jours]"},
    {val:'PeriodicServiceOdom',text:"Rapports résumés de la flotte:: Rapport service periodique kilométrage"},
    {val:'DistanceTraveled',text:"Rapports résumés de la flotte:: Distances parcourues"},
    {val:'IgnitionSummaryReport',text:"Rapports résumés de la flotte:: Rapport global d'allumage"},
    {val:'FleetMotion:default',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Par défaut]"},
    {val:'FleetMotion:ignition',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par les codes d'allumage 'On/Off' envoyés par les équipements]"},
    {val:'FleetMotion:startstop',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par les codes 'Start/Stop' envoyés par les équipements]"},
    {val:'FleetMotion:engine',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Based on Engine Start/Stop Status Codes]"},
    {val:'FleetMotion:motion0',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Based on 0 Minute Minimum Stop]"},
    {val:'FleetMotion:motion5',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par des arrêts de plus de 5 minutes]"},
    {val:'FleetMotion:motion10',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par des arrêts de plus de 10 minutes]"},
    {val:'FleetMotion:motion20',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par des arrêts de plus de 20 minutes]"},
    {val:'FleetMotion:motion30',text:"Rapports résumés de la flotte:: Rapport synthétique des parcours [Groupé par des arrêts de plus de 30 minutes]"},
    {val:'FleetIdle:default',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Default]"},
    {val:'FleetIdle:ignition',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on Ignition On/Off Status Codes]"},
    {val:'FleetIdle:startstop',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on Motion Start/Stop Status Codes]"},
    {val:'FleetIdle:engine',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on Engine Start/Stop Status Codes]"},
    {val:'FleetIdle:motion0',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on 0 Minute Minimum Stop]"},
    {val:'FleetIdle:motion5',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on 5 Minute Minimum Stop]"},
    {val:'FleetIdle:motion10',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on 10 Minute Minimum Stop]"},
    {val:'FleetIdle:motion20',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on 20 Minute Minimum Stop]"},
    {val:'FleetIdle:motion30',text:"Rapports résumés de la flotte:: Resum\u00e9 de temps idle pour la flotte[Based on 30 Minute Minimum Stop]"},
    {val:'FuelSummaryReport',text:"Rapports résumés de la flotte:: Raport resumé carburant"},
    {val:'FuelStopSummaryReport',text:"Rapports résumés de la flotte:: Fuel/Stop Summary Report"},
    {val:'StatusSummaryCount',text:"Rapports résumés de la flotte:: Status Summary Counts"},
    {val:'VehicleDriverBehavior',text:"Rapports résumés de la flotte:: Rapport comportement vehicule/conducteur"},
    {val:'UserLogin',text:"Rapports résumés de la flotte:: Rapport de connexion utilisateur"},]
}
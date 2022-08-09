export class Consommation {
  IDConsom: any;
  deviceID: any
  driverID: any;
  qte: any;
  montant: any;
  montantTTC: any;
  dateFill: any;
  dateFillString: any;
  kmPrecedent: any;
  kmEncours: any;
  pleinOn: any;
  consoM: any;
  fournisseur: any;
  numCarte: any;
  numBon: any;
  observation: any;

  constructor(
    IDConsom?,
    driverID?,
    dateFill?,
    montant?,
    numCarte?,
    qte?,
    kmPrecedent?,
    kmEncours?,
    fournisseur?,
    observation?,
    montantTTC?,
    numBon?,
    pleinOn?,
    consoM?,
    deviceID?
  ) {


    this.IDConsom = IDConsom ?? '';
    this.driverID = driverID ?? '';
    this.dateFill = dateFill ?? '';
    this.montant = montant ?? 0.0;
    this.numCarte = numCarte ?? '';
    this.qte = qte ?? 0;
    this.kmPrecedent = kmPrecedent ?? 0.0;
    this.kmEncours = kmEncours ?? 0.0;
    this.fournisseur = fournisseur ?? '';
    this.observation = observation ?? '';
    this.montantTTC = montantTTC ?? 0.0;
    this.numBon = numBon ?? '';
    this.pleinOn = pleinOn ?? 0;
    this.consoM = consoM ?? 0;
    this.deviceID = deviceID ?? '';
  }
}

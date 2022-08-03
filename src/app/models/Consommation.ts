export class Consommation {
  IDConsom: any;
  NumMat: any;
  NumChauf: any;
  date_heure: any;
  Montant: any;
  Carte: any;
  Qte: any;
  KmPrecedent: any;
  KmEncours: any;
  Fournisseur: any;
  Observation: any;
  MontantTTC: any;
  CiterneON: any;
  NumBon: any;
  PleinON: any;
  consoM: any;
  idVehicule: any

  constructor(
    IDConsom?, NumMat?, NumChauf?, date_heure?, Montant?, Carte?, Qte?, KmPrecedent?, KmEncours?, Fournisseur?, Observation?, MontantTTC?, CiterneON?, NumBon?, PleinON?, consoM?, idVehicule?) {


    this.IDConsom = IDConsom ?? '';
    this.NumMat = NumMat ?? '';
    this.NumChauf = NumChauf ?? '';
    this.date_heure = date_heure ?? '';
    this.Montant = Montant ?? 0.0;
    this.Carte = Carte ?? '';
    this.Qte = Qte ?? 0;
    this.KmPrecedent = KmPrecedent ?? 0.0;
    this.KmEncours = KmEncours ?? 0.0;
    this.Fournisseur = Fournisseur ?? '';
    this.Observation = Observation ?? '';
    this.MontantTTC = MontantTTC ?? 0.0;
    this.NumBon = NumBon ?? '';
    this.PleinON = PleinON ?? false;
    this.consoM = consoM ?? 0;
    // this.CiterneON = CiterneON ?? false;
    // this.idVehicule = idVehicule ?? '';
  }
}

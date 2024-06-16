
export class Stock {
  id: number;
  id_Store: any;
  DateMvt: any;
  DateMvtString: any;
  TypeMvt: any;//entre et sortie
  NumBon: any;//document
  login: any;
  Extra: any;
  PrixTotal:any;
  Reference: any;
  Tva: any;
  Price: any;
  Qte: any;
  id_Vehicule: any;
  id_TypePanne: any;
  Kilometrage: any;
  observation: any;
  Designation: any;
  idCiterne: any;
  id_delivery:any;
  QteTotal:any;


  constructor(id?, id_Store?, id_delivery?,PrixTotal?,QteTotal?, stockItems?, DateMvt?, DateMvtString? , TypeMvt?, NumBon?, Extra?, login?, Qte?, Price?, Tva?, Reference?, idCiterne?, id_Vehicule?, id_TypePanne?, Kilometrage?, observation?, Designation?) {
    this.id = id ?? ''
    this.id_Store = id_Store ?? 0
    this.DateMvt = DateMvt ?? 0
    this.DateMvtString = DateMvtString ?? ''
    this.TypeMvt = TypeMvt ?? 'E'
    this.NumBon = NumBon ?? ''
    this.Extra = Extra ?? ''
    this.login = login ?? ''
    this.Qte = Qte ?? 1
    this.Price = Price ?? 0
    this.Tva = Tva ?? 0
    this.PrixTotal=PrixTotal??''
     this.Reference=Reference ?? ''
    this.id_TypePanne = id_TypePanne ?? 0
    this.id_Vehicule = id_Vehicule ?? 0
    this.Kilometrage = Kilometrage ?? 0
    this.observation = observation ?? ''
    this.Designation = Designation ?? ''
    this.idCiterne = idCiterne ?? ''
 this.id_delivery= id_delivery ?? 0
 this.QteTotal=QteTotal??''


  }
}
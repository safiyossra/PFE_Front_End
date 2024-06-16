export class StockItem{
  
    Reference: any;
    Tva: any;
    Price: any;
    Qte:any;
    id_Vehicule: any;
    id_TypePanne: any;
    Kilometrage:any;
    constructor(Qte?, Price?, Tva?,Reference?, id_Vehicule?,id_TypePanne?, Kilometrage?) {
     ''
        this.Qte = Qte?? 1
        this.Price = Price?? 0
        this.Tva = Tva?? 0
        this.Reference= Reference?? ''
        this.id_TypePanne=id_TypePanne?? ''
        this.id_Vehicule=id_Vehicule??''
        this.Kilometrage= Kilometrage??''
       
      }





}
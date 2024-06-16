export class Passager{
id:number;
    lastName: any;
    FirstName: any;
    address: any;
    city: any;
    tel: any;
    cin: any;
    client: any;
    cood_gps: any;
    country:any;
    code:any;



    constructor(id?,lastName?, FirstName?, address?, city?, tel?, country?, cin?, client?,cood_gps?,code?) {
      this.lastName=lastName?? ''
      this.FirstName=FirstName?? ''
      this.address=address?? ''
      this.city=city?? ''
      this.tel=tel?? ''
      this.country=country?? ''
      this.cin=cin?? ''
      this.cood_gps=cood_gps?? ''
      this.code=code??''
      this.id=id;
      this.client=client??''
    }
  }

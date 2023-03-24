export class BillItem{
  ref: any
  designation: any
  quantity: any
  price: any
  tva: any
  remise: any
  totalHT: any
  totalTTC: any

  constructor(designation?, quantity?, price?, tva?, remise?, totalHT?, totalTTC?) {
    this.designation = designation?? ''
    this.quantity = quantity?? 1
    this.price = price?? 0.00
    this.tva=tva??0.00
    this.remise = remise?? 0.00
    this.totalHT = totalHT?? 0.00
    this.totalTTC=totalTTC??0.00
  }
}

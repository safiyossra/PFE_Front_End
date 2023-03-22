export class OrderItem{
  ref: any
  product: any
  selectedproducts : any
  designation: any
  quantity: any
  price: any
  tva: any
  remise: any
  totalHT: any
  totalTTC: any

  constructor(ref?, product?,selectedproducts?, designation?, quantity?, price?, tva?, remise?, totalHT?, totalTTC?) {
    this.ref = ref?? ''
    this.product = product?? ''
    this.selectedproducts = selectedproducts?? []
    this.designation = designation?? ''
    this.quantity = quantity?? 1
    this.price = price?? 0
    this.tva=tva??0
    this.remise = remise?? 0
    this.totalHT = totalHT?? 0
    this.totalTTC=totalTTC??0
  }
}

export class DeliveryItem{

ref: any
designation: any  
quantity: any
qtyDelivered: any
qty:any
price: any
tva: any
remise: any
totalHT: any
totalTTC: any


constructor(designation?, quantity?, qtyDelivered?, qty?, price?, tva?, remise?, totalHT?, totalTTC?) {
    this.designation = designation?? ''
    this.quantity = quantity?? 1
    this.qtyDelivered=qtyDelivered?? 0
    this.qty=qty??1
    this.price = price?? 0
    this.tva = tva?? 0
    this.remise = remise?? 0
    this.totalHT = totalHT?? 0
    this.totalTTC = totalTTC?? 0
  }

}
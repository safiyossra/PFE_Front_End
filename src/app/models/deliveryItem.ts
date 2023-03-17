export class DeliveryItem{

ref: any
designation: any  
quantity: any
qtyDelivered: any
qty:any
price: any
remise: any

constructor(designation?, quantity?, qtyDelivered?, qty?, price?, remise?) {
    this.designation = designation?? ''
    this.quantity = quantity?? '1'
    this.qtyDelivered=qtyDelivered?? ''
    this.qty=qty??''
    this.price = price?? '0.00'
    this.remise = remise?? '0.00'
  }

    // itemId: any
    // deliveryDate: any
    // deleverySupplierNum: any
    // orderSupplierNum: any
    // supplier: any
    // depot: any
    // billNum: any
    // settlementNum: any
    // constructor(deliveryDate?, deleverySupplierNum?, orderSupplierNum?, supplier?, depot?, billNum?, settlementNum?){
    //     this.deliveryDate=deliveryDate??''
    //     this.deleverySupplierNum=deleverySupplierNum??''
    //     this.supplier=supplier??''
    //     this.depot=depot??''
    //     this.billNum=billNum??''
    //     this.settlementNum=settlementNum??''
    // }
}
import {OrderItem} from "./orderItem";

export class OrderForm {
  orderNum: any
  createdAt: any
  deliveryDate: any
  depot: any
  supplier: any
  supplierAdress: any
  deliveryAdress: any
  orderItems: OrderItem[]
  totalHT: any
  totalTTC: any
  observation: any



  constructor(orderNum?, createdAt?, deliveryDate?, depot?, supplier?, supplierAdress?, deliveryAdress?, orderItems?, totalHT?, totalTTC?, observation?) {
    this.orderNum = orderNum?? ''
    this.createdAt = createdAt?? ''
    this.deliveryDate = deliveryDate?? ''
    this.depot = depot?? ''
    this.supplier = supplier?? ''
    this.supplierAdress = supplierAdress?? ''
    this.deliveryAdress = deliveryAdress?? ''
    this.orderItems = orderItems?? []
    this.totalHT=totalHT?? '0.00'
    this.totalTTC=totalTTC?? '0.00'
    this.observation=observation?? ''
  }
}

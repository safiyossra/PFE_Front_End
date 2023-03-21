import { DeliveryItem } from './deliveryItem';
export class DeliveryNote{
    deliveryNum: any
    createdAt: any
    deliveryItems: DeliveryItem[]
    orderNum: any
    supplier: any
    supplierDeliveryNum: any
    depot: any
    billNum: any
    settlementNum: any
    observation: any
    address: any
    totalHT: any
    totalTVA: any
    totalTTC: any
    constructor(createdAt?, deliveryItems?, orderNum?, supplier?, supplierDeliveryNum?, depot?, billNum?, settlementNum?, observation?, address?, totalHT?, totalTVA?, totalTTC?){
        this.createdAt=createdAt??''
        this.deliveryItems=deliveryItems??[new DeliveryItem]
        this.orderNum=orderNum??''
        this.supplier=supplier??''
        this.supplierDeliveryNum=supplierDeliveryNum??''
        this.depot=depot??''
        this.billNum=billNum??''
        this.settlementNum = settlementNum??''
        this.observation = observation??''
        this.address = address??''
        this.totalHT=totalHT??'00.00'
        this.totalTVA=totalTVA??'00.00'
        this.totalTTC=totalTTC??'00.00'
    }
}
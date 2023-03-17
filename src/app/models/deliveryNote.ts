import { DeliveryItem } from './deliveryItem';
export class DeliveryNote{
    deliveryNum: any
    createdAt: any
    deliveryItems: DeliveryItem[]
    supplier: any
    depot: any
    bill: any
    settlementNum: any
    constructor(createdAt?, deliveryItems?, supplier?, depot?, bill?, settlementNum?){
        this.createdAt=createdAt??''
        this.deliveryItems=deliveryItems??[]
        this.supplier=supplier??''
        this.depot=depot??''
        this.bill=bill??''
        this.settlementNum = settlementNum??''
    }
}
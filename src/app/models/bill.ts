import { BillItem } from "./billItem"
export class Bill{
  billNum: any
  createdAt: any
  dueDate: any
  supplierBillNum: any
  supplier: any
  supplierAdress: any
  billItems: BillItem[]
  totalHT: any
  totalTVA:any
  totalTTC: any
  doneWith: any
  toFix: any
  settlementMode: any
  dnInvoiced: any[]
  observation: any



  constructor(createdAt?, dueDate?, supplierBillNum?, supplier?, supplierAdress?, billItems? , totalHT?, totalTVA?, totalTTC?, doneWith?, toFix?, settlementMode?, dnInvoiced?, observation?) {
    this.createdAt = createdAt?? ''
    this.supplierBillNum = supplierBillNum?? ''
    this.createdAt = createdAt?? ''

    this.supplier = supplier?? ''
    this.supplierAdress = supplierAdress?? ''
    this.createdAt = createdAt?? ''
    this.supplierAdress = supplierAdress?? ''
    this.billItems = billItems?? [new BillItem()]

    this.totalHT=totalHT?? 0.00
    this.totalTVA=totalTVA?? 0.00
    this.totalTTC=totalTTC?? 0.00
    this.doneWith = doneWith?? ''
    this.toFix = toFix?? ''
    this.settlementMode = settlementMode??  ''
    this.dnInvoiced=dnInvoiced?? []
    this.observation=observation?? ''
  }
}

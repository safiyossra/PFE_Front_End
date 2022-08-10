export class PlanEntretien {
    id: any
    deviceID: any
    typeDeclenchement: any
    decKmValue: any
    decDateValue: any
    decDateValueString: any
    kmValue: any
    dateValue: any
    operation: any
    motif: any
    status: any
    creationTime: string

    constructor(id?, deviceID?, operation?, typeDeclenchement?, decDateValue?, decDateValueString?, decKmValue?, kmValue?, dateValue?, motif?, status?, creationTime?) {
        this.id = id ?? 0
        this.deviceID = deviceID
        this.typeDeclenchement = typeDeclenchement ?? 1
        this.decKmValue = decKmValue ?? 0
        this.decDateValue = decDateValue ?? 0
        this.decDateValueString = decDateValueString ?? ''
        this.kmValue = kmValue ?? 0
        this.dateValue = dateValue ?? 0
        this.operation = operation
        this.motif = motif ?? ''
        this.status = status ?? ''
        this.creationTime = creationTime ?? ''
    }
}
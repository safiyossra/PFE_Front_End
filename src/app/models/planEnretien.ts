export class PlanEntretien {
    IDPlanEntretien: any
    creationTime: string
    device: any
    decDate: any
    decKm: any
    decKmValue: any
    decDateValue: any
    operation: any
    motif: any
    kmActuel: any
    status: any

    constructor(IDPlanEntretien?, device?, operation?, kmActuel?, decDate?, decKm?, decDateValue?, decKmValue?, motif?, status?, creationTime?) {
        this.IDPlanEntretien = IDPlanEntretien ?? 0
        this.creationTime = creationTime ?? ''
        this.device = device ?? ''
        this.decDate = decDate ?? '0'
        this.decKm = decKm ?? '1'
        this.decDateValue = decDateValue
        this.decKmValue = decKmValue ?? '0'
        this.operation = operation ?? 0
        this.motif = motif ?? ''
        this.kmActuel = kmActuel ?? 0
        this.status = status ?? ''
    }
}
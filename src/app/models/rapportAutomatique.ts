export class RapportAutomatique {
    rapportID: any
    description: any
    interval: any
    fromtime: any
    totime: any
    recipients: any
    grouprapport: any
    group: any
    isActive: any
    creationtime:any

    constructor(rapportID?,isActive?,description?, fromtime?,recipients?, interval?,  totime?,
        grouprapport?, group?, creationtime? ) {
        this.rapportID = rapportID ?? ''
        this.description = description ?? ''
        this.interval = interval ?? ''
        this.fromtime = fromtime ?? ''
        this.totime = totime ?? ''
        this.grouprapport = grouprapport ?? ''
        this.recipients = recipients ?? ''
        this.group = group ?? ''
        this.isActive = isActive ?? 0
        this.creationtime = creationtime ?? ''
    }
}

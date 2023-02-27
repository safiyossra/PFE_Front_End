export class RapportAutomatique {
    reportJobID: any
    description: any
    intervalTag: any
    reportTimeFrom: any
    reportTimeTo: any
    reportTimeFromString: any
    reportTimeToString: any
    creationtimeString: any
    recipients: any
    reportName: any
    groupID: any
    isActive: any
    creationtime:any

    constructor(reportJobID?,isActive?,description?, reportTimeFrom?,recipients?, intervalTag?, reportTimeTo?,
        reportName?, groupID?, creationtime?,reportTimeFromString?,reportTimeToString?,creationtimeString? ) {
        this.reportJobID = reportJobID ?? ''
        this.description = description ?? ''
        this.intervalTag = intervalTag ?? ''
        this.reportTimeFrom = reportTimeFrom ?? 0
        this.reportTimeTo = reportTimeTo ?? 0
        this.reportTimeToString = reportTimeToString ?? ''
        this.reportTimeFromString = reportTimeFromString ?? ''
        this.reportName = reportName ?? ''
        this.recipients = recipients ?? ''
        this.groupID = groupID ?? ''
        this.isActive = isActive ?? 0
        this.creationtime = creationtime ?? ''
        this.creationtimeString = creationtimeString ?? ''
    }
}

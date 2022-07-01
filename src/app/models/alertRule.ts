export class AlertRule {
    isActive: any
    ruleID: any
    creationTime: string
    description: any
    notifyEmail: any
    isCronRule: any
    minNotifyAge: any

    constructor(isActive?, ruleID?, creationTime?, description?, notifyEmail?, isCronRule?, minNotifyAge?) {
        this.isActive = isActive ?? 0
        this.creationTime = creationTime ?? ''
        this.description = description ?? ''
        this.ruleID = ruleID ?? ''
        this.notifyEmail = notifyEmail ?? ''
        this.isCronRule = isCronRule ?? 0
        this.minNotifyAge = minNotifyAge ?? 0
    }
}
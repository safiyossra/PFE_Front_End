export class AlertRule {
    isActive: any
    ruleID: any
    creationTime: string
    description: any
    notifyEmail: any
    ruleTag: any
    minNotifyAge: any
    selector: any
    g: any
    v: any
    s: any

    constructor(isActive?, ruleID?, creationTime?, description?, notifyEmail?, ruleTag?, minNotifyAge?, selector?, v?, s?, g?) {
        this.isActive = isActive ?? 0
        this.creationTime = creationTime ?? ''
        this.description = description ?? ''
        this.ruleID = ruleID ?? ''
        this.notifyEmail = notifyEmail ?? ''
        this.ruleTag = ruleTag ?? '0'
        this.minNotifyAge = minNotifyAge ?? 0
        this.selector = selector ?? ''
        this.g = g ?? '-'
        this.v = v ?? '-'
        this.s = s ?? '0'
    }
}
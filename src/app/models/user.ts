export class User {
    userID: any
    description: any
    contactPhone: any
    password: any
    contactEmail: any
    contactName: any
    notifyEmail: any
    timeZone: any
    isActive: any
    notes:any

    constructor(isActive?,userID?, contactPhone?, password?, contactEmail?,
         description?, contactName?, notifyEmail?, timeZone?, notes?) {
        this.userID = userID ?? ''
        this.description = description ?? ''
        this.contactPhone = contactPhone ?? ''
        this.password = password ?? ''
        this.contactEmail = contactEmail ?? ''
        this.notifyEmail = notifyEmail ?? ''
        this.contactName = contactName ?? ''
        this.timeZone = timeZone ?? ''
        this.isActive = isActive ?? 0
        this.notes = notes ?? ''
    }
}
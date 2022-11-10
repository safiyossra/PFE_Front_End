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
    groups : any
    confirmPass?: any
    permissions?: any

    constructor(userID?,isActive?,description?, password?,contactName?, contactPhone?,  contactEmail?,
           notifyEmail?, timeZone?,groups?, notes? ,permissions?) {
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
        this.permissions = permissions ?? ''
        this.groups = groups ?? '*'
    }
}

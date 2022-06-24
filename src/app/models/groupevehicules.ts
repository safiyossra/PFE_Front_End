export class Groupevehicules {
    groupID: any
    description: any
    displayName: any
    vehiclues : any

    constructor(groupID?, description?, displayName?, vehiclues?) {
        this.groupID = groupID ?? ''
        this.description = description ?? ''
        this.vehiclues = vehiclues ?? ''
        this.displayName = displayName ?? ''
    }
}
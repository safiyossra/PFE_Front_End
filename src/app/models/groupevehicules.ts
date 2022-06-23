export class Groupevehicules {
    groupID: any
    description: any
    deviceID: any

    constructor(groupID?, description?, deviceID?) {
        this.groupID = groupID ?? ''
        this.description = description ?? ''
        this.deviceID = deviceID ?? ''
    }
}
export class Zone {
    accountID: any
    clientID: any
    groupID: any
    description: any
    isActive: any
    zoneType: ZoneType
    radius: any
    shapeColor: any
    latitude1: any
    latitude2: any
    latitude3: any
    latitude4: any
    latitude5: any
    latitude6: any
    latitude7: any
    latitude8: any
    latitude9: any
    latitude10: any
    longitude1: any
    longitude2: any
    longitude3: any
    longitude4: any
    longitude5: any
    longitude6: any
    longitude7: any
    longitude8: any
    longitude9: any
    longitude10: any
    creationTime: any

    constructor() {
        this.accountID = ''
        this.clientID = ''
        this.groupID = ''
        this.description = ''
        this.isActive = false
        this.zoneType = null
        this.radius = 5
        this.shapeColor = ''
        this.latitude1 = 0
        this.latitude2 = 0
        this.latitude3 = 0
        this.latitude4 = 0
        this.latitude5 = 0
        this.latitude6 = 0
        this.latitude7 = 0
        this.latitude8 = 0
        this.latitude9 = 0
        this.latitude10 = 0
        this.longitude1 = 0
        this.longitude2 = 0
        this.longitude3 = 0
        this.longitude4 = 0
        this.longitude5 = 0
        this.longitude6 = 0
        this.longitude7 = 0
        this.longitude8 = 0
        this.longitude9 = 0
        this.longitude10 = 0
    }
}

export enum ZoneType {
    Circle = 0,
    Polygon = 3,
    Point = 4,
}

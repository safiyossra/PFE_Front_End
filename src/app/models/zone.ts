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
        this.accountID = null
        this.clientID = null
        this.groupID = null
        this.description = null
        this.isActive = null
        this.zoneType = null
        this.radius = null
        this.shapeColor = null
        this.latitude1 = null
        this.latitude2 = null
        this.latitude3 = null
        this.latitude4 = null
        this.latitude5 = null
        this.latitude6 = null
        this.latitude7 = null
        this.latitude8 = null
        this.latitude9 = null
        this.latitude10 = null
        this.longitude1 = null
        this.longitude2 = null
        this.longitude3 = null
        this.longitude4 = null
        this.longitude5 = null
        this.longitude6 = null
        this.longitude7 = null
        this.longitude8 = null
        this.longitude9 = null
        this.longitude10 = null
    }

    get latLngs() {
        var latlngs = [
            [this.latitude1, this.longitude1],
            [this.latitude2, this.longitude2],
            [this.latitude3, this.longitude3],
            [this.latitude4, this.longitude4],
            [this.latitude5, this.longitude5],
            [this.latitude6, this.longitude6],
            [this.latitude7, this.longitude7],
            [this.latitude8, this.longitude8],
            [this.latitude9, this.longitude9],
            [this.latitude10, this.longitude10],
        ]

        var filtered = latlngs.filter(elem => elem[0] != null && elem[0] != null);

        return filtered
    }
}

export enum ZoneType {
    Circle = 0,
    Polygon = 3,
    Point = 4,
}

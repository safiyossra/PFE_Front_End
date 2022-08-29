export class Zone {
    geozoneID: any
    clientID: any
    groupID: any
    description: any
    isActive: any
    reverseGeocode: any
    zoneType: ZoneType
    radius: any
    iconName: any
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

    minLongitude: any
    maxLongitude: any
    minLatitude: any
    maxLatitude: any

    constructor() {
        this.geozoneID = null
        this.clientID = null
        this.groupID = null
        this.description = ''
        this.isActive = 1
        this.reverseGeocode = 1
        this.zoneType = null
        this.radius = 30
        this.iconName = null
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

        this.minLongitude = null
        this.maxLongitude = null
        this.minLatitude = null
        this.maxLatitude = null
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

        var filtered = latlngs.filter(elem => elem[0] != null && elem[1] != null && elem[0] != 0 && elem[1] != 0);

        return filtered
    }

    setMinMax(bounds:any){
      if(bounds){
        this.maxLatitude = bounds.getNorthEast().lat;
        this.minLatitude = bounds.getSouthWest().lat;

        this.maxLongitude = bounds.getNorthEast().lng;
        this.minLongitude = bounds.getSouthWest().lng;
      }
    }

    setLatLngs(latlng: any) {
        if (latlng[0]) {
            this.latitude1 = latlng[0].lat
            this.longitude1 = latlng[0].lng
        } else {
            this.latitude1 = 0
            this.longitude1 = 0
        }
        if (latlng[1]) {
            this.latitude2 = latlng[1].lat
            this.longitude2 = latlng[1].lng
        } else {
            this.latitude2 = 0
            this.longitude2 = 0
        }
        if (latlng[2]) {
            this.latitude3 = latlng[2].lat
            this.longitude3 = latlng[2].lng
        } else {
            this.latitude3 = 0
            this.longitude3 = 0
        }
        if (latlng[3]) {
            this.latitude4 = latlng[3].lat
            this.longitude4 = latlng[3].lng
        } else {
            this.latitude4 = 0
            this.longitude4 = 0
        }
        if (latlng[4]) {
            this.latitude5 = latlng[4].lat
            this.longitude5 = latlng[4].lng
        } else {
            this.latitude5 = 0
            this.longitude5 = 0
        }
        if (latlng[5]) {
            this.latitude6 = latlng[5].lat
            this.longitude6 = latlng[5].lng
        } else {
            this.latitude6 = 0
            this.longitude6 = 0
        }
        if (latlng[6]) {
            this.latitude7 = latlng[6].lat
            this.longitude7 = latlng[6].lng
        } else {
            this.latitude7 = 0
            this.longitude7 = 0
        }
        if (latlng[7]) {
            this.latitude8 = latlng[7].lat
            this.longitude8 = latlng[7].lng
        } else {
            this.latitude8 = 0
            this.longitude8 = 0
        }
        if (latlng[8]) {
            this.latitude9 = latlng[8].lat
            this.longitude9 = latlng[8].lng
        } else {
            this.latitude9 = 0
            this.longitude9 = 0
        }
        if (latlng[9]) {
            this.latitude10 = latlng[9].lat
            this.longitude10 = latlng[9].lng
        } else {
            this.latitude10 = 0
            this.longitude10 = 0
        }
    }
}

export enum ZoneType {
    Circle = 0,
    Polygon = 3,
    Marker = 4,
}

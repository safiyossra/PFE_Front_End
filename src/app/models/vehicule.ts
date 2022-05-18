export class Vehicule {
    id: any         // Device
    name: string    // Device_desc
    timestamp: any  // EventData.Timestamp
    statusCode: any // EventData.StatusCode
    lat: any  // EventData.GPSPoint_lat
    lng: any  // EventData.GPSPoint_lon
    heading: any  // EventData.Heading
    speed: any  // EventData.Speed
    fuelLevel: any // EventData.fuelLevel

    constructor({ id, name, timestamp, statusCode, lat, lng, heading, speed, fuelLevel }) {
        this.id = id
        this.name = name ?? ''
        this.timestamp = timestamp ?? 0
        this.statusCode = statusCode ?? ''
        this.lat = lat ?? 0
        this.lng = lng ?? 0
        this.heading = heading ?? 0
        this.speed = speed ?? 0
        this.fuelLevel = fuelLevel ?? 0
    }
}

export class Vehicule {
    id: any         // Device
    name: string    // Device_desc
    timestamp: any  // EventData.Timestamp
    statusCode: any // EventData.StatusCode
    address: any
    odometer: any
    acceleration: any
    simCard: any
    deviceCode: any 
    lat: any  // EventData.GPSPoint_lat
    lng: any  // EventData.GPSPoint_lon
    heading: any  // EventData.Heading
    speed: any  // EventData.Speed,
    icon: any
    fuelLevel: any // EventData.fuelLevel
    driverID: any 

    constructor(id?, name?, timestamp?, statusCode?, address?, odometer?, acceleration?, simCard?, deviceCode?, lat?, lng?, heading?, speed?, icon?, fuelLevel?,driverID?) {
        this.id = id ?? ''
        this.name = name ?? ''
        this.timestamp = timestamp ?? 0
        this.statusCode = statusCode ?? ''

        this.address = address ?? ''
        this.odometer = odometer ?? ''
        this.acceleration = acceleration ?? ''
        this.simCard = simCard ?? ''
        this.deviceCode = deviceCode ?? ''
        this.lat = lat ?? 0
        this.lng = lng ?? 0
        this.heading = heading ?? 0
        this.speed = speed ?? 0
        this.icon = icon ?? 0
        this.fuelLevel = fuelLevel ?? 0
        this.driverID = driverID ?? ''
    }
}

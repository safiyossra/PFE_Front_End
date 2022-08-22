export class Device {
    isActive: any
    deviceID: any
    creationTime: string
    uniqueID: any
    pushpinID: any
    description: any
    vehicleID: any
    vehicleMake: any
    vehicleModel: any
    serialNumber: any
    simPhoneNumber: any
    speedLimitKPH: any
    fuelEconomy: any
    fuelCostPerLiter: any
    fuelCapacity: any
    fuelCapacity2: any
    lastOdometerKM: any
    registrationExpire:any
    insuranceExpire:any
    registrationExpireString:any
    insuranceExpireString:any
    odometerOffsetKM:any

    constructor(isActive?, deviceID?, creationTime?, uniqueID?, description?, vehicleID?, vehicleMake?, vehicleModel?, serialNumber?,
        simPhoneNumber?, speedLimitKPH?, fuelEconomy?, fuelCostPerLiter?, fuelCapacity?, fuelCapacity2?, lastOdometerKM?, pushpinID?, registrationExpire?, insuranceExpire?) {
        this.deviceID = deviceID ?? ''
        this.isActive = isActive ?? 0
        this.creationTime = creationTime ?? ''
        this.pushpinID = pushpinID ?? 'default'
        this.description = description ?? ''
        this.uniqueID = uniqueID ?? ''
        this.vehicleID = vehicleID ?? ''
        this.vehicleMake = vehicleMake ?? ''
        this.vehicleModel = vehicleModel ?? ''
        this.serialNumber = serialNumber ?? ''
        this.simPhoneNumber = simPhoneNumber ?? ''
        this.speedLimitKPH = speedLimitKPH ?? 0
        this.fuelEconomy = fuelEconomy ?? 0
        this.fuelCostPerLiter = fuelCostPerLiter ?? 0
        this.fuelCapacity = fuelCapacity ?? 0
        this.fuelCapacity2 = fuelCapacity2 ?? 0
        this.lastOdometerKM = lastOdometerKM ?? 0
        this.registrationExpire = registrationExpire ?? 0
        this.insuranceExpire = insuranceExpire ?? 0
      }
}

export class Driver {
    driverID: any
    contactPhone: any
    displayName: any
    contactEmail: any
    badgeID: any
    birthdate: any
    licenseType: any
    licenseNumber: any
    licenseExpire: any
    carTitle: any
    description: any
    licensePlate: string
    insuranceExpire: any
    address: any
    restrictions: any
    notes: any
    deviceID: any

    constructor(driverID?, contactPhone?, displayName?, contactEmail?, badgeID?, birthdate?, licenseType?, licenseNumber?, licenseExpire?,
        carTitle?, description?, licensePlate?, insuranceExpire?, address?, restrictions?, notes?, deviceID?) {
        this.driverID = driverID ?? ''
        this.contactPhone = contactPhone ?? ''
        this.displayName = displayName ?? ''
        this.contactEmail = contactEmail ?? ''
        this.badgeID = badgeID ?? ''
        this.birthdate = birthdate ?? 0
        this.licenseType = licenseType ?? ''
        this.licenseNumber = licenseNumber ?? ''
        this.licenseExpire = licenseExpire ?? 0
        this.carTitle = carTitle ?? ''
        this.description = description ?? ''
        this.licensePlate = licensePlate ?? ''
        this.insuranceExpire = insuranceExpire ?? 0
        this.address = address ?? ''
        this.restrictions = restrictions ?? ''
        this.notes = notes ?? ''
        this.deviceID = deviceID ?? ''
    }
}
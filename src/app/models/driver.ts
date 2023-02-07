export class Driver {
    driverID: any
    contactPhone: any
    displayName: any
    contactEmail: any
    badgeID: any
    birthdate: any
    birthdateString: any
    licenseType: any
    licenseNumber: any
    licenseExpire: any
    licenseExpireString: any
    carTitle: any
    description: any
    licensePlate: string
    insuranceExpire: any
    insuranceExpireString: any
    address: any
    restrictions: any
    notes: any
    deviceID: any
    dutyStatus: any


    constructor(driverID?, contactPhone?, displayName?, contactEmail?, badgeID?, birthdate?, licenseType?, licenseNumber?, licenseExpire?,
        carTitle?, description?, licensePlate?, insuranceExpire?, address?, restrictions?, notes?, deviceID?, birthdateString?, licenseExpireString?, insuranceExpireString?,dutyStatus?,
    ) {
        this.driverID = driverID ?? ''
        this.dutyStatus = dutyStatus ?? 1
        this.contactPhone = contactPhone ?? ''
        this.displayName = displayName ?? ''
        this.contactEmail = contactEmail ?? ''
        this.badgeID = badgeID ?? ''
        this.birthdate = birthdate ?? 0
        this.birthdateString = birthdateString ?? ''
        this.licenseType = licenseType ?? ''
        this.licenseNumber = licenseNumber ?? ''
        this.licenseExpire = licenseExpire ?? 0
        this.licenseExpireString = licenseExpireString ?? ''
        this.carTitle = carTitle ?? ''
        this.description = description ?? ''
        this.licensePlate = licensePlate ?? ''
        this.insuranceExpire = insuranceExpire ?? 0
        this.insuranceExpireString = insuranceExpireString ?? ''
        this.address = address ?? ''
        this.restrictions = restrictions ?? ''
        this.notes = notes ?? ''
        this.deviceID = deviceID ?? ''

    }
}
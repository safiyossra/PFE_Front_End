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

    numPermis: any

    typePermis: any
    dateDelivrancePermis: any
    dateValiditePermis: any
    rappelJoursPermis: any

    numAdr: any
    dateValiditeAdr: any
    rappelJoursAdr: any

    numPassport: any
    dateValiditePassport: any
    rappelJoursPasssport: any

    numVisa: any
    dateValiditeVisa: any
    rappelJoursVisa: any

    dateValiditeVisit: any
    rappelJoursVisit: any

    numAssurance: any
    dateValiditeAssurance: any
    rappelJoursAssurance: any

    constructor(driverID?, contactPhone?, displayName?, contactEmail?, badgeID?, birthdate?, licenseType?, licenseNumber?, licenseExpire?,
        carTitle?, description?, licensePlate?, insuranceExpire?, address?, restrictions?, notes?, deviceID?, birthdateString?, licenseExpireString?, insuranceExpireString?,
        numPermis?, typePermis?, dateDelivrancePermis?, dateValiditePermis?, rappelJoursPermis?,
        numAdr?, dateValiditeAdr?, rappelJoursAdr?,
        numPassport?, dateValiditePassport?, rappelJoursPasssport?,
        numVisa?, dateValiditeVisa?, rappelJoursVisa?,
        dateValiditeVisit?, rappelJoursVisit?,
        numAssurance?, dateValiditeAssurance?, rappelJoursAssurance?,) {
        this.driverID = driverID ?? ''
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
        this.numPermis = numPermis ?? ''
        this.dateDelivrancePermis = dateDelivrancePermis ?? ''
        this.dateValiditePermis = dateValiditePermis ?? ''
        this.rappelJoursPermis = rappelJoursPermis ?? ''
        this.typePermis = typePermis

        this.numAdr = numAdr
        this.dateValiditeAdr = dateValiditeAdr
        this.rappelJoursAdr = rappelJoursAdr

        this.numPassport = numPassport
        this.dateValiditePassport = dateValiditePassport
        this.rappelJoursPasssport = rappelJoursPasssport

        this.numVisa = numVisa
        this.dateValiditeVisa = dateValiditeVisa
        this.rappelJoursVisa = rappelJoursVisa

        this.dateValiditeVisit = dateValiditeVisit
        this.rappelJoursVisit = rappelJoursVisit

        this.numAssurance = numAssurance
        this.dateValiditeAssurance = dateValiditeAssurance
        this.rappelJoursAssurance = rappelJoursAssurance
    }
}


export class DriverDocument {
    idDocument: any
    accountID: any
    driverID: any
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



    constructor(
        idDocument?: any,
        accountID?: any,
        driverID?: any,
        numPermis?: any,
        typePermis?: any,
        dateDelivrancePermis?: any,
        dateValiditePermis?: any,
        rappelJoursPermis?: any,
        numAdr?: any,
        dateValiditeAdr?: any,
        rappelJoursAdr?: any,
        numPassport?: any,
        dateValiditePassport?: any,
        rappelJoursPasssport?: any,
        numVisa?: any,
        dateValiditeVisa?: any,
        rappelJoursVisa?: any,
        dateValiditeVisit?: any,
        rappelJoursVisit?: any,
        numAssurance?: any,
        dateValiditeAssurance?: any,
        rappelJoursAssurance?: any

    ) {
        this.idDocument = idDocument ?? ''
        this.accountID = accountID ?? ''
        this.driverID = driverID ?? ''
        this.typePermis = typePermis ?? ''
        this.dateDelivrancePermis = dateDelivrancePermis ?? 0
        this.dateValiditePermis = dateValiditePermis ?? 0
        this.rappelJoursPermis = rappelJoursPermis ?? 0
        this.numAdr = numAdr ?? ''
        this.dateValiditeAdr = dateValiditeAdr ?? 0
        this.rappelJoursAdr = rappelJoursAdr ?? 0
        this.numPassport = numPassport ?? ''
        this.dateValiditePassport = dateValiditePassport ?? 0
        this.rappelJoursPasssport = rappelJoursPasssport ?? 0
        this.numVisa = numVisa ?? ''
        this.dateValiditeVisa = dateValiditeVisa ?? 0
        this.rappelJoursVisa = rappelJoursVisa ?? 0
        this.dateValiditeVisit = dateValiditeVisit ?? 0
        this.rappelJoursVisit = rappelJoursVisit ?? 0
        this.numAssurance = numAssurance ?? ''
        this.dateValiditeAssurance = dateValiditeAssurance ?? 0
        this.rappelJoursAssurance = rappelJoursAssurance ?? 0
        this.numPermis = numPermis ?? ''
    }


}
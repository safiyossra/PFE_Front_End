export class CarDocument {

    idDocument: any
    typeDocument: any
    dateContrat: any
    dateProchain: any
    rapelJours: any
    societe: any
    deviceID: any
    accountID: any
    joursReste: any
    colorRest: any
    montant: any

    constructor(idDocument?, typeDocument?, dateContrat?, dateProchain?, rapelJours?, societe?, deviceID?, accountID?, joursReste?, colorRest?,
        montant?) {
        this.accountID = accountID ?? ''
        this.idDocument = idDocument ?? ''
        this.typeDocument = typeDocument ?? ''
        this.dateContrat = dateContrat ?? ''
        this.dateProchain = dateProchain ?? ''
        this.rapelJours = rapelJours ?? 0
        this.societe = societe ?? ''
        this.deviceID = deviceID ?? ''
        this.joursReste = joursReste ?? ''
        this.colorRest = colorRest ?? ''
        this.montant = montant ?? 0
    }





}
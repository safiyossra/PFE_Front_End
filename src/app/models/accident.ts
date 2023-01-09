export class Accident {
    accidentID: any
    deviceID: any
    driverID: any
    driverName: any
    deviceName: any
    assuranceID: any
    date: any
    degatType: any
    lieu: any
    degatApparents: any
    observation: any
    statut: any
    typeAssurance: any
    etapeAssurance: any
    etapeAssuranceName: any
    icons: any[] = []
    constructor(accidentId?, deviceId?, driverId?, assuranceId?, date?, time?, degatType?,
        lieu?, degatApparents?, observation?, etapeAssurance?, statut?) {

        this.accidentID = accidentId ?? ''
        this.deviceID = deviceId ?? ''
        this.driverID = driverId ?? ''
        this.assuranceID = assuranceId ?? ''
        this.date = date ?? ''
        this.degatType = degatType ?? []
        this.lieu = lieu ?? ''
        this.degatApparents = degatApparents ?? ''
        this.observation = observation ?? ''
        this.etapeAssurance = etapeAssurance ?? ''
        this.statut = statut

    }
}
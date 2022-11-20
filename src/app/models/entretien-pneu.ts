export class EntretienPneu {

    idPneu: any
    NumSerie: any
    EtatPneu: any
    KmAcquisition: any
    DateDebut: any
    DateFin: any
    deviceID: any
    Fournisseurs: any
    ModelePneu: any
    MarquePneu: any
    Montant: any
    LieuMontage: any
    FraisMontage: any
    Observation: any
    MotifChangPneu: any
    PositionPneu: string
    DimensionPneu: any
    operation: any
    creationTime: string
    idAxe: any
    indexAxe: any
    deviceName: any



    constructor(NumSerie?, EtatPneu?, KmAcquisition?, DateDebut?, DateFin?, deviceID?, Fournisseurs?, ModelePneu?, MarquePneu?, Montant?, LieuMontage?,
        FraisMontage?, Observation?, idAxe?, indexAxe?, PositionPneu?, MotifChangPneu?, DimensionPneu?, creationTime?) {

        this.NumSerie = NumSerie ?? 0
        this.EtatPneu = EtatPneu ?? []
        this.KmAcquisition = KmAcquisition ?? 0
        this.DateDebut = DateDebut ?? ''
        this.DateFin = DateFin ?? ''
        this.deviceID = deviceID ?? []
        this.Fournisseurs = Fournisseurs ?? ''
        this.ModelePneu = ModelePneu ?? []
        this.MarquePneu = MarquePneu ?? []
        this.Montant = Montant ?? 0
        this.LieuMontage = LieuMontage ?? ''
        this.FraisMontage = FraisMontage ?? 0
        this.Observation = Observation ?? ''
        this.MotifChangPneu = MotifChangPneu ?? []
        this.PositionPneu = PositionPneu ?? ''
        this.DimensionPneu = DimensionPneu ?? []
        this.indexAxe = indexAxe ?? 0
        this.idAxe = idAxe ?? ''
    }
}

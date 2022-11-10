export class EntretienPneu {

    IDPneu: any
    NumSerie: any
    EtatPneu: any
    KmAcquisition: any
    DateDebut: any
    DateFin: any
    IDVehicule: any
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
    decDateValueString: any
    decDateValue: any
    idAxe: any
    indexAxe: any
    deviceName: any


    constructor(IDPneumatique?, NumSerie?, EtatPneu?, KmAcquisition?, DateDebut?, DateFin?, IDVehicule?, Fournisseurs?, ModelePneu?, MarquePneu?, Montant?, LieuMontage?,
        FraisMontage?, Observation?, idAxe?, indexAxe?, PositionPneu?, MotifChangPneu?, DimensionPneu?, creationTime?) {

        this.IDPneu = IDPneumatique ?? 0
        this.NumSerie = NumSerie ?? 0
        this.EtatPneu = EtatPneu ?? 0
        this.KmAcquisition = KmAcquisition ?? 0
        this.DateDebut = DateDebut ?? ''
        this.DateFin = DateFin ?? ''
        this.IDVehicule = IDVehicule ?? 0
        this.Fournisseurs = Fournisseurs ?? ''
        this.ModelePneu = ModelePneu ?? ''
        this.MarquePneu = MarquePneu
        this.Montant = Montant ?? 0
        this.LieuMontage = LieuMontage ?? ''
        this.FraisMontage = FraisMontage ?? 0
        this.Observation = Observation ?? ''
        this.MotifChangPneu = MotifChangPneu ?? 0
        this.PositionPneu = PositionPneu ?? ''
        this.DimensionPneu = DimensionPneu ?? 0
        this.creationTime = creationTime ?? ''
        this.indexAxe = indexAxe ?? 0
        this.idAxe = idAxe ?? ''
    }
}
